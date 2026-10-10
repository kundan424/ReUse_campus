import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
import { calculateImpact } from '@/lib/impactCalculator';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { query = '', category = 'all', quantity = 1 } = body;

    const trimmedQuery = (query || '').trim();
    const reqQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!trimmedQuery) {
      return NextResponse.json(
        { error: 'Please enter an item name or keyword to check campus inventory' },
        { status: 400 }
      );
    }

    // Build smart search query
    // Split into search terms for flexible matching (e.g., "dell monitor" matches "Monitor - Dell 24-inch")
    const terms = trimmedQuery.split(/\s+/).filter(Boolean);
    const regexTerms = terms.map((t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    const escapedFullQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const mongoFilter = {
      status: { $in: ['available', 'reserved'] },
      availableQuantity: { $gt: 0 },
      $or: [
        { title: { $in: regexTerms } },
        { description: { $in: regexTerms } },
        { subCategory: { $in: regexTerms } },
        { title: { $regex: escapedFullQuery, $options: 'i' } },
        { description: { $regex: escapedFullQuery, $options: 'i' } },
        { subCategory: { $regex: escapedFullQuery, $options: 'i' } },
      ],
    };

    if (category && category !== 'all') {
      mongoFilter.category = category;
    }

    const matches = await Resource.find(mongoFilter)
      .populate('owner', 'name email role departmentName phone')
      .sort({ availableQuantity: -1, createdAt: -1 })
      .lean();

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        found: false,
        query: trimmedQuery,
        requestedQuantity: reqQty,
        totalAvailableUnits: 0,
        projectedSavingsINR: 0,
        projectedCarbonSavedKg: 0,
        projectedWasteDivertedKg: 0,
        resources: [],
        message: `No active surplus found on campus for "${trimmedQuery}". You can log an institutional requisition so dormant stock can be claimed when registered.`,
      });
    }

    // Calculate aggregated available quantity
    const totalAvailableUnits = matches.reduce((sum, item) => sum + (item.availableQuantity || 0), 0);
    const matchedCategory = matches[0].category || (category !== 'all' ? category : 'other');
    const claimableUnits = Math.min(reqQty, totalAvailableUnits);

    // Calculate projected avoided procurement savings & carbon reduction
    const impact = calculateImpact(matchedCategory, claimableUnits);

    return NextResponse.json({
      found: true,
      query: trimmedQuery,
      requestedQuantity: reqQty,
      totalMatches: matches.length,
      totalAvailableUnits,
      claimableUnits,
      projectedSavingsINR: impact.estimatedSavingsINR,
      projectedCarbonSavedKg: impact.estimatedCarbonSavedKg,
      projectedWasteDivertedKg: impact.wasteDivertedKg,
      resources: matches,
      message: `Surplus detected! Found ${matches.length} active listing(s) with ${totalAvailableUnits} unit(s) available on campus.`,
    });
  } catch (error) {
    console.error('Surplus check error:', error);
    return NextResponse.json(
      { error: 'Failed to query campus surplus inventory' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 'all';
    const quantity = searchParams.get('quantity') || 1;

    // Reuse POST logic with URL params
    const fakeRequest = {
      json: async () => ({ query, category, quantity }),
    };
    return POST(fakeRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check surplus' }, { status: 500 });
  }
}
