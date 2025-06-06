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
    
    if (!isset($_SESSION['authenticated'])) {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 Not Found</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
                body { 
                    font-family: 'Inter', sans-serif;
                    margin: 0; 
                    padding: 20px; 
                    background: #f8fafc; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .login-container { 
                    max-width: 400px; 
                    background: white; 
                    padding: 2rem; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .form-group { margin-bottom: 1.5rem; }
                label { 
                    display: block; 
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #374151;
                }
                input { 
                    width: 100%; 
                    padding: 0.75rem; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 6px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                button { 
                    background: #3b82f6; 
                    color: white; 
                    border: none; 
                    padding: 0.75rem 1.5rem; 
                    border-radius: 6px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    width: 100%;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background: #2563eb;
                }
                .error { 
                    color: #dc2626; 
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background: #fee2e2;
                    border-radius: 6px;
                }
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
$logFile = 'logs/security-reports.log';
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
    <title>Security Dashboard - RescuePC Repairs</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary: #3b82f6;
            --primary-dark: #2563eb;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
        }
        
        body { 
            font-family: 'Inter', sans-serif;
            margin: 0; 
            padding: 0;
            background: var(--gray-50);
            color: var(--gray-800);
        }
        
        .dashboard { 
            max-width: 1400px; 
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--gray-200);
        }
        
        .header h1 {
            margin: 0;
            color: var(--gray-900);
            font-size: 1.875rem;
            font-weight: 600;
        }
        
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 1.5rem; 
            margin-bottom: 2rem; 
        }
        
        .stat-card { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .stat-card h3 { 
            margin: 0 0 0.5rem 0; 
            color: var(--gray-600);
            font-size: 0.875rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .stat-card p { 
            margin: 0; 
            font-size: 1.875rem; 
            font-weight: 600;
            color: var(--gray-900);
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .section {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .section h2 {
            margin: 0 0 1rem 0;
            color: var(--gray-900);
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .violation-type {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem;
            border-bottom: 1px solid var(--gray-100);
            font-size: 0.875rem;
        }
        
        .violation-type:last-child {
            border-bottom: none;
        }
        
        .reports { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .report { 
            border-bottom: 1px solid var(--gray-100); 
            padding: 1rem 0; 
        }
        
        .report:last-child { 
            border-bottom: none; 
        }
        
        .report-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 0.5rem; 
            font-size: 0.875rem;
        }
        
        .report-timestamp { 
            color: var(--gray-500);
        }
        
        .report-ip { 
            color: var(--primary);
            font-weight: 500;
        }
        
        .report-details { 
            background: var(--gray-50); 
            padding: 1rem; 
            border-radius: 8px;
            font-size: 0.875rem;
        }
        
        .report-details pre {
            margin: 0.5rem 0 0 0;
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
            overflow-x: auto;
        }
        
        .logout { 
            color: var(--gray-600);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        
        .logout:hover {
            background: var(--gray-100);
        }
        
        .severity-high {
            color: var(--danger);
        }
        
        .severity-medium {
            color: var(--warning);
        }
        
        .severity-low {
            color: var(--success);
        }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                padding: 1rem;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>Security Dashboard</h1>
            <a href="?logout=1" class="logout">Logout</a>
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
        
        <div class="grid">
            <div class="section">
                <h2>Violation Types</h2>
                <div class="chart-container">
                    <canvas id="violationChart"></canvas>
                </div>
            </div>
            
            <div class="section">
                <h2>Recent Suspicious IPs</h2>
                <?php foreach ($recentIPs as $ip): ?>
                    <div class="violation-type">
                        <span><?php echo htmlspecialchars($ip); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
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

    <script>
        // Violation Types Chart
        const ctx = document.getElementById('violationChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: <?php echo json_encode(array_keys($violationTypes)); ?>,
                datasets: [{
                    data: <?php echo json_encode(array_values($violationTypes)); ?>,
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6',
                        '#ec4899'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // Auto-refresh dashboard every 30 seconds
        setTimeout(() => {
            window.location.reload();
        }, 30000);
    </script>
</body>
</html> 