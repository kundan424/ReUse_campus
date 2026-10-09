import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transfer from '@/lib/models/Transfer';
import ResourceRequest from '@/lib/models/ResourceRequest';
import Resource from '@/lib/models/Resource';
import { getAuthUser } from '@/lib/auth';
import { calculateImpact } from '@/lib/impactCalculator';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const transfer = await Transfer.findOne({ request: requestId }).populate('resource');
    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer record not found for this request' },
        { status: 404 }
      );
    }

    // Only the giver (or admin) can confirm giver handover
    const isGiver = transfer.giver.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isGiver && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the item donor/giver can confirm physical handover' },
        { status: 403 }
      );
    }

    transfer.giverConfirmedAt = new Date();

    // Check if receiver has also confirmed
    let isFullyCompleted = false;
    if (transfer.receiverConfirmedAt) {
      transfer.status = 'completed';
      transfer.completedAt = new Date();

      // Calculate environmental & financial impact
      const impactData = calculateImpact(
        transfer.resource.category,
        transfer.quantityTransferred
      );
      transfer.impact = impactData;
      isFullyCompleted = true;

      // Update ResourceRequest status to completed
      await ResourceRequest.findByIdAndUpdate(requestId, {
        status: 'completed',
      });

      // Update Resource status if all units transferred
      const resource = await Resource.findById(transfer.resource._id);
      if (resource && resource.availableQuantity === 0) {
        resource.status = 'transferred';
        await resource.save();
      }
    }

    await transfer.save();

    return NextResponse.json({
      message: isFullyCompleted
        ? 'Transfer completed and verified by both parties! Environmental impact recorded.'
        : 'Handover confirmed. Waiting for the receiver to confirm receipt.',
      transfer,
      completed: isFullyCompleted,
    });
  } catch (error) {
    console.error('Giver confirmation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record handover confirmation' },
      { status: 500 }
    );
  }
}
