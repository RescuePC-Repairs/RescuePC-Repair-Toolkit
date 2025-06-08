<?php
class CDN {
    private $cdnUrl;
    private $localPath;
    private $logger;
    
    public function __construct($cdnUrl = '', $localPath = '', $logger = null) {
        $this->cdnUrl = rtrim($cdnUrl, '/');
        $this->localPath = rtrim($localPath, '/');
        $this->logger = $logger;
    }
    
    public function getAssetUrl($path) {
        if (empty($this->cdnUrl)) {
            return $path;
        }
        
        // Remove leading slash if present
        $path = ltrim($path, '/');
        
        // Check if file exists locally
        $localFile = $this->localPath . '/' . $path;
        if (!file_exists($localFile)) {
            if ($this->logger) {
                $this->logger->warning('Asset not found locally', ['path' => $path]);
            }
            return $path;
        }
        
        // Generate CDN URL
        $cdnPath = $this->cdnUrl . '/' . $path;
        
        // Add version query parameter based on file modification time
        $version = filemtime($localFile);
        $cdnPath .= '?v=' . $version;
        
        return $cdnPath;
    }
    
    public function getImageUrl($path, $width = null, $height = null) {
        $url = $this->getAssetUrl($path);
        
        if ($width || $height) {
            $url .= (strpos($url, '?') !== false ? '&' : '?') . 'w=' . $width;
            if ($height) {
                $url .= '&h=' . $height;
            }
        }
        
        return $url;
    }
    
    public function getCssUrl($path) {
        return $this->getAssetUrl($path);
    }
    
    public function getJsUrl($path) {
        return $this->getAssetUrl($path);
    }
    
    public function getFontUrl($path) {
        return $this->getAssetUrl($path);
    }
    
    public function getVideoUrl($path) {
        return $this->getAssetUrl($path);
    }
    
    public function getAudioUrl($path) {
        return $this->getAssetUrl($path);
    }
    
    public function getDocumentUrl($path) {
        return $this->getAssetUrl($path);
    }
}

// Usage example:
// $cdn = new CDN('https://cdn.rescuepcrepairs.com', '/path/to/assets', $logger);
// $imageUrl = $cdn->getImageUrl('images/logo.png', 200, 200);
// $cssUrl = $cdn->getCssUrl('css/style.css');
// $jsUrl = $cdn->getJsUrl('js/main.js');
?> 