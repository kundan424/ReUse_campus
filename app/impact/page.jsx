'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ImpactPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch('/api/analytics/impact');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load impact stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchImpact();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center">
        <div className="font-editorial text-2xl text-[#8A8276] italic">
          Compiling campus environmental audit ledger...
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    totalListed: 0,
    availableResources: 0,
    completedTransfersCount: 0,
    totalUnitsReused: 0,
    totalSavingsINR: 0,
    totalCO2Kg: 0,
    totalWasteKg: 0,
  };

  const categories = data?.categoryBreakdown || [];
  const recentTransfers = data?.recentTransfers || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Editorial Header */}
      <div className="border-b border-[#E8E3DA] pb-8 space-y-3">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
          Transparency & Measurement
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#1C1B18] font-normal">
          Campus Circularity & Reuse Ledger
        </h1>
        <p className="text-[14px] text-[#615C53] max-w-2xl font-light leading-relaxed">
          Measuring the real-world outcome of inter-departmental transfers. In keeping with institutional integrity,
          impact is recorded strictly when physical handover is confirmed by both donor and recipient.
        </p>
      </div>

      {/* Primary Measured Activity Metric Cards */}
      <div className="space-y-4">
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
          Part A — Direct Measured Campus Activity
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E8E3DA] p-6 space-y-2">
            <span className="text-[10px] tracking-[0.16em] uppercase text-[#8A8276] block">
              Total Units Reused
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#1C1B18]">
              {summary.totalUnitsReused}
            </div>
            <p className="text-[12px] text-[#7A746B]">Verified physical handovers</p>
          </div>

          <div className="bg-white border border-[#E8E3DA] p-6 space-y-2">
            <span className="text-[10px] tracking-[0.16em] uppercase text-[#8A8276] block">
              Completed Transfers
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#1C1B18]">
              {summary.completedTransfersCount}
            </div>
            <p className="text-[12px] text-[#7A746B]">Mutual two-party confirmations</p>
          </div>

          <div className="bg-white border border-[#E8E3DA] p-6 space-y-2">
            <span className="text-[10px] tracking-[0.16em] uppercase text-[#8A8276] block">
              Active Registered Resources
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#1C1B18]">
              {summary.totalListed}
            </div>
            <p className="text-[12px] text-[#7A746B]">Catalogue listings to date</p>
          </div>

          <div className="bg-white border border-[#E8E3DA] p-6 space-y-2">
            <span className="text-[10px] tracking-[0.16em] uppercase text-[#8A8276] block">
              Currently Available
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#2F442F]">
              {summary.availableResources}
            </div>
            <p className="text-[12px] text-[#7A746B]">Units unreserved on campus</p>
          </div>
        </div>
      </div>

      {/* Part B: Estimated Environmental & Economic Benefits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
            Part B — Modeled Economic & Environmental Benefit
          </div>
          <span className="text-[10px] tracking-[0.12em] uppercase text-[#736C61] bg-[#FAF8F5] px-2 py-1 border border-[#E8E3DA]">
            Methodology: LCA Category Factor v1.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] border border-[#E8E3DA] p-8 space-y-3">
            <span className="text-[10px] tracking-[0.18em] uppercase text-[#8F5338] font-semibold block">
              Avoided Institutional Expenditure
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#1C1B18]">
              ₹{summary.totalSavingsINR.toLocaleString()}
            </div>
            <p className="text-[12px] text-[#6E675D] leading-relaxed">
              Estimated procurement expenses saved by students and departments through resource reuse instead of
              repurchasing brand-new equipment.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E8E3DA] p-8 space-y-3">
            <span className="text-[10px] tracking-[0.18em] uppercase text-[#384838] font-semibold block">
              Avoided Carbon Footprint
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#1C1B18]">
              {summary.totalCO2Kg} <span className="text-xl font-sans text-[#6B655C]">kg CO₂e</span>
            </div>
            <p className="text-[12px] text-[#6E675D] leading-relaxed">
              Emissions prevented by extending product lifecycles, reducing manufacturing burden and transport
              logistics for new items.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E8E3DA] p-8 space-y-3">
            <span className="text-[10px] tracking-[0.18em] uppercase text-[#544F46] font-semibold block">
              Landfill Waste Diverted
            </span>
            <div className="font-editorial text-4xl sm:text-5xl text-[#1C1B18]">
              {summary.totalWasteKg} <span className="text-xl font-sans text-[#6B655C]">kg</span>
            </div>
            <p className="text-[12px] text-[#6E675D] leading-relaxed">
              Solid waste kept out of municipal campus disposal systems and scrap heaps through organized campus
              reallocation.
            </p>
          </div>
        </div>
      </div>

      {/* Part C: Highest Activity Sectors */}
      <div className="space-y-4">
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
          Sector Activity Distribution
        </div>

        <div className="bg-white border border-[#E8E3DA] p-8">
          {categories.length === 0 ? (
            <p className="text-[13px] text-[#7A746B]">No sector transfer activity recorded yet.</p>
          ) : (
            <div className="space-y-5">
              {categories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-[#1C1B18]">{cat.name}</span>
                    <span className="text-[#6E675D]">
                      <strong>{cat.unitsReused} units</strong> transferred ({cat.transfersCount} handovers)
                    </span>
                  </div>
                  <div className="w-full bg-[#F2EDE4] h-2">
                    <div
                      className="bg-[#1C1B18] h-2"
                      style={{
                        width: `${Math.min(
                          100,
                          (cat.unitsReused / (summary.totalUnitsReused || 1)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Part D: Audit Ledger of Verified Transfers */}
      <div className="space-y-4">
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
          Recent Verified Transfer Ledger
        </div>

        <div className="bg-white border border-[#E8E3DA] overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E8E3DA] bg-[#FAF8F5] text-[10px] tracking-[0.16em] uppercase text-[#8A8276]">
                <th className="p-4 font-semibold">Item & Category</th>
                <th className="p-4 font-semibold">Giver (Custodian)</th>
                <th className="p-4 font-semibold">Receiver</th>
                <th className="p-4 font-semibold text-center">Units</th>
                <th className="p-4 font-semibold text-right">Completed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA]">
              {recentTransfers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-[#8A8276]">
                    No verified transfers recorded in ledger yet.
                  </td>
                </tr>
              ) : (
                recentTransfers.map((t) => (
                  <tr key={t._id} className="hover:bg-[#FAF8F5]">
                    <td className="p-4 font-medium text-[#1C1B18]">
                      {t.resource?.title || 'Resource'}
                    </td>
                    <td className="p-4 text-[#544F46]">
                      {t.giver?.name} ({t.giver?.role})
                    </td>
                    <td className="p-4 text-[#544F46]">
                      {t.receiver?.name} ({t.receiver?.role})
                    </td>
                    <td className="p-4 text-center font-medium text-[#1C1B18]">
                      {t.quantityTransferred}
                    </td>
                    <td className="p-4 text-right text-[#8A8276]">
                      {new Date(t.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
