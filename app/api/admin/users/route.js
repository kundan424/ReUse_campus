import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Administrative access required' }, { status: 403 });
    }

    await connectDB();
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Administrative access required' }, { status: 403 });
    }

    await connectDB();
    const { userId, isActive } = await request.json();

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'admin' && targetUser._id.toString() === user._id.toString()) {
      return NextResponse.json({ error: 'Cannot deactivate your own administrator account' }, { status: 400 });
    }

    targetUser.isActive = isActive;
    await targetUser.save();

    return NextResponse.json({
      message: `User account has been ${isActive ? 'activated' : 'deactivated'}`,
      user: targetUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}
