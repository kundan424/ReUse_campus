import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';
import ResourceRequest from '@/lib/models/ResourceRequest';
import Transfer from '@/lib/models/Transfer';
import { CAMPUS_CATEGORIES } from '@/lib/categories';

export async function GET() {
  try {
    await connectDB();

    const [totalListed, availableResourcesCount, completedTransfers] = await Promise.all([
      Resource.countDocuments({ status: { $ne: 'archived' } }),
      Resource.countDocuments({ status: 'available', availableQuantity: { $gt: 0 } }),
      Transfer.find({ status: 'completed' })
        .populate('resource', 'title category')
        .populate('giver', 'name departmentName role')
        .populate('receiver', 'name departmentName role')
        .sort({ completedAt: -1 })
        .lean(),
    ]);

    let totalUnitsReused = 0;
    let totalSavingsINR = 0;
    let totalCO2Kg = 0;
    let totalWasteKg = 0;

    const categoryStats = {};
    CAMPUS_CATEGORIES.forEach((cat) => {
      categoryStats[cat.id] = {
        name: cat.name,
        unitsReused: 0,
        transfersCount: 0,
        co2Kg: 0,
      };
    });

    completedTransfers.forEach((t) => {
      const units = t.quantityTransferred || 1;
      totalUnitsReused += units;
      totalSavingsINR += t.impact?.estimatedSavingsINR || 0;
      totalCO2Kg += t.impact?.estimatedCarbonSavedKg || 0;
      totalWasteKg += t.impact?.wasteDivertedKg || 0;

      const catId = t.resource?.category || 'other';
      if (!categoryStats[catId]) {
        categoryStats[catId] = {
          name: catId,
          unitsReused: 0,
          transfersCount: 0,
          co2Kg: 0,
        };
      }
      categoryStats[catId].unitsReused += units;
      categoryStats[catId].transfersCount += 1;
      categoryStats[catId].co2Kg += t.impact?.estimatedCarbonSavedKg || 0;
    });

    const categoryList = Object.values(categoryStats)
      .filter((c) => c.unitsReused > 0)
      .sort((a, b) => b.unitsReused - a.unitsReused);

    return NextResponse.json({
      summary: {
        totalListed,
        availableResources: availableResourcesCount,
        completedTransfersCount: completedTransfers.length,
        totalUnitsReused,
        totalSavingsINR: Math.round(totalSavingsINR),
        totalCO2Kg: Number(totalCO2Kg.toFixed(1)),
        totalWasteKg: Number(totalWasteKg.toFixed(1)),
      },
      categoryBreakdown: categoryList,
      recentTransfers: completedTransfers.slice(0, 8),
    });
  } catch (error) {
    console.error('Impact analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate environmental metrics' },
      { status: 500 }
    );
  }
}
