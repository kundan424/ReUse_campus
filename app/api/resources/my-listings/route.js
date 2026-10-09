import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const listings = await Resource.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ listings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch your listings' }, { status: 500 });
  }
}
