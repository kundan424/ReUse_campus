import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dbStatus = 'disconnected';

  try {
    await connectDB();
    const readyState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (readyState === 1) {
      dbStatus = 'connected';
    } else if (readyState === 2) {
      dbStatus = 'connecting';
    } else {
      dbStatus = 'disconnected';
    }
  } catch (err) {
    console.error('Health check DB connection error:', err.message);
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'connected';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      service: 'reuse-campus-api',
    },
    { status: isHealthy ? 200 : 503 }
  );
}
