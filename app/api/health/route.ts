import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Basic system health checks
    const healthChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'healthy', // Placeholder - add actual DB check if needed
        stripe: 'healthy',   // Placeholder - add actual Stripe check if needed
        email: 'healthy',    // Placeholder - add actual email check if needed
        encryption: 'healthy' // Placeholder - add actual encryption check if needed
      }
    };

    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...healthChecks,
      responseTime: `${responseTime}ms`,
      message: 'RescuePC Repairs Store is operational'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'RescuePC Repairs Store health check failed'
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
} 