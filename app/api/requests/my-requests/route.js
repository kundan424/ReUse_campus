import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ResourceRequest from '@/lib/models/ResourceRequest';
import Transfer from '@/lib/models/Transfer';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const requests = await ResourceRequest.find({ requester: user._id })
      .populate({
        path: 'resource',
        select: 'title category subCategory condition location pickupInstructions imageUrl owner status',
        populate: {
          path: 'owner',
          select: 'name email role departmentName phone',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Attach transfer details if any
    const requestIds = requests.map((r) => r._id);
    const transfers = await Transfer.find({ request: { $in: requestIds } }).lean();
    const transferMap = {};
    transfers.forEach((t) => {
      transferMap[t.request.toString()] = t;
    });

    const enriched = requests.map((req) => ({
      ...req,
      transfer: transferMap[req._id.toString()] || null,
    }));

    return NextResponse.json({ requests: enriched });
  } catch (error) {
    console.error('Fetch my-requests error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve your requests' },
      { status: 500 }
    );
  }
}
