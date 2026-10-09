import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1C1B18] text-[#FAF8F5] hairline-top mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Column */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-editorial text-3xl sm:text-4xl font-normal leading-tight text-[#FAF8F5]">
              A university that reuses is an institution that endures.
            </h3>
            <p className="text-[13px] text-[#A69F94] leading-relaxed max-w-md font-sans">
              ReUse Campus bridges unused laboratory equipment, academic texts, electronics, and furnishings
              with eager students and sister departments—transforming dormant storage into shared academic abundance.
            </p>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#736C61] pt-4">
              © 2026 ReUse Campus System • Non-Commercial Campus Initiative
            </div>
          </div>

          {/* Core Categories */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#DDD7CE]">
              Campus Resource Sectors
            </h4>
            <ul className="space-y-2 text-[13px] text-[#A69F94]">
              <li>Books & Academic Coursework</li>
              <li>Electronics & Embedded Computing</li>
              <li>Lab Apparatus & Project Materials</li>
              <li>Classroom & Hostel Furnishings</li>
              <li>Event, Hackathon & Club Gear</li>
              <li>Everyday Reusable Supplies</li>
            </ul>
          </div>

          {/* Ethics & Integrity */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#DDD7CE]">
              Stewardship Principles
            </h4>
            <p className="text-[12px] text-[#A69F94] leading-relaxed">
              Every transfer requires mutual confirmation between giver and receiver. Environmental savings are recorded
              only when physical custody is verified.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-[#2C2925] text-[#C4BCB0] text-[10px] tracking-[0.14em] uppercase border border-[#3E3A34]">
                Verified Physical Transfer Protocol
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
