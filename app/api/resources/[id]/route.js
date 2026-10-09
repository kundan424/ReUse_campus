import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resource = await Resource.findById(params.id).populate(
      'owner',
      'name email role departmentName phone'
    );

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ resource });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const resource = await Resource.findById(params.id);
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Authorization check: only owner or admin can edit
    const isOwner = resource.owner.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to modify this resource' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, subCategory, condition, location, pickupInstructions, imageUrl } = body;

    if (title) resource.title = title.trim();
    if (description) resource.description = description.trim();
    if (category) resource.category = category;
    if (subCategory !== undefined) resource.subCategory = subCategory.trim();
    if (condition) resource.condition = condition;
    if (location) resource.location = location.trim();
    if (pickupInstructions) resource.pickupInstructions = pickupInstructions.trim();
    if (imageUrl !== undefined) resource.imageUrl = imageUrl.trim();

    await resource.save();

    return NextResponse.json({
      message: 'Resource updated successfully',
      resource,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const resource = await Resource.findById(params.id);
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const isOwner = resource.owner.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this resource' },
        { status: 403 }
      );
    }

    // Soft archive or remove
    resource.status = 'archived';
    resource.availableQuantity = 0;
    await resource.save();

    return NextResponse.json({ message: 'Resource removed from active listings' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
