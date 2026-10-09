import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transfer from '@/lib/models/Transfer';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const query = {};

    // Non-admins only see transfers where they are giver or receiver
    if (user.role !== 'admin') {
      query.$or = [{ giver: user._id }, { receiver: user._id }];
    }

    const transfers = await Transfer.find(query)
      .populate('resource', 'title category subCategory condition location')
      .populate('giver', 'name email role departmentName')
      .populate('receiver', 'name email role departmentName')
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ transfers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}
