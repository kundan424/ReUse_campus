import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
import ResourceRequest from '@/lib/models/ResourceRequest';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { resourceId, requestedQuantity, purpose } = body;

    if (!resourceId || !requestedQuantity || !purpose) {
      return NextResponse.json(
        { error: 'Resource, quantity, and intended reuse purpose are required' },
        { status: 400 }
      );
    }

    const qty = parseInt(requestedQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: 'Requested quantity must be a positive number' },
        { status: 400 }
      );
    }

    const resource = await Resource.findById(resourceId);
    if (!resource || resource.status === 'archived') {
      return NextResponse.json({ error: 'Resource not found or unavailable' }, { status: 404 });
    }

    // Rule: cannot request your own listed item
    if (resource.owner.toString() === user._id.toString()) {
      return NextResponse.json(
        { error: 'You cannot request an item that you listed yourself.' },
        { status: 400 }
      );
    }

    // Check if available quantity is sufficient
    if (resource.availableQuantity < qty) {
      return NextResponse.json(
        {
          error: `Insufficient available quantity. Currently available: ${resource.availableQuantity}`,
        },
        { status: 400 }
      );
    }

    // Check if user already has an active pending request for this resource
    const existingActive = await ResourceRequest.findOne({
      resource: resourceId,
      requester: user._id,
      status: { $in: ['pending', 'approved', 'ready_for_pickup'] },
    });

    if (existingActive) {
      return NextResponse.json(
        {
          error:
            'You already have an active request for this resource. Please wait for the owner to review.',
        },
        { status: 400 }
      );
    }

    const newRequest = await ResourceRequest.create({
      resource: resourceId,
      requester: user._id,
      requestedQuantity: qty,
      purpose: purpose.trim(),
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Request submitted successfully to the resource owner',
      request: newRequest,
    });
  } catch (error) {
    console.error('Request submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit request' },
      { status: 500 }
    );
  }
}
