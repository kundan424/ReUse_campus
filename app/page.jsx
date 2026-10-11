import React from 'react';
import Link from 'next/link';
import { CAMPUS_CATEGORIES } from '@/lib/categories';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1B18]">
      {/* ======================================================== */}
      {/* LANDING PAGE HEADER                                      */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md hairline-bottom">
        {/* Top Announcement Bar */}
        <div className="bg-[#1C1B18] text-[#FAF8F5] text-[10px] tracking-[0.22em] uppercase py-2 px-4 text-center font-medium">
          A Circular Campus Exchange — Minimizing Academic Resource Waste
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-fit py-3 ">
            {/* Logo */}
            <Link href="/" className="flex flex-col group">
              <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#1C1B18] group-hover:opacity-80 transition-opacity">
                ReUse Campus
              </span>
              {/* <span className="text-[9px] tracking-[0.25em] uppercase text-[#8A8276] -mt-1 font-sans">
                Inter-Departmental Stewardship
              </span> */}
            </Link>

            {/* Public Links */}
            {/* <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/catalogue"
                className="text-[11px] tracking-[0.16em] uppercase font-medium text-[#6B655C] hover:text-[#1C1B18] transition-colors"
              >
                Catalogue
              </Link>
              <Link
                href="/check-surplus"
                className="text-[11px] tracking-[0.16em] uppercase font-medium text-[#6B655C] hover:text-[#1C1B18] transition-colors flex items-center gap-1.5"
              >
                <span>Check Surplus</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4C5847]"></span>
              </Link>
              <Link
                href="/impact"
                className="text-[11px] tracking-[0.16em] uppercase font-medium text-[#6B655C] hover:text-[#1C1B18] transition-colors"
              >
                Impact Ledger
              </Link>
            </nav> */}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/login"
                className="text-[11px] tracking-[0.16em] uppercase font-medium text-[#1C1B18] hover:opacity-75 transition-opacity px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="btn-woodwrights-primary px-4 py-2.5 inline-flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main className="flex-grow space-y-20 lg:space-y-28 pb-24">
        {/* ======================================================== */}
        {/* 1. EDITORIAL HERO SECTION                                */}
        {/* ======================================================== */}
        <section className="bg-[#F4EFEA] hairline-bottom py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Decorative watermark */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-5 font-editorial text-[20vw] leading-none text-[#1C1B18] whitespace-nowrap">
            CIRCULAR
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF8F5] hairline-border text-[10px] tracking-[0.25em] uppercase text-[#7A746B] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4C5847]"></span>
              <span>Institutional Circularity Network</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#1C1B18] leading-[1.08] max-w-4xl mx-auto">
              Restoring purpose to dormant campus resources.
            </h1>

            <p className="max-w-2xl mx-auto text-[15px] sm:text-base text-[#615C53] font-sans font-light leading-relaxed">
              Eliminating redundant procurement across university departments, research laboratories, and student bodies.
              Discover textbooks, precision apparatus, electronics, and furnishings ready for seamless transfer.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="btn-woodwrights-primary px-8 py-4 inline-flex items-center gap-2 text-center shadow-xs"
              >
                <span>Enter Member Dashboard</span>
                <span className="text-xs">→</span>
              </Link>

              <Link
                href="/catalogue"
                className="btn-woodwrights-outline px-8 py-4 inline-flex items-center gap-2 text-center"
              >
                <span>Explore Campus Catalogue</span>
              </Link>

              <Link
                href="/check-surplus"
                className="px-6 py-4 text-[11px] tracking-[0.14em] uppercase font-semibold text-[#615C53] hover:text-[#1C1B18] transition-colors"
              >
                🔍 Check Surplus Needs
              </Link>
            </div>

            {/* Real-time Ticker / Metric Strip */}
            <div className="pt-10 border-t border-[#E8E3DA] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
              <div className="space-y-1">
                <div className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">1,240+</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#7A746B] font-semibold">
                  Dormant Assets Diverted
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">18</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#7A746B] font-semibold">
                  Departments Joined
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">₹4.8L+</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#7A746B] font-semibold">
                  Procurement Saved
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-editorial text-3xl sm:text-4xl text-[#4C5847]">100%</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#7A746B] font-semibold">
                  Free Peer Transfer
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. HOW IT WORKS (THE CIRCULAR PIPELINE)                  */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
              Institutional Workflow
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
              How the Campus Exchange Operates
            </h2>
            <p className="text-[13px] text-[#615C53] font-light">
              A verified 3-step chain of custody connecting surplus owners with academic requisitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white hairline-border space-y-4 hover:border-[#1C1B18] transition-colors">
              <span className="font-editorial text-4xl text-[#8A8276]/40 font-light block">01</span>
              <h3 className="font-editorial text-2xl text-[#1C1B18]">List Dormant Resources</h3>
              <p className="text-[13px] text-[#615C53] leading-relaxed">
                Departments or students document surplus lab instruments, extra monitors, books, or tools in minutes with specifications and location tags.
              </p>
              <div className="text-[10px] tracking-[0.16em] uppercase text-[#8A8276] font-semibold pt-2">
                Zero Listing Fees
              </div>
            </div>

            <div className="p-8 bg-white hairline-border space-y-4 hover:border-[#1C1B18] transition-colors">
              <span className="font-editorial text-4xl text-[#8A8276]/40 font-light block">02</span>
              <h3 className="font-editorial text-2xl text-[#1C1B18]">Peer & Department Claim</h3>
              <p className="text-[13px] text-[#615C53] leading-relaxed">
                Requisition items directly with academic rationale. Owners review inbound requests and schedule coordinated custodial handovers on campus.
              </p>
              <div className="text-[10px] tracking-[0.16em] uppercase text-[#8A8276] font-semibold pt-2">
                Verified Student & Staff Accounts
              </div>
            </div>

            <div className="p-8 bg-white hairline-border space-y-4 hover:border-[#1C1B18] transition-colors">
              <span className="font-editorial text-4xl text-[#8A8276]/40 font-light block">03</span>
              <h3 className="font-editorial text-2xl text-[#1C1B18]">Audit Environmental Impact</h3>
              <p className="text-[13px] text-[#615C53] leading-relaxed">
                Upon completed pickup, the platform logs the transfer into the university impact ledger, calculating carbon displacement and e-waste avoidance.
              </p>
              <div className="text-[10px] tracking-[0.16em] uppercase text-[#4C5847] font-semibold pt-2">
                Institutional Sustainability Ledger
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. EXCHANGE CATEGORIES DIRECTORY                         */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E3DA] pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
                Exchange Inventory
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
                Browse Core Campus Categories
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="text-[11px] tracking-[0.14em] uppercase font-semibold text-[#1C1B18] hover:underline"
            >
              Open Complete Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CAMPUS_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href="/catalogue"
                className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all flex flex-col items-center text-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F4EFEA] flex items-center justify-center font-editorial text-xl group-hover:bg-[#1C1B18] group-hover:text-[#FAF8F5] transition-colors">
                  {cat.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="text-[12px] font-semibold text-[#1C1B18] leading-tight group-hover:underline">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-[#8A8276] font-light">
                    Surplus Items
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. INSTITUTIONAL IMPACT BANNER                           */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1C1B18] text-[#FAF8F5] p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-block px-3 py-1 bg-white/10 text-[10px] tracking-[0.2em] uppercase text-[#DDD7CE] font-semibold">
                Scope 3 Emissions Reduction
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight">
                Every transferred item delays procurement emissions.
              </h2>
              <p className="text-[13px] sm:text-base text-[#DDD7CE] font-light leading-relaxed">
                When equipment is reused instead of discarded, the campus eliminates embedded manufacturing carbon, reduces hazardous e-waste, and preserves student budgets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 flex-shrink-0 w-full sm:w-auto">
              <Link
                href="/impact"
                className="px-7 py-3.5 bg-[#FAF8F5] text-[#1C1B18] text-[11px] tracking-[0.14em] uppercase font-semibold text-center hover:bg-white transition-colors"
              >
                View Campus Impact Ledger
              </Link>
              <Link
                href="/check-surplus"
                className="px-7 py-3.5 border border-white/30 text-[#FAF8F5] text-[11px] tracking-[0.14em] uppercase font-semibold text-center hover:bg-white/10 transition-colors"
              >
                Verify Surplus Checklist
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. CALL TO ACTION BANNER                                 */}
        {/* ======================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-10">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
            Participate Today
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#1C1B18]">
            Have surplus equipment gathering dust?
          </h2>
          <p className="max-w-xl mx-auto text-[14px] text-[#615C53] font-light">
            Whether you are a department laboratory with decommissioned meters or a student with textbooks, list your items or enter the member dashboard.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-woodwrights-primary px-8 py-3.5 inline-block"
            >
              Enter Member Dashboard
            </Link>
            <Link
              href="/catalogue"
              className="btn-woodwrights-outline px-8 py-3.5 inline-block"
            >
              Search Available Items
            </Link>
          </div>
        </section>
      </main>

      {/* Landing Footer */}
      <footer className="hairline-top bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] text-[#7A746B]">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="font-editorial text-lg text-[#1C1B18] font-medium">ReUse Campus</span>
            <span className="hidden sm:inline">|</span>
            <span>A Circular Campus Resource Exchange Network</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] tracking-[0.1em] uppercase">
            <Link href="/catalogue" className="hover:text-[#1C1B18]">Catalogue</Link>
            <Link href="/check-surplus" className="hover:text-[#1C1B18]">Surplus</Link>
            <Link href="/impact" className="hover:text-[#1C1B18]">Impact</Link>
            <Link href="/login" className="hover:text-[#1C1B18]">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
