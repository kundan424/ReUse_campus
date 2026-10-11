'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import StatusBadge from '@/components/StatusBadge';
import { CAMPUS_CATEGORIES, CONDITIONS } from '@/lib/categories';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useSidebar();

  const [requests, setRequests] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  // Decision Modal Sub-state for Incoming Reviews
  const [decisionModalReq, setDecisionModalReq] = useState(null);
  const [decisionAction, setDecisionAction] = useState('approve');
  const [decisionNote, setDecisionNote] = useState('');
  const [pickupScheduledAt, setPickupScheduledAt] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // New Resource Form State
  const [formCategory, setFormCategory] = useState(CAMPUS_CATEGORIES[0].id);
  const [formPreset, setFormPreset] = useState('');
  const [isCustomPreset, setIsCustomPreset] = useState(false);
  const [customPresetName, setCustomPresetName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formCondition, setFormCondition] = useState('good');
  const [formLocation, setFormLocation] = useState('');
  const [formPickupInstructions, setFormPickupInstructions] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchDashboardData = async () => {
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingIncoming = incoming.filter((r) => r.status === 'pending');
  const activeRequests = requests.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled' && r.status !== 'rejected'
  );
  const completedTransfers =
    requests.filter((r) => r.status === 'completed').length +
    incoming.filter((r) => r.status === 'completed').length;

  // Handler: Confirm Item Receipt
  const handleConfirmReceipt = async (requestId) => {
    setActionLoading(requestId);
    setMessage('');
    try {
      const res = await fetch('/api/transfers/confirm-receiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm receipt');
      setMessage(data.message);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handler: Cancel Requisition
  const handleCancelRequest = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this transfer request?')) return;
    setActionLoading(requestId);
    setMessage('');
    try {
      const res = await fetch(`/api/requests/${requestId}/cancel`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel request');
      setMessage('Request has been cancelled.');
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handler: Approve / Reject Decision Submit
  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!decisionModalReq) return;

    setModalSubmitting(true);
    setMessage('');

    try {
      const res = await fetch(`/api/requests/${decisionModalReq._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: decisionAction,
          decisionNote,
          pickupScheduledAt: pickupScheduledAt || null,
          pickupNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update request');

      setMessage(data.message);
      setDecisionModalReq(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setModalSubmitting(false);
    }
  };

  // Handler: Confirm Physical Giver Handover
  const handleConfirmGiverHandover = async (requestId) => {
    setActionLoading(requestId);
    setMessage('');
    try {
      const res = await fetch('/api/transfers/confirm-giver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm handover');
      setMessage(data.message);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handler: Archive Listing
  const handleArchive = async (id) => {
    if (!confirm('Are you sure you want to archive this resource listing?')) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to archive resource');
    }
  };

  // Handler: Submit New Resource
  const activeCategoryConfig =
    CAMPUS_CATEGORIES.find((c) => c.id === formCategory) || CAMPUS_CATEGORIES[0];

  const handlePresetSelect = (preset) => {
    setFormPreset(preset);
    if (preset === '__custom__') {
      setIsCustomPreset(true);
    } else {
      setIsCustomPreset(false);
      if (!formTitle || activeCategoryConfig.presets.includes(formTitle)) {
        setFormTitle(preset);
      }
    }
  };

  const handleCreateResourceSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const finalSubCategory = isCustomPreset ? customPresetName : formPreset;

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          category: formCategory,
          subCategory: finalSubCategory,
          quantity: parseInt(formQuantity, 10),
          condition: formCondition,
          location: formLocation,
          pickupInstructions: formPickupInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to list resource');
      }

      setMessage(`Resource "${formTitle}" published successfully!`);
      // Reset form
      setFormTitle('');
      setFormDescription('');
      setFormQuantity(1);
      setFormLocation('');
      setFormPickupInstructions('');
      fetchDashboardData();
      // Switch right content to inventory
      setActiveTab('inventory');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Flash Success Message */}
      {message && (
        <div className="p-4 bg-[#EAF5EA] text-[#2C542C] text-[13px] border border-[#B8D8B8] flex items-center justify-between">
          <span>✓ {message}</span>
          <button
            onClick={() => setMessage('')}
            className="text-[11px] uppercase tracking-wider font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: DASHBOARD OVERVIEW (Default)                     */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Header */}
          <div className="border-b border-[#E8E3DA] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#7A746B] font-semibold">
                  Institutional Workspace
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4C5847]"></span>
                <span className="text-[10px] tracking-[0.16em] uppercase text-[#4C5847] font-semibold">
                  {user?.departmentName || (user?.role === 'admin' ? 'Administrative Access' : 'Campus Member')}
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl text-[#1C1B18] font-normal tracking-tight">
                Welcome back, {user?.name}
              </h1>

              <p className="text-[13px] text-[#615C53] max-w-2xl font-light">
                Manage your inter-departmental transfers, track incoming resource requests, and audit surplus inventory items.
              </p>
            </div>

            {/* Quick Action Button -> Switches right content to 'new' */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('new')}
                className="btn-woodwrights-primary px-5 py-3 inline-flex items-center gap-2 text-center cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>List Surplus Item</span>
              </button>
              <Link
                href="/catalogue"
                className="btn-woodwrights-outline px-5 py-3 inline-flex items-center gap-2 text-center"
              >
                <span>Browse Catalogue</span>
              </Link>
            </div>
          </div>

          {/* Metrics Row -> Click any to switch right content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <button
              onClick={() => setActiveTab('requests')}
              className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all group space-y-3 text-left w-full cursor-pointer"
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
            </button>

            <button
              onClick={() => setActiveTab('incoming')}
              className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all group space-y-3 text-left w-full cursor-pointer"
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
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className="p-5 bg-white hairline-border hover:border-[#1C1B18] transition-all group space-y-3 text-left w-full cursor-pointer"
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
            </button>

            <Link
              href="/impact"
              className="p-5 bg-[#F4EFEA] hairline-border hover:border-[#1C1B18] transition-all group space-y-3 text-left block"
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

          {/* Two-Column Feeds Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feed 1: Incoming Reviews */}
            <div className="bg-white hairline-border p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4">
                <div>
                  <h2 className="font-editorial text-2xl text-[#1C1B18]">Incoming Review Requests</h2>
                  <p className="text-[11px] text-[#7A746B]">Peers requesting your surplus items</p>
                </div>
                <button
                  onClick={() => setActiveTab('incoming')}
                  className="text-[10px] tracking-[0.14em] uppercase text-[#1C1B18] font-semibold hover:underline cursor-pointer"
                >
                  View All ({incoming.length}) →
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-[12px] text-[#8A8276]">Loading requests...</div>
              ) : incoming.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="font-editorial text-xl text-[#7A746B]">No inbound requests at this time</p>
                  <p className="text-[12px] text-[#8A8276] max-w-sm mx-auto">
                    When campus members request items you have posted, they will appear here.
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
                        <button
                          onClick={() => setActiveTab('incoming')}
                          className="text-[10px] tracking-wider uppercase font-semibold text-[#1C1B18] hover:underline cursor-pointer"
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feed 2: My Requisitions */}
            <div className="bg-white hairline-border p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4">
                <div>
                  <h2 className="font-editorial text-2xl text-[#1C1B18]">My Requisitions</h2>
                  <p className="text-[11px] text-[#7A746B]">Items you have claimed across campus</p>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-[10px] tracking-[0.14em] uppercase text-[#1C1B18] font-semibold hover:underline cursor-pointer"
                >
                  View All ({requests.length}) →
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-[12px] text-[#8A8276]">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="font-editorial text-xl text-[#7A746B]">You have no active item requests</p>
                  <p className="text-[12px] text-[#8A8276] max-w-sm mx-auto">
                    Explore the campus surplus catalogue to requisition equipment and textbooks.
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
                        <button
                          onClick={() => setActiveTab('requests')}
                          className="text-[10px] tracking-wider uppercase font-semibold text-[#1C1B18] hover:underline cursor-pointer"
                        >
                          Track Pickup →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Stewardship Shortcuts */}
          <div className="bg-[#FAF8F5] hairline-border p-6 sm:p-8 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#7A746B] font-semibold">
                Stewardship Actions
              </span>
              <h3 className="font-editorial text-2xl text-[#1C1B18]">
                Quick Workflows
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => setActiveTab('new')}
                className="p-4 bg-white hairline-border hover:border-[#1C1B18] transition-colors group space-y-1.5 text-left cursor-pointer"
              >
                <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#1C1B18] flex items-center justify-between">
                  <span>+ List New Resource</span>
                  <span className="text-[#8A8276] group-hover:text-[#1C1B18]">→</span>
                </div>
                <p className="text-[12px] text-[#615C53]">
                  Post lab tools, hardware, textbooks, or furnishings ready for transfer.
                </p>
              </button>

              <Link
                href="/check-surplus"
                className="p-4 bg-white hairline-border hover:border-[#1C1B18] transition-colors group space-y-1.5 text-left block"
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
                className="p-4 bg-white hairline-border hover:border-[#1C1B18] transition-colors group space-y-1.5 text-left block"
              >
                <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-[#1C1B18] flex items-center justify-between">
                  <span>🌱 Impact & Carbon Ledger</span>
                  <span className="text-[#8A8276] group-hover:text-[#1C1B18]">→</span>
                </div>
                <p className="text-[12px] text-[#615C53]">
                  Audit university-wide waste reduction metrics and circularity scorecards.
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: MY REQUISITIONS CONTENT                          */}
      {/* ======================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="border-b border-[#E8E3DA] pb-6 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
                Acquisition Tracking
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
                My Resource Requisitions
              </h1>
              <p className="text-[13px] text-[#615C53] mt-1 font-light">
                Track status of items you have requested across campus, schedule pickups, and confirm receipts.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] bg-white hairline-border hover:bg-[#EDE7DE] cursor-pointer"
            >
              ← Overview
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#8A8276]">Loading your requisitions...</div>
          ) : requests.length === 0 ? (
            <div className="py-20 text-center bg-white border border-[#E8E3DA] p-8 space-y-3">
              <h3 className="font-editorial text-2xl text-[#1C1B18]">No active requests found</h3>
              <p className="text-[13px] text-[#7A746B] max-w-md mx-auto">
                You haven&apos;t requested any campus items yet. Browse available textbooks, computing components, or lab apparatus.
              </p>
              <Link href="/catalogue" className="btn-woodwrights-primary px-6 py-2.5 inline-block">
                Explore Campus Catalogue
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {requests.map((req) => {
                const resItem = req.resource;
                const transfer = req.transfer;
                const isApproved = req.status === 'approved' || req.status === 'ready_for_pickup';
                const isCompleted = req.status === 'completed';
                const hasReceiverConfirmed = transfer?.receiverConfirmedAt;

                return (
                  <div
                    key={req._id}
                    className="bg-white border border-[#E8E3DA] p-6 space-y-5 hover:border-[#1C1B18] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE4] pb-3">
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={req.status} />
                        <span className="text-[11px] text-[#8A8276]">
                          Requested on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[12px] font-medium text-[#1C1B18]">
                        Units: <strong>{req.requestedQuantity}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-editorial text-2xl text-[#1C1B18]">
                        {resItem?.title || 'Resource'}
                      </h3>
                      <div className="text-[12px] text-[#615C53]">
                        Location: <span className="font-medium text-[#1C1B18]">{resItem?.location || 'Campus'}</span> • Owner: <span className="font-medium text-[#1C1B18]">{req.owner?.name || req.owner?.departmentName || 'Custodian'}</span>
                      </div>
                      {req.purpose && (
                        <div className="text-[12px] bg-[#FAF8F5] p-3 border border-[#E8E3DA] text-[#58534C]">
                          <span className="font-semibold text-[#1C1B18]">Stated Purpose:</span> {req.purpose}
                        </div>
                      )}
                    </div>

                    {isApproved && (
                      <div className="bg-[#F6F8F5] p-4 border border-[#D5E0D2] space-y-1.5 text-[12px]">
                        <div className="font-semibold text-[#375232]">Pickup Instructions & Coordination:</div>
                        <div className="text-[#4E6649]">{transfer?.pickupNotes || resItem?.pickupInstructions || 'Coordinate pickup with custodian.'}</div>
                        {transfer?.pickupScheduledAt && (
                          <div className="text-[11px] text-[#375232] font-semibold">
                            Scheduled: {new Date(transfer.pickupScheduledAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0ECE4]">
                      <div>
                        {isApproved && !hasReceiverConfirmed && (
                          <button
                            onClick={() => handleConfirmReceipt(req._id)}
                            disabled={actionLoading === req._id}
                            className="btn-woodwrights-primary px-5 py-2.5 text-[11px] cursor-pointer"
                          >
                            {actionLoading === req._id ? 'Confirming...' : '✓ Confirm Item Receipt'}
                          </button>
                        )}
                        {isCompleted && (
                          <span className="text-[11px] text-[#2C542C] font-semibold">
                            ✓ Physical handover completed & logged in campus ledger
                          </span>
                        )}
                      </div>

                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(req._id)}
                          disabled={actionLoading === req._id}
                          className="text-[11px] text-[#B91C1C] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                        >
                          {actionLoading === req._id ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: INCOMING REVIEWS CONTENT                         */}
      {/* ======================================================== */}
      {activeTab === 'incoming' && (
        <div className="space-y-6">
          <div className="border-b border-[#E8E3DA] pb-6 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
                Custodial Approvals
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
                Incoming Review Requests
              </h1>
              <p className="text-[13px] text-[#615C53] mt-1 font-light">
                Review and approve transfer requisitions submitted by campus members for your surplus items.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] bg-white hairline-border hover:bg-[#EDE7DE] cursor-pointer"
            >
              ← Overview
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#8A8276]">Loading reviews...</div>
          ) : incoming.length === 0 ? (
            <div className="py-20 text-center bg-white border border-[#E8E3DA] p-8 space-y-3">
              <h3 className="font-editorial text-2xl text-[#1C1B18]">No inbound requests found</h3>
              <p className="text-[13px] text-[#7A746B] max-w-md mx-auto">
                No active requests for your surplus items. When peers requisition your items, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {incoming.map((req) => {
                const resItem = req.resource;
                const transfer = req.transfer;
                const isPending = req.status === 'pending';
                const isApproved = req.status === 'approved' || req.status === 'ready_for_pickup';
                const hasGiverConfirmed = transfer?.giverConfirmedAt;

                return (
                  <div
                    key={req._id}
                    className="bg-white border border-[#E8E3DA] p-6 space-y-5 hover:border-[#1C1B18] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE4] pb-3">
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={req.status} />
                        <span className="text-[11px] text-[#8A8276]">
                          Submitted on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[12px] font-medium text-[#1C1B18]">
                        Quantity Requested: <strong>{req.requestedQuantity}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-editorial text-2xl text-[#1C1B18]">
                        {resItem?.title || 'Resource'}
                      </h3>
                      <div className="text-[12px] text-[#615C53]">
                        Requester: <span className="font-semibold text-[#1C1B18]">{req.requester?.name}</span> ({req.requester?.departmentName || req.requester?.collegeId || 'Member'}) • Email: <a href={`mailto:${req.requester?.email}`} className="text-[#8F5338] underline">{req.requester?.email}</a>
                      </div>
                      {req.purpose && (
                        <div className="text-[12px] bg-[#FAF8F5] p-3 border border-[#E8E3DA] text-[#58534C]">
                          <span className="font-semibold text-[#1C1B18]">Academic Justification:</span> {req.purpose}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0ECE4]">
                      {isPending ? (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setDecisionModalReq(req);
                              setDecisionAction('approve');
                              setDecisionNote('');
                              setPickupScheduledAt('');
                              setPickupNotes(req.resource?.pickupInstructions || '');
                            }}
                            className="btn-woodwrights-primary px-5 py-2.5 text-[11px] cursor-pointer"
                          >
                            Approve Transfer
                          </button>
                          <button
                            onClick={() => {
                              setDecisionModalReq(req);
                              setDecisionAction('reject');
                              setDecisionNote('');
                            }}
                            className="btn-woodwrights-outline px-5 py-2.5 text-[11px] text-[#B91C1C] border-[#B91C1C] hover:bg-[#B91C1C] hover:text-white cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <div>
                          {isApproved && !hasGiverConfirmed && (
                            <button
                              onClick={() => handleConfirmGiverHandover(req._id)}
                              disabled={actionLoading === req._id}
                              className="btn-woodwrights-primary px-5 py-2.5 text-[11px] cursor-pointer"
                            >
                              {actionLoading === req._id ? 'Confirming...' : '✓ Confirm Physical Handover'}
                            </button>
                          )}
                          {req.status === 'completed' && (
                            <span className="text-[11px] text-[#2C542C] font-semibold">
                              ✓ Handover completed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Decision Modal Form Popup */}
          {decisionModalReq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setDecisionModalReq(null)}
              />
              <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#1C1B18] p-6 shadow-2xl space-y-4 z-10">
                <h3 className="font-editorial text-2xl text-[#1C1B18]">
                  {decisionAction === 'approve' ? 'Approve Transfer Request' : 'Decline Request'}
                </h3>
                <p className="text-[12px] text-[#615C53]">
                  {decisionAction === 'approve'
                    ? 'Coordinate handover instructions with the requester.'
                    : 'Provide a reason for declining this request.'}
                </p>

                <form onSubmit={handleDecisionSubmit} className="space-y-3">
                  {decisionAction === 'approve' && (
                    <>
                      <div>
                        <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1">
                          Scheduled Pickup Time
                        </label>
                        <input
                          type="datetime-local"
                          value={pickupScheduledAt}
                          onChange={(e) => setPickupScheduledAt(e.target.value)}
                          className="w-full bg-white border border-[#E8E3DA] px-3 py-2 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1">
                          Pickup Location & Directions
                        </label>
                        <textarea
                          rows="2"
                          value={pickupNotes}
                          onChange={(e) => setPickupNotes(e.target.value)}
                          placeholder="e.g. Lab 204, Mechanical Engineering Block..."
                          className="w-full bg-white border border-[#E8E3DA] px-3 py-2 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1">
                      Custodian Note
                    </label>
                    <textarea
                      rows="2"
                      value={decisionNote}
                      onChange={(e) => setDecisionNote(e.target.value)}
                      placeholder="Optional internal note or message to requester..."
                      className="w-full bg-white border border-[#E8E3DA] px-3 py-2 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setDecisionModalReq(null)}
                      className="px-4 py-2 text-[11px] text-[#7A746B] hover:text-[#1C1B18] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalSubmitting}
                      className={`btn-woodwrights-primary px-5 py-2 text-[11px] cursor-pointer ${
                        decisionAction === 'reject' ? 'bg-[#B91C1C] hover:bg-[#991B1B]' : ''
                      }`}
                    >
                      {modalSubmitting ? 'Saving...' : decisionAction === 'approve' ? 'Confirm Approval' : 'Confirm Decline'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: MY INVENTORY CONTENT                             */}
      {/* ======================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="border-b border-[#E8E3DA] pb-6 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
                Donor Custodianship
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
                My Resource Inventory
              </h1>
              <p className="text-[13px] text-[#615C53] mt-1 font-light">
                Track listed items, reserved quantities, and active transfer custody across campus.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('new')}
                className="btn-woodwrights-primary px-4 py-2 text-[11px] cursor-pointer"
              >
                + List New Item
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] bg-white hairline-border hover:bg-[#EDE7DE] cursor-pointer"
              >
                ← Overview
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#8A8276]">Loading inventory...</div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center bg-white border border-[#E8E3DA] p-8 space-y-4">
              <h3 className="font-editorial text-2xl text-[#1C1B18]">No active listings found</h3>
              <p className="text-[13px] text-[#7A746B] max-w-md mx-auto">
                You have not listed any surplus equipment or books yet.
              </p>
              <button
                onClick={() => setActiveTab('new')}
                className="btn-woodwrights-primary px-6 py-2.5 inline-block text-[11px] cursor-pointer"
              >
                + List Your First Surplus Item
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E8E3DA] bg-white border border-[#E8E3DA]">
              {listings.map((item) => (
                <div key={item._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8A8276] px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E8E3DA]">
                        {item.condition}
                      </span>
                      <span className="text-[11px] text-[#8A8276]">{item.category}</span>
                    </div>

                    <h3 className="font-editorial text-2xl text-[#1C1B18]">{item.title}</h3>

                    <div className="text-[12px] text-[#615C53]">
                      Available Units: <strong className="text-[#1C1B18]">{item.availableQuantity}</strong> of {item.quantity} • Location: {item.location || 'Campus'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleArchive(item._id)}
                      className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#B91C1C] hover:bg-[#FDF2F2] border border-[#E8E3DA] transition-colors cursor-pointer"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 5: LIST NEW SURPLUS ITEM FORM                       */}
      {/* ======================================================== */}
      {activeTab === 'new' && (
        <div className="space-y-6">
          <div className="border-b border-[#E8E3DA] pb-6 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
                Surplus Registration
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18]">
                List Surplus Resource
              </h1>
              <p className="text-[13px] text-[#615C53] mt-1 font-light">
                Document laboratory apparatus, computing hardware, textbooks, or furnishings ready for transfer.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] bg-white hairline-border hover:bg-[#EDE7DE] cursor-pointer"
            >
              ← Overview
            </button>
          </div>

          <div className="bg-white border border-[#E8E3DA] p-6 sm:p-8 max-w-3xl">
            {formError && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] text-[#B91C1C] text-[12px] mb-6">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateResourceSubmit} className="space-y-5">
              {/* Category */}
              <div>
                <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                  Select Sector / Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => {
                    setFormCategory(e.target.value);
                    setFormPreset('');
                  }}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                >
                  {CAMPUS_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-[10px] tracking-wider uppercase text-[#8A8276] mb-1.5">
                  Common Presets for {activeCategoryConfig.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeCategoryConfig.presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-[10px] uppercase tracking-wider px-3 py-1 border transition-colors cursor-pointer ${
                        formPreset === preset
                          ? 'bg-[#1C1B18] text-white border-[#1C1B18]'
                          : 'bg-[#FAF8F5] text-[#58534C] border-[#E8E3DA] hover:border-[#1C1B18]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Rigol Digital Storage Oscilloscope, 50MHz"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                />
              </div>

              {/* Quantity & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                    Units Available *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                    Physical Condition *
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                  Current Campus Location *
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Mechanical Engineering Annex, Lab 304"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                  Description & Accessories
                </label>
                <textarea
                  rows="3"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail working condition, included cables, textbooks edition, markings, etc."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                />
              </div>

              {/* Pickup Instructions */}
              <div>
                <label className="block text-[11px] tracking-wider uppercase font-semibold text-[#1C1B18] mb-1.5">
                  Pickup Instructions
                </label>
                <input
                  type="text"
                  value={formPickupInstructions}
                  onChange={(e) => setFormPickupInstructions(e.target.value)}
                  placeholder="e.g. Available weekdays 2PM - 5PM with college ID"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-2.5 text-[13px] text-[#1C1B18] focus:border-[#1C1B18] outline-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 text-[11px] text-[#7A746B] hover:text-[#1C1B18] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn-woodwrights-primary px-7 py-3 text-[11px] cursor-pointer"
                >
                  {formSubmitting ? 'Publishing...' : 'Publish Surplus Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}