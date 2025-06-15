<?php
class SEO {
    private $siteUrl;
    private $siteName;
    private $defaultImage;
    private $socialProfiles;
    private $logger;
    
    public function __construct($siteUrl, $siteName, $defaultImage = '', $socialProfiles = [], $logger = null) {
        $this->siteUrl = rtrim($siteUrl, '/');
        $this->siteName = $siteName;
        $this->defaultImage = $defaultImage;
        $this->socialProfiles = $socialProfiles;
        $this->logger = $logger;
    }
    
    public function generateMetaTags($title, $description, $image = '', $type = 'website') {
        $image = $image ?: $this->defaultImage;
        
        return [
            'title' => $this->formatTitle($title),
            'description' => $this->formatDescription($description),
            'canonical' => $this->getCanonicalUrl(),
            'og' => [
                'title' => $title,
                'description' => $description,
                'type' => $type,
                'url' => $this->getCanonicalUrl(),
                'image' => $image,
                'site_name' => $this->siteName
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => $title,
                'description' => $description,
                'image' => $image
            ]
        ];
    }
    
    public function generateBreadcrumbs($path) {
        $segments = explode('/', trim($path, '/'));
        $breadcrumbs = [];
        $currentPath = '';
        
        foreach ($segments as $segment) {
            $currentPath .= '/' . $segment;
            $breadcrumbs[] = [
                'name' => $this->formatBreadcrumbName($segment),
                'url' => $this->siteUrl . $currentPath
            ];
        }
        
        return $breadcrumbs;
    }
    
    public function generateStructuredData($type, $data) {
        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => $type
        ];
        
        return array_merge($structuredData, $data);
    }
    
    public function generateSitemap($pages) {
        $sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');
        
        foreach ($pages as $page) {
            $url = $sitemap->addChild('url');
            $url->addChild('loc', $this->siteUrl . $page['path']);
            $url->addChild('lastmod', $page['lastmod']);
            $url->addChild('changefreq', $page['changefreq']);
            $url->addChild('priority', $page['priority']);
        }
        
        return $sitemap->asXML();
    }
    
    public function generateRobotsTxt($disallowPaths = [], $allowPaths = []) {
        $content = "User-agent: *\n";
        
        foreach ($disallowPaths as $path) {
            $content .= "Disallow: $path\n";
        }
        
        foreach ($allowPaths as $path) {
            $content .= "Allow: $path\n";
        }
        
        $content .= "\nSitemap: {$this->siteUrl}/sitemap.xml\n";
        
        return $content;
    }
    
    private function formatTitle($title) {
        return $title . ' | ' . $this->siteName;
    }
    
    private function formatDescription($description) {
        return substr(strip_tags($description), 0, 160);
    }
    
    private function formatBreadcrumbName($segment) {
        return ucwords(str_replace(['-', '_'], ' ', $segment));
    }
    
    private function getCanonicalUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        return $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    }
    
    public function trackPageView($page, $data = []) {
        if ($this->logger) {
            $this->logger->info('Page View', array_merge([
                'page' => $page,
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'ip' => $_SERVER['REMOTE_ADDR'],
                'referrer' => $_SERVER['HTTP_REFERER'] ?? '',
                'timestamp' => date('Y-m-d H:i:s')
            ], $data));
        }
    }
}

// Usage example:
// $seo = new SEO(
//     'https://rescuepcrepairs.com',
//     'RescuePC Repairs',
//     'https://rescuepcrepairs.com/images/logo.png',
//     [
//         'facebook' => 'https://facebook.com/rescuepcrepairs',
//         'twitter' => 'https://twitter.com/rescuepcrepairs'
//     ],
//     $logger
// );
// 
// $metaTags = $seo->generateMetaTags(
//     'Professional Windows Repair Toolkit',
//     'Expert computer repair services and Windows optimization tools',
//     'https://rescuepcrepairs.com/images/toolkit.jpg'
// );
// 
// $breadcrumbs = $seo->generateBreadcrumbs('/services/windows-repair');
// 
// $structuredData = $seo->generateStructuredData('Service', [
//     'name' => 'Windows Repair',
//     'description' => 'Professional Windows repair services',
//     'provider' => [
//         '@type' => 'Organization',
//         'name' => 'RescuePC Repairs'
//     ]
// ]);
?> 