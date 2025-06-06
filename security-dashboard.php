<?php
// Define secure access constant
define('SECURE_ACCESS', true);

// Include security initialization
require_once __DIR__ . '/config/security-init.php';

// Security Dashboard
// Disable error reporting
error_reporting(0);
ini_set('display_errors', 0);

// Load configuration
$config = require_once __DIR__ . '/config/security-config.php';

// Set secure session parameters
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_lifetime', 0);
ini_set('session.gc_maxlifetime', $config['session']['timeout']);
session_name($config['session']['name']);
session_start();

// IP-based access control
function isAllowedIP() {
    global $config;
    $client_ip = $_SERVER['REMOTE_ADDR'];
    return in_array($client_ip, $config['allowed_ips']);
}

// Authentication check
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true || !isAllowedIP()) {
    // If not allowed IP, return 404 to hide the page's existence
    if (!isAllowedIP()) {
        header("HTTP/1.0 404 Not Found");
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        if ($username === $config['admin']['username'] && $password === $config['admin']['password']) {
            $_SESSION['authenticated'] = true;
            $_SESSION['last_activity'] = time();
            $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
            $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
        } else {
            $error = 'Invalid credentials';
            error_log("Failed login attempt");
        }
    }
    
    // Show login form if not authenticated
    if (!isset($_SESSION['authenticated'])) {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 Not Found</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .login-container { 
                    max-width: 400px; 
                    background: white; 
                    padding: 20px; 
                    border-radius: 8px; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                }
                .form-group { margin-bottom: 15px; }
                label { display: block; margin-bottom: 5px; }
                input { 
                    width: 100%; 
                    padding: 8px; 
                    border: 1px solid #ddd; 
                    border-radius: 4px; 
                }
                button { 
                    background: #007bff; 
                    color: white; 
                    border: none; 
                    padding: 10px 15px; 
                    border-radius: 4px; 
                    cursor: pointer; 
                }
                .error { color: red; margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h2>404 Not Found</h2>
                <?php if (isset($error)): ?>
                    <div class="error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                <form method="POST" autocomplete="off">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

// Verify session hasn't been hijacked
if (!isset($_SESSION['ip']) || $_SESSION['ip'] !== $_SERVER['REMOTE_ADDR'] ||
    !isset($_SESSION['user_agent']) || $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
    session_unset();
    session_destroy();
    header("Location: security-dashboard.php");
    exit;
}

// Session timeout
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $config['session']['timeout'])) {
    session_unset();
    session_destroy();
    header("Location: security-dashboard.php");
    exit;
}
$_SESSION['last_activity'] = time();

// Read and parse security reports
$logFile = 'security-reports.log';
$reports = [];

if (file_exists($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $report = json_decode($line, true);
        if ($report) {
            $reports[] = $report;
        }
    }
}

// Sort reports by timestamp (newest first)
usort($reports, function($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

// Get statistics
$totalReports = count($reports);
$uniqueIPs = count(array_unique(array_column($reports, 'ip')));
$last24Hours = array_filter($reports, function($report) {
    return strtotime($report['timestamp']) > strtotime('-24 hours');
});
$reports24Hours = count($last24Hours);

// Get violation types
$violationTypes = [];
foreach ($reports as $report) {
    $type = $report['type'] ?? 'unknown';
    if (!isset($violationTypes[$type])) {
        $violationTypes[$type] = 0;
    }
    $violationTypes[$type]++;
}

// Get recent IPs
$recentIPs = array_slice(array_unique(array_column($reports, 'ip')), 0, 10);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Dashboard</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .dashboard { 
            max-width: 1200px; 
            margin: 0 auto; 
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .stat-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
        .stat-card h3 { 
            margin: 0 0 10px 0; 
            color: #333; 
        }
        .stat-card p { 
            margin: 0; 
            font-size: 24px; 
            color: #007bff; 
        }
        .section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .section h2 {
            margin-top: 0;
            color: #333;
        }
        .violation-type {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .violation-type:last-child {
            border-bottom: none;
        }
        .reports { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
        .report { 
            border-bottom: 1px solid #eee; 
            padding: 15px 0; 
        }
        .report:last-child { 
            border-bottom: none; 
        }
        .report-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 10px; 
        }
        .report-timestamp { 
            color: #666; 
        }
        .report-ip { 
            color: #007bff; 
        }
        .report-details { 
            background: #f8f9fa; 
            padding: 10px; 
            border-radius: 4px; 
        }
        .logout { 
            float: right; 
        }
        .severity-high {
            color: #dc3545;
        }
        .severity-medium {
            color: #ffc107;
        }
        .severity-low {
            color: #28a745;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>Security Dashboard</h1>
            <div class="logout">
                <a href="?logout=1">Logout</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>Total Security Events</h3>
                <p><?php echo $totalReports; ?></p>
            </div>
            <div class="stat-card">
                <h3>Unique IPs</h3>
                <p><?php echo $uniqueIPs; ?></p>
            </div>
            <div class="stat-card">
                <h3>Last 24 Hours</h3>
                <p><?php echo $reports24Hours; ?></p>
            </div>
        </div>
        
        <div class="section">
            <h2>Violation Types</h2>
            <?php foreach ($violationTypes as $type => $count): ?>
                <div class="violation-type">
                    <span><?php echo htmlspecialchars($type); ?></span>
                    <span><?php echo $count; ?> events</span>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="section">
            <h2>Recent Suspicious IPs</h2>
            <?php foreach ($recentIPs as $ip): ?>
                <div class="violation-type">
                    <span><?php echo htmlspecialchars($ip); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="reports">
            <h2>Recent Security Events</h2>
            <?php foreach ($reports as $report): ?>
                <div class="report">
                    <div class="report-header">
                        <span class="report-timestamp"><?php echo htmlspecialchars($report['timestamp']); ?></span>
                        <span class="report-ip"><?php echo htmlspecialchars($report['ip']); ?></span>
                    </div>
                    <div class="report-details">
                        <strong>Type:</strong> <?php echo htmlspecialchars($report['type']); ?><br>
                        <strong>User Agent:</strong> <?php echo htmlspecialchars($report['user_agent']); ?><br>
                        <strong>Details:</strong>
                        <pre><?php echo htmlspecialchars(json_encode($report['data'], JSON_PRETTY_PRINT)); ?></pre>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html> 