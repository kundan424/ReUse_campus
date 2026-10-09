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
    const { action, decisionNote, pickupScheduledAt, pickupNotes } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    const resourceRequest = await ResourceRequest.findById(params.id).populate('resource');
    if (!resourceRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const resource = resourceRequest.resource;
    if (!resource) {
      return NextResponse.json({ error: 'Associated resource not found' }, { status: 404 });
    }

    // Authorization: only resource owner or platform admin can approve/reject
    const isOwner = resource.owner.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the resource owner can approve or reject this request' },
        { status: 403 }
      );
    }

    if (action === 'approve') {
      if (resourceRequest.status === 'approved' || resourceRequest.status === 'completed') {
        return NextResponse.json(
          { error: `This request is already ${resourceRequest.status}` },
          { status: 400 }
        );
      }

      // Atomic reservation to prevent race conditions
      const updatedResource = await Resource.findOneAndUpdate(
        {
          _id: resource._id,
          availableQuantity: { $gte: resourceRequest.requestedQuantity },
        },
        {
          $inc: { availableQuantity: -resourceRequest.requestedQuantity },
        },
        { new: true }
      );

      if (!updatedResource) {
        return NextResponse.json(
          {
            error:
              'Cannot approve: Insufficient available quantity. Item may have already been reserved by another request.',
          },
          { status: 409 }
        );
      }

      // Update resource status if completely reserved
      if (updatedResource.availableQuantity === 0) {
        updatedResource.status = 'reserved';
        await updatedResource.save();
      }

      resourceRequest.status = 'approved';
      resourceRequest.decisionBy = user._id;
      resourceRequest.decisionAt = new Date();
      if (decisionNote) resourceRequest.decisionNote = decisionNote.trim();
      if (pickupScheduledAt) resourceRequest.pickupScheduledAt = new Date(pickupScheduledAt);
      if (pickupNotes) resourceRequest.pickupNotes = pickupNotes.trim();
      await resourceRequest.save();

      // Ensure transfer ledger record exists in progress
      let transfer = await Transfer.findOne({ request: resourceRequest._id });
      if (!transfer) {
        transfer = await Transfer.create({
          resource: resource._id,
          request: resourceRequest._id,
          giver: resource.owner,
          receiver: resourceRequest.requester,
          quantityTransferred: resourceRequest.requestedQuantity,
          status: 'in_progress',
        });
      }

      return NextResponse.json({
        message: 'Request approved and units atomically reserved',
        request: resourceRequest,
        transfer,
      });
    }

    if (action === 'reject') {
      // If was previously approved, restore quantity
      if (resourceRequest.status === 'approved' || resourceRequest.status === 'ready_for_pickup') {
        await Resource.findByIdAndUpdate(resource._id, {
          $inc: { availableQuantity: resourceRequest.requestedQuantity },
          $set: { status: 'available' },
        });

        // Cancel any existing transfer record
        await Transfer.findOneAndDelete({ request: resourceRequest._id });
      }

      resourceRequest.status = 'rejected';
      resourceRequest.decisionBy = user._id;
      resourceRequest.decisionAt = new Date();
      if (decisionNote) resourceRequest.decisionNote = decisionNote.trim();
      await resourceRequest.save();

      return NextResponse.json({
        message: 'Request rejected',
        request: resourceRequest,
      });
    }
  } catch (error) {
    console.error('Request status update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update request status' },
      { status: 500 }
    );
  }
}
