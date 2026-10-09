import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
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

    // Find all resources owned by this user
    const userResources = await Resource.find({ owner: user._id }).select('_id');
    const resourceIds = userResources.map((r) => r._id);

    // Find requests for these resources
    const requests = await ResourceRequest.find({ resource: { $in: resourceIds } })
      .populate('requester', 'name email role departmentName collegeId phone')
      .populate('resource', 'title category subCategory condition location availableQuantity quantity imageUrl')
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
    console.error('Fetch incoming requests error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve incoming requests' },
      { status: 500 }
    );
  }
}
