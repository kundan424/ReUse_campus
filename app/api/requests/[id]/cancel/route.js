import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
import ResourceRequest from '@/lib/models/ResourceRequest';
import Transfer from '@/lib/models/Transfer';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const resourceRequest = await ResourceRequest.findById(params.id).populate('resource');
    if (!resourceRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Only the requester or admin can cancel the request
    const isRequester = resourceRequest.requester.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isRequester && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the requester can cancel this request' },
        { status: 403 }
      );
    }

    if (resourceRequest.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot cancel an already completed and confirmed transfer.' },
        { status: 400 }
      );
    }

    // If was approved, return reserved items to available inventory
    if (['approved', 'ready_for_pickup'].includes(resourceRequest.status)) {
      await Resource.findByIdAndUpdate(resourceRequest.resource._id, {
        $inc: { availableQuantity: resourceRequest.requestedQuantity },
        $set: { status: 'available' },
      });

      await Transfer.findOneAndDelete({ request: resourceRequest._id });
    }

    resourceRequest.status = 'cancelled';
    await resourceRequest.save();

    return NextResponse.json({
      message: 'Request has been cancelled',
      request: resourceRequest,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to cancel request' },
      { status: 500 }
    );
  }
}
