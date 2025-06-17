<?php
class Analytics {
    private $gaId;
    private $logger;
    private $customDimensions;
    
    public function __construct($gaId, $logger = null) {
        $this->gaId = $gaId;
        $this->logger = $logger;
        $this->customDimensions = [];
    }
    
    public function trackPageView($page, $title, $data = []) {
        $this->sendToGA('pageview', array_merge([
            'page' => $page,
            'title' => $title
        ], $data));
        
        if ($this->logger) {
            $this->logger->info('Page View Tracked', [
                'page' => $page,
                'title' => $title,
                'data' => $data
            ]);
        }
    }
    
    public function trackEvent($category, $action, $label = '', $value = 0) {
        $this->sendToGA('event', [
            'event_category' => $category,
            'event_action' => $action,
            'event_label' => $label,
            'event_value' => $value
        ]);
        
        if ($this->logger) {
            $this->logger->info('Event Tracked', [
                'category' => $category,
                'action' => $action,
                'label' => $label,
                'value' => $value
            ]);
        }
    }
    
    public function trackUserTiming($category, $variable, $time, $label = '') {
        $this->sendToGA('timing', [
            'timing_category' => $category,
            'timing_var' => $variable,
            'timing_time' => $time,
            'timing_label' => $label
        ]);
    }
    
    public function trackException($description, $fatal = false) {
        $this->sendToGA('exception', [
            'exd' => $description,
            'exf' => $fatal ? 1 : 0
        ]);
        
        if ($this->logger) {
            $this->logger->error('Exception Tracked', [
                'description' => $description,
                'fatal' => $fatal
            ]);
        }
    }
    
    public function setCustomDimension($index, $value) {
        $this->customDimensions[$index] = $value;
    }
    
    public function trackUserEngagement($data) {
        $this->sendToGA('user_engagement', $data);
    }
    
    public function trackEcommerce($data) {
        $this->sendToGA('ecommerce', $data);
    }
    
    private function sendToGA($hitType, $data) {
        $gaData = [
            'v' => 1,
            'tid' => $this->gaId,
            't' => $hitType
        ];
        
        // Add custom dimensions
        foreach ($this->customDimensions as $index => $value) {
            $gaData['cd' . $index] = $value;
        }
        
        // Merge with provided data
        $gaData = array_merge($gaData, $data);
        
        // Send to Google Analytics
        $this->sendRequest('https://www.google-analytics.com/collect', $gaData);
    }
    
    private function sendRequest($url, $data) {
        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data)
            ]
        ];
        
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        
        if ($result === false && $this->logger) {
            $this->logger->error('Failed to send analytics data', [
                'url' => $url,
                'data' => $data
            ]);
        }
    }
    
    public function getAnalyticsScript() {
        return "
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src='https://www.googletagmanager.com/gtag/js?id={$this->gaId}'></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '{$this->gaId}');
        </script>";
    }
}

// Usage example:
// $analytics = new Analytics('G-XXXXXXXXXX', $logger);
// 
// // Track page view
// $analytics->trackPageView('/services', 'Our Services', [
//     'user_type' => 'premium'
// ]);
// 
// // Track event
// $analytics->trackEvent('Button', 'Click', 'Download', 1);
// 
// // Track user timing
// $analytics->trackUserTiming('JS Dependencies', 'load', 3549);
// 
// // Track exception
// $analytics->trackException('Failed to load resource', true);
// 
// // Set custom dimension
// $analytics->setCustomDimension(1, 'premium_user');
// 
// // Track ecommerce
// $analytics->trackEcommerce([
//     'transaction_id' => '1234',
//     'affiliation' => 'RescuePC Store',
//     'value' => 79.99,
//     'currency' => 'USD'
// ]);
?> 