import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Requisition from '@/lib/models/Requisition';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const urgency = searchParams.get('urgency');
    const status = searchParams.get('status') || 'open';
    const search = searchParams.get('search');

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (urgency && urgency !== 'all') {
      filter.urgency = urgency;
    }
    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { departmentName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const requisitions = await Requisition.find(filter)
      .populate('requester', 'name email role departmentName phone')
      .populate('matchedResource', 'title condition location')
      .sort({ urgency: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ requisitions });
  } catch (error) {
    console.error('Fetch requisitions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campus requisitions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to post a requisition' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { title, description, category, quantityNeeded, urgency, locationNeeded } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Item title and category are required' },
        { status: 400 }
      );
    }

    const qty = parseInt(quantityNeeded, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: 'Quantity needed must be a positive integer' },
        { status: 400 }
      );
    }

    const newRequisition = await Requisition.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category,
      quantityNeeded: qty,
      urgency: urgency || 'standard',
      locationNeeded: locationNeeded ? locationNeeded.trim() : (user.departmentName || ''),
      requester: user._id,
      requesterRole: user.role,
      departmentName: user.departmentName || '',
      status: 'open',
    });

    return NextResponse.json({
      message: 'Campus requisition logged successfully. Other departments and students can now fulfill this need.',
      requisition: newRequisition,
    });
  } catch (error) {
    console.error('Create requisition error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit requisition' },
      { status: 500 }
    );
  }
}
