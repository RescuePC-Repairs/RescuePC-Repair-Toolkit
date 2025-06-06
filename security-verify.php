<?php
// Define secure access constant
define('SECURE_ACCESS', true);

// Include security initialization
require_once __DIR__ . '/config/security-init.php';

// Only allow access from security dashboard
session_start();
if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
    header('HTTP/1.0 403 Forbidden');
    exit('Access denied');
}

// Run security verification
require_once __DIR__ . '/config/security-verify.php';
$config = require_once __DIR__ . '/config/security-config.php';
$verifier = new SecurityVerifier($config);
$results = $verifier->verifyAll();

// Calculate overall status
$overallStatus = true;
foreach ($results as $test) {
    if (isset($test['status']) && $test['status'] === false) {
        $overallStatus = false;
        break;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Verification - RescuePC Repairs</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 3px;
        }
        .status.pass {
            background: #dff0d8;
            color: #3c763d;
        }
        .status.fail {
            background: #f2dede;
            color: #a94442;
        }
        .details {
            margin-left: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 3px;
        }
        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #337ab7;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Security Verification Results</h1>
        
        <div class="status <?php echo $overallStatus ? 'pass' : 'fail'; ?>">
            Overall Status: <?php echo $overallStatus ? 'PASS' : 'FAIL'; ?>
        </div>
        
        <?php foreach ($results as $test => $result): ?>
            <div class="status <?php echo $result['status'] ? 'pass' : 'fail'; ?>">
                <strong><?php echo ucwords(str_replace('_', ' ', $test)); ?>:</strong>
                <?php echo $result['status'] ? 'PASS' : 'FAIL'; ?>
                
                <?php if (isset($result['details'])): ?>
                    <div class="details">
                        <?php foreach ($result['details'] as $key => $value): ?>
                            <div>
                                <strong><?php echo ucwords(str_replace('_', ' ', $key)); ?>:</strong>
                                <?php echo is_bool($value) ? ($value ? 'Yes' : 'No') : $value; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                
                <?php if (isset($result['message'])): ?>
                    <div class="details">
                        <?php echo $result['message']; ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
        
        <a href="security-dashboard.php" class="back-link">← Back to Security Dashboard</a>
    </div>
</body>
</html> 