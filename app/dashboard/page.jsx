'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/StatusBadge';

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [reqRes, incRes, listRes] = await Promise.all([
          fetch('/api/requests/my-requests').then((r) => (r.ok ? r.json() : { requests: [] })),
          fetch('/api/requests/incoming').then((r) => (r.ok ? r.json() : { requests: [] })),
          fetch('/api/resources/my-listings').then((r) => (r.ok ? r.json() : { listings: [] })),
        ]);

        setRequests(reqRes.requests || []);
        setIncoming(incRes.requests || []);
        setListings(listRes.listings || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingIncoming = incoming.filter((r) => r.status === 'pending');
  const activeRequests = requests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled' && r.status !== 'rejected');
  const completedTransfers = requests.filter((r) => r.status === 'completed').length + incoming.filter((r) => r.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6  md:py-10 space-y-10">
      {/* Workspace Welcome Header */}
      <div className="border-b border-[#E8E3DA] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#7A746B] font-semibold">
              Institutional Workspace
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4C5847]"></span>
            <span className="text-[10px] tracking-[0.16em] uppercase text-[#4C5847] font-semibold">
              {user?.departmentName || user?.role === 'admin' ? 'Administrative Access' : 'Campus Member'}
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl text-[#1C1B18] font-normal tracking-tight">
            Welcome back, {user?.name}
          </h1>

          <p className="text-[13px] text-[#615C53] max-w-2xl font-light">
            Manage your inter-departmental transfers, track incoming resource requests, and audit surplus inventory items.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/resources/new"
            className="btn-woodwrights-primary px-5 py-3 inline-flex items-center gap-2 text-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>List Surplus Item</span>
          </Link>
          <Link
            href="/catalogue"
            className="btn-woodwrights-outline px-5 py-3 inline-flex items-center gap-2 text-center"
          >
            <span>Browse Catalogue</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <Link
          href="/requests/my-requests"
          className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
              My Requisitions
            </span>
            <span className="text-xs text-[#8A8276] group-hover:text-[#1C1B18] transition-colors">→</span>
          </div>
          <div className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
            {loading ? '—' : activeRequests.length}
          </div>
          <div className="text-[11px] text-[#615C53]">
            {activeRequests.length === 1 ? '1 active item requested' : `${activeRequests.length} active items requested`}
          </div>
        </Link>

        {/* Metric 2 */}
        <Link
          href="/requests/incoming"
          className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
              Incoming Reviews
            </span>
            {pendingIncoming.length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#8F5338] text-white rounded-xs">
                {pendingIncoming.length} New
              </span>
            )}
          </div>
          <div className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
            {loading ? '—' : incoming.length}
          </div>
          <div className="text-[11px] text-[#615C53]">
            {pendingIncoming.length} awaiting your approval
          </div>
        </Link>

        {/* Metric 3 */}
        <Link
          href="/resources/my-listings"
          className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8276] font-semibold">
              Listed Inventory
            </span>
            <span className="text-xs text-[#8A8276] group-hover:text-[#1C1B18] transition-colors">→</span>
          </div>
          <div className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
            {loading ? '—' : listings.length}
          </div>
          <div className="text-[11px] text-[#615C53]">
            Surplus assets posted on campus
          </div>
        </Link>

        {/* Metric 4 */}
        <Link
          href="/impact"
          className="p-5 bg-[#F4EFEA] hairline-border hover:border-[#1C1B18] transition-all group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#7A746B] font-semibold">
              Completed Transfers
            </span>
            <span className="w-2 h-2 rounded-full bg-[#4C5847]"></span>
          </div>
          <div className="font-editorial text-3xl sm:text-4xl text-[#4C5847]">
            {loading ? '—' : completedTransfers}
          </div>
          <div className="text-[11px] text-[#615C53]">
            Diverted from academic waste
          </div>
        </Link>
      </div>

      {/* Main Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Incoming Reviews Needing Action */}
        <div className="bg-white hairline-border p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4">
            <div>
              <h2 className="font-editorial text-2xl text-[#1C1B18]">Incoming Review Requests</h2>
              <p className="text-[11px] text-[#7A746B]">Peers and departments requesting your listed surplus</p>
            </div>
            <Link
              href="/requests/incoming"
              className="text-[10px] tracking-[0.14em] uppercase text-[#1C1B18] font-semibold hover:underline"
            >
              View All ({incoming.length})
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[12px] text-[#8A8276]">Loading requests...</div>
          ) : incoming.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-editorial text-xl text-[#7A746B]">No inbound requests at this time</p>
              <p className="text-[12px] text-[#8A8276] max-w-sm mx-auto">
                When campus members request items you have posted, they will appear here for your review and approval.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8E3DA] space-y-3">
              {incoming.slice(0, 4).map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="font-medium text-[13px] text-[#1C1B18] truncate">
                      {item.resource?.title || 'Resource'}
                    </div>
                    <div className="text-[11px] text-[#7A746B]">
                      Requested by: <span className="text-[#1C1B18] font-medium">{item.requester?.name || 'Member'}</span>
                    </div>
                    <div className="text-[10px] text-[#8A8276]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <Link
                      href="/requests/incoming"
                      className="text-[10px] tracking-wider uppercase font-semibold text-[#1C1B18] hover:underline"
                    >
                      Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: My Active Requisitions */}
        <div className="bg-white hairline-border p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4">
            <div>
              <h2 className="font-editorial text-2xl text-[#1C1B18]">My Requisitions</h2>
              <p className="text-[11px] text-[#7A746B]">Items you have claimed across campus</p>
            </div>
            <Link
              href="/requests/my-requests"
              className="text-[10px] tracking-[0.14em] uppercase text-[#1C1B18] font-semibold hover:underline"
            >
              View All ({requests.length})
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[12px] text-[#8A8276]">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-editorial text-xl text-[#7A746B]">You have no active item requests</p>
              <p className="text-[12px] text-[#8A8276] max-w-sm mx-auto">
                Explore the campus surplus catalogue to requisition equipment, electronics, and books.
              </p>
              <Link
                href="/catalogue"
                className="btn-woodwrights-outline px-4 py-2 inline-block text-[11px]"
              >
                Explore Catalogue
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E8E3DA] space-y-3">
              {requests.slice(0, 4).map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="font-medium text-[13px] text-[#1C1B18] truncate">
                      {item.resource?.title || 'Resource'}
                    </div>
                    <div className="text-[11px] text-[#7A746B]">
                      Location: {item.resource?.location || 'Campus'}
                    </div>
                    <div className="text-[10px] text-[#8A8276]">
                      Requested on {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <Link
                      href="/requests/my-requests"
                      className="text-[10px] tracking-wider uppercase font-semibold text-[#1C1B18] hover:underline"
                    >
                      Track Pickup →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stewardship Quick Links Grid */}
      <div className="bg-[#FAF8F5] hairline-border p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#7A746B] font-semibold">
            Campus Stewardship Tools
          </span>
          <h3 className="font-editorial text-2xl text-[#1C1B18]">
            Quick Access Modules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <Link
            href="/resources/new"
            className="p-4 bg-white hairline-border hover:border-[#1C1B18] transition-colors group space-y-1.5"
          >
            <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#1C1B18] flex items-center justify-between">
              <span>+ List New Resource</span>
              <span className="text-[#8A8276] group-hover:text-[#1C1B18]">→</span>
            </div>
            <p className="text-[12px] text-[#615C53]">
              Post lab tools, hardware, textbooks, or furnishings ready for transfer.
            </p>
          </Link>

          <Link
            href="/check-surplus"
            className="p-4 bg-white hairline-border hover:border-[#1C1B18] transition-colors group space-y-1.5"
          >
            <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#1C1B18] flex items-center justify-between">
              <span>🔍 Check Surplus / Need Item</span>
              <span className="text-[#8A8276] group-hover:text-[#1C1B18]">→</span>
            </div>
            <p className="text-[12px] text-[#615C53]">
              Check existing inventory before procuring new departmental assets.
            </p>
          </Link>

          <Link
            href="/impact"
            className="p-4 bg-white hairline-border hover:border-[#1C1B18] transition-colors group space-y-1.5"
          >
            <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#1C1B18] flex items-center justify-between">
              <span>🌱 Impact & Carbon Ledger</span>
              <span className="text-[#8A8276] group-hover:text-[#1C1B18]">→</span>
            </div>
            <p className="text-[12px] text-[#615C53]">
              Audit university-wide waste reduction metrics and circularity scorecards.
            </p>
          </Link>

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="p-4 bg-[#FDF6F2] border border-[#E8D4C8] hover:border-[#8F5338] transition-colors group space-y-1.5"
            >
              <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#8F5338] flex items-center justify-between">
                <span>⚖️ Governance & Admin</span>
                <span className="text-[#8F5338]">→</span>
              </div>
              <p className="text-[12px] text-[#615C53]">
                Manage user access permissions, view requisition logs, and enforce policies.
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}