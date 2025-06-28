/**
 * RESCUEPC REPAIRS - LICENSE DASHBOARD FUNCTIONS
 * Dashboard functionality for monitoring automated license distribution system
 */

// Dashboard initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
    console.log('📊 Initializing license dashboard...');
    
    // Load initial data
    refreshDashboard();
    
    // Set up auto-refresh every 30 seconds
    setInterval(refreshDashboard, 30000);
    
    console.log('✅ Dashboard initialized successfully');
}

/**
 * Refresh dashboard data
 */
function refreshDashboard() {
    console.log('🔄 Refreshing dashboard data...');
    
    // Show loading state
    const dashboardStats = document.querySelector('.dashboard-stats');
    if (dashboardStats) {
        dashboardStats.classList.add('loading');
    }
    
    // Get license statistics
    const stats = getLicenseStats();
    
    // Update dashboard elements
    updateDashboardStats(stats);
    updateLicenseBreakdown(stats);
    updateRecentActivity();
    
    // Remove loading state
    if (dashboardStats) {
        dashboardStats.classList.remove('loading');
    }
    
    console.log('✅ Dashboard refreshed');
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats(stats) {
    // Update total licenses
    const totalLicensesElement = document.getElementById('total-licenses');
    if (totalLicensesElement) {
        totalLicensesElement.textContent = stats.total;
    }
    
    // Update total revenue
    const totalRevenueElement = document.getElementById('total-revenue');
    if (totalRevenueElement) {
        totalRevenueElement.textContent = `$${stats.revenue.toFixed(2)}`;
    }
    
    // Update active licenses
    const activeLicensesElement = document.getElementById('active-licenses');
    if (activeLicensesElement) {
        activeLicensesElement.textContent = stats.active;
    }
    
    // Update expired licenses
    const expiredLicensesElement = document.getElementById('expired-licenses');
    if (expiredLicensesElement) {
        expiredLicensesElement.textContent = stats.expired;
    }
}

/**
 * Update license type breakdown
 */
function updateLicenseBreakdown(stats) {
    const breakdownElement = document.getElementById('license-breakdown');
    if (!breakdownElement) return;
    
    const licenseTypes = {
        'basic': { name: 'Basic', price: 49.99 },
        'professional': { name: 'Professional', price: 199.99 },
        'enterprise': { name: 'Enterprise', price: 499.99 },
        'government': { name: 'Government', price: 999.99 },
        'lifetime': { name: 'Lifetime', price: 499.99 }
    };
    
    let breakdownHTML = '';
    
    for (const [type, config] of Object.entries(licenseTypes)) {
        const count = stats.byType[type] || 0;
        const revenue = count * config.price;
        
        breakdownHTML += `
            <div class="breakdown-item">
                <div class="type-name">${config.name}</div>
                <div class="type-count">${count}</div>
                <div class="type-revenue">$${revenue.toFixed(2)}</div>
            </div>
        `;
    }
    
    breakdownElement.innerHTML = breakdownHTML;
}

/**
 * Update recent activity list
 */
function updateRecentActivity() {
    const activityElement = document.getElementById('recent-activity');
    if (!activityElement) return;
    
    const licenses = JSON.parse(localStorage.getItem('rescuepc_licenses') || '[]');
    
    // Sort by creation date (newest first)
    const sortedLicenses = licenses.sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
    });
    
    // Take the 10 most recent
    const recentLicenses = sortedLicenses.slice(0, 10);
    
    let activityHTML = '';
    
    recentLicenses.forEach(license => {
        const createdDate = new Date(license.created);
        const timeAgo = getTimeAgo(createdDate);
        
        activityHTML += `
            <div class="activity-item">
                <div class="activity-icon license-created">
                    <i class="fas fa-key"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${license.tier.toUpperCase()} License Created</div>
                    <div class="activity-details">
                        ${license.customerInfo.name} (${license.customerInfo.email}) - 
                        License: ${license.licenseKey.substring(0, 12)}...
                    </div>
                </div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        `;
    });
    
    if (recentLicenses.length === 0) {
        activityHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <p>System ready for automated license distribution</p>
                    <span class="activity-time">System initialized</span>
                </div>
            </div>
        `;
    }
    
    activityElement.innerHTML = activityHTML;
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

/**
 * Export license data
 */
function exportLicenseData() {
    console.log('📤 Exporting license data...');
    
    const licenses = JSON.parse(localStorage.getItem('rescuepc_licenses') || '[]');
    
    if (licenses.length === 0) {
        alert('No license data to export.');
        return;
    }
    
    // Create CSV content
    let csvContent = 'License Key,Tier,Customer Name,Customer Email,Amount,Issued Date,Expiration Date,Max Devices,Used Devices,Status\n';
    
    licenses.forEach(license => {
        const issuedDate = new Date(license.licenseInfo.issuedDate).toLocaleDateString();
        const expirationDate = new Date(license.licenseInfo.expirationDate).toLocaleDateString();
        const status = license.licenseInfo.isActive ? 'Active' : 'Inactive';
        
        csvContent += `"${license.licenseKey}","${license.tier}","${license.customerInfo.name}","${license.customerInfo.email}","${license.paymentInfo.amount}","${issuedDate}","${expirationDate}","${license.licenseInfo.maxDevices}","${license.licenseInfo.usedDevices}","${status}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rescuepc_licenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ License data exported successfully');
}

/**
 * Show system status
 */
function showSystemStatus() {
    console.log('ℹ️ Showing system status...');
    
    const status = {
        automatedSystem: window.automatedLicenseSystem ? '✅ Active' : '❌ Inactive',
        licenseManager: window.rescuePCLicenseManager ? '✅ Active' : '❌ Inactive',
        webhookEndpoint: '🔗 Configured',
        database: '💾 Local Storage',
        emailService: '📧 Ready',
        lastUpdate: new Date().toLocaleString()
    };
    
    const statusHTML = `
        <div class="system-status-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔧 System Status</h3>
                    <button onclick="this.closest('.system-status-modal').remove()" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="status-label">Automated License System:</span>
                            <span class="status-value">${status.automatedSystem}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">License Manager:</span>
                            <span class="status-value">${status.licenseManager}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Webhook Endpoint:</span>
                            <span class="status-value">${status.webhookEndpoint}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Database:</span>
                            <span class="status-value">${status.database}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Email Service:</span>
                            <span class="status-value">${status.emailService}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Last Update:</span>
                            <span class="status-value">${status.lastUpdate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', statusHTML);
    
    // Add CSS for the status modal
    const style = document.createElement('style');
    style.textContent = `
        .system-status-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 2rem;
        }
        
        .status-grid {
            display: grid;
            gap: 1rem;
        }
        
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .status-label {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .status-value {
            font-weight: 500;
            color: #6c757d;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Test the automated system
 */
async function testAutomatedSystem() {
    console.log('🧪 Testing automated license system...');
    
    if (!window.automatedLicenseSystem) {
        alert('Automated license system not found. Please ensure the system is properly loaded.');
        return;
    }
    
    try {
        // Show loading state
        const testButton = document.querySelector('button[onclick="testAutomatedSystem()"]');
        const originalText = testButton.innerHTML;
        testButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        testButton.disabled = true;
        
        // Run the test
        const stats = await window.automatedLicenseSystem.testSystem();
        
        // Show results
        alert(`✅ Test completed successfully!\n\nResults:\n- Total Licenses: ${stats.total}\n- Total Revenue: $${stats.revenue.toFixed(2)}\n- Active Licenses: ${stats.active}\n- Expired Licenses: ${stats.expired}`);
        
        // Refresh dashboard
        refreshDashboard();
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        alert(`❌ Test failed: ${error.message}`);
    } finally {
        // Restore button
        const testButton = document.querySelector('button[onclick="testAutomatedSystem()"]');
        testButton.innerHTML = originalText;
        testButton.disabled = false;
    }
}

// Global functions for use in HTML
window.refreshDashboard = refreshDashboard;
window.exportLicenseData = exportLicenseData;
window.showSystemStatus = showSystemStatus;
window.testAutomatedSystem = testAutomatedSystem; 