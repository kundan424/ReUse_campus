'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CAMPUS_CATEGORIES, CONDITIONS } from '@/lib/categories';
import StatusBadge from '@/components/StatusBadge';

export default function CheckSurplusPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Search input state
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [quantity, setQuantity] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checkError, setCheckError] = useState('');

  // Tab state: 'check' | 'requisitions'
  const [activeTab, setActiveTab] = useState('check');

  // Requisition submission state (when item not found)
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState('electronics');
  const [reqQty, setReqQty] = useState(1);
  const [reqUrgency, setReqUrgency] = useState('standard');
  const [reqDescription, setReqDescription] = useState('');
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqSuccess, setReqSuccess] = useState('');
  const [reqError, setReqError] = useState('');

  // Active requisitions list state
  const [requisitionsList, setRequisitionsList] = useState([]);
  const [loadingRequisitions, setLoadingRequisitions] = useState(false);

  // Quick preset sample search queries
  const quickSearches = [
    { label: 'Monitor', category: 'electronics' },
    { label: 'Arduino', category: 'electronics' },
    { label: 'Algorithms (CLRS)', category: 'books' },
    { label: 'Microscope', category: 'lab_supplies' },
    { label: 'Study Table', category: 'furniture' },
  ];

  const handleQuickSearch = (item) => {
    setQuery(item.label);
    if (item.category) setCategory(item.category);
    performCheck(item.label, item.category || category, quantity);
  };

  const performCheck = async (searchQuery, searchCategory, searchQty) => {
    const q = (searchQuery !== undefined ? searchQuery : query).trim();
    if (!q) {
      setCheckError('Please enter an item name or specification to check campus inventory.');
      return;
    }

    setIsChecking(true);
    setCheckError('');
    setReqSuccess('');
    setHasChecked(true);

    try {
      const res = await fetch('/api/resources/surplus-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          category: searchCategory !== undefined ? searchCategory : category,
          quantity: parseInt(searchQty !== undefined ? searchQty : quantity, 10) || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to check campus inventory');
      }

      setCheckResult(data);
      // Pre-fill requisition form if item is not found
      if (!data.found) {
        setReqTitle(q);
        setReqCategory(searchCategory !== 'all' ? searchCategory : 'electronics');
        setReqQty(searchQty || quantity);
      }
    } catch (err) {
      setCheckError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckSubmit = (e) => {
    e.preventDefault();
    performCheck();
  };

  const handleRequisitionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setReqSubmitting(true);
    setReqError('');
    setReqSuccess('');

    try {
      const res = await fetch('/api/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reqTitle,
          category: reqCategory,
          quantityNeeded: parseInt(reqQty, 10),
          urgency: reqUrgency,
          description: reqDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post requisition');
      }

      setReqSuccess('Requisition logged successfully! The campus community has been notified.');
      setShowRequisitionForm(false);
      fetchRequisitions();
    } catch (err) {
      setReqError(err.message);
    } finally {
      setReqSubmitting(false);
    }
  };

  const fetchRequisitions = async () => {
    setLoadingRequisitions(true);
    try {
      const res = await fetch('/api/requisitions');
      if (res.ok) {
        const data = await res.json();
        setRequisitionsList(data.requisitions || []);
      }
    } catch (err) {
      console.error('Failed to fetch requisitions:', err);
    } finally {
      setLoadingRequisitions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requisitions') {
      fetchRequisitions();
    }
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Editorial Page Header */}
      <div className="border-b border-[#E8E3DA] pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8276] font-semibold">
            Institutional Procurement Avoidance Engine
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4EFEA] border border-[#E8E3DA] text-[11px] text-[#544F46] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4C5847] animate-pulse"></span>
            Live Campus Inventory Sync
          </span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl text-[#1C1B18] font-normal leading-[1.1]">
          Surplus Verification & Need Requisition
        </h1>
        <p className="text-[14px] text-[#615C53] max-w-3xl font-light leading-relaxed">
          Before initiating procurement of new supplies or departmental equipment, verify if dormant surplus is
          already available across campus. Eliminate redundant spending and divert institutional e-waste.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-6 pt-4">
          <button
            onClick={() => setActiveTab('check')}
            className={`text-[12px] tracking-[0.16em] uppercase font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'check'
                ? 'border-[#1C1B18] text-[#1C1B18]'
                : 'border-transparent text-[#8A8276] hover:text-[#1C1B18]'
            }`}
          >
            1. Check Surplus Availability
          </button>
          <button
            onClick={() => setActiveTab('requisitions')}
            className={`text-[12px] tracking-[0.16em] uppercase font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'requisitions'
                ? 'border-[#1C1B18] text-[#1C1B18]'
                : 'border-transparent text-[#8A8276] hover:text-[#1C1B18]'
            }`}
          >
            2. Campus Need Requisitions ({requisitionsList.length || '•'})
          </button>
        </div>
      </div>

      {/* TAB 1: INSTANT SURPLUS CHECK */}
      {activeTab === 'check' && (
        <div className="space-y-10">
          {/* Main Search Panel */}
          <div className="bg-white border border-[#E8E3DA] p-6 sm:p-8 shadow-wood space-y-6">
            <div className="space-y-2">
              <h2 className="text-[16px] font-medium text-[#1C1B18]">
                What equipment, apparatus, or material do you require?
              </h2>
              <p className="text-[12px] text-[#8A8276]">
                Enter the item title, hardware specification, or book edition. We'll cross-reference all campus labs, departments, and donors.
              </p>
            </div>

            <form onSubmit={handleCheckSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Query Input */}
                <div className="md:col-span-6">
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6B655C] font-semibold mb-1">
                    Resource Specification *
                  </label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Dell Monitor, Arduino Uno, Organic Chemistry..."
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-4 py-3 text-[14px] text-[#1C1B18] focus:outline-none focus:border-[#1C1B18] focus:bg-white"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6B655C] font-semibold mb-1">
                    Category Sector
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3 py-3 text-[13px] text-[#1C1B18] focus:outline-none focus:border-[#1C1B18] focus:bg-white"
                  >
                    <option value="all">All Sectors</option>
                    {CAMPUS_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Input */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6B655C] font-semibold mb-1">
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-4 py-3 text-[14px] text-[#1C1B18] focus:outline-none focus:border-[#1C1B18] focus:bg-white"
                  />
                </div>
              </div>

              {/* Quick Preset Queries */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-[#8A8276] uppercase tracking-[0.12em]">Quick Checks:</span>
                {quickSearches.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickSearch(item)}
                    className="px-2.5 py-1 text-[11px] border border-[#E8E3DA] bg-[#FAF8F5] text-[#544F46] hover:border-[#1C1B18] hover:text-[#1C1B18] transition-colors"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8E3DA]">
                <span className="text-[11px] text-[#8A8276] italic">
                  Instant search across active lab surplus, faculty donations & student listings.
                </span>
                <button
                  type="submit"
                  disabled={isChecking}
                  className="btn-woodwrights-primary px-8 py-3 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isChecking ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Scanning Inventory...</span>
                    </>
                  ) : (
                    <span>Check Campus Surplus</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {checkError && (
            <div className="p-4 bg-[#FCE8E8] text-[#802B2B] text-[13px] border border-[#E8B8B8]">
              {checkError}
            </div>
          )}

          {reqSuccess && (
            <div className="p-4 bg-[#E8F5E9] text-[#2E7D32] text-[13px] border border-[#C8E6C9]">
              {reqSuccess}
            </div>
          )}

          {/* DYNAMIC RESULT SECTION */}
          {hasChecked && checkResult && (
            <div className="space-y-8 animate-fadeIn">
              {/* STATE A: SURPLUS FOUND */}
              {checkResult.found ? (
                <div className="space-y-6">
                  {/* Avoidance Victory Banner */}
                  <div className="bg-[#FAF6EE] border border-[#D8CFBF] p-6 sm:p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CFBF] pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4C5847]"></span>
                          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4C5847]">
                            Purchase Avoidance Opportunity Detected
                          </span>
                        </div>
                        <h3 className="font-editorial text-2xl sm:text-3xl text-[#1C1B18] font-normal mt-1">
                          Surplus Available On Campus!
                        </h3>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8276]">Avoidable Spend</span>
                        <div className="text-2xl font-editorial font-bold text-[#4C5847]">
                          ₹{checkResult.projectedSavingsINR.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <p className="text-[13px] text-[#544F46] leading-relaxed">
                      Instead of raising an institutional purchase requisition or purchasing new, you can claim{' '}
                      <strong>{checkResult.claimableUnits} unit(s)</strong> directly from existing campus custody.
                    </p>

                    {/* Impact Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="bg-white p-4 border border-[#D8CFBF]">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8276] block">
                          Avoided Procurement Cost
                        </span>
                        <span className="font-editorial text-xl font-medium text-[#1C1B18] mt-1 block">
                          ₹{checkResult.projectedSavingsINR.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#8A8276]">Preserved campus budget</span>
                      </div>

                      <div className="bg-white p-4 border border-[#D8CFBF]">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8276] block">
                          Projected CO₂ Abatement
                        </span>
                        <span className="font-editorial text-xl font-medium text-[#4C5847] mt-1 block">
                          {checkResult.projectedCarbonSavedKg} kg CO₂e
                        </span>
                        <span className="text-[11px] text-[#8A8276]">Embedded manufacturing avoided</span>
                      </div>

                      <div className="bg-white p-4 border border-[#D8CFBF]">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8276] block">
                          Available In Inventory
                        </span>
                        <span className="font-editorial text-xl font-medium text-[#1C1B18] mt-1 block">
                          {checkResult.totalAvailableUnits} Units
                        </span>
                        <span className="text-[11px] text-[#8A8276]">Across {checkResult.totalMatches} custodian(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Matching Resources Grid */}
                  <div className="space-y-4">
                    <h3 className="text-[12px] tracking-[0.2em] uppercase font-bold text-[#1C1B18]">
                      Matching Campus Surplus Items ({checkResult.resources.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {checkResult.resources.map((item) => (
                        <div
                          key={item._id}
                          className="bg-white border border-[#E8E3DA] p-5 shadow-wood hover:border-[#1C1B18] transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8276]">
                                {item.category} {item.subCategory ? `• ${item.subCategory}` : ''}
                              </span>
                              <StatusBadge status={item.status} />
                            </div>

                            <h4 className="font-editorial text-xl text-[#1C1B18] font-normal leading-snug">
                              {item.title}
                            </h4>

                            <p className="text-[12px] text-[#615C53] line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-[#E8E3DA]">
                            <div className="grid grid-cols-2 gap-2 text-[12px]">
                              <div>
                                <span className="text-[#8A8276] text-[10px] uppercase block tracking-wider">
                                  Available
                                </span>
                                <span className="font-medium text-[#1C1B18]">
                                  {item.availableQuantity} of {item.quantity} units
                                </span>
                              </div>
                              <div>
                                <span className="text-[#8A8276] text-[10px] uppercase block tracking-wider">
                                  Condition
                                </span>
                                <span className="font-medium capitalize text-[#1C1B18]">
                                  {item.condition.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[#8A8276] text-[10px] uppercase block tracking-wider">
                                  Pickup Location & Custodian
                                </span>
                                <span className="font-medium text-[#1C1B18]">
                                  📍 {item.location}
                                </span>
                                <span className="text-[11px] text-[#8A8276] block">
                                  Custodian: {item.owner?.name || 'Campus Member'} ({item.owner?.departmentName || item.ownerRole})
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/resources/${item._id}`}
                              className="btn-woodwrights-primary w-full py-2.5 text-center block mt-2"
                            >
                              Claim / Request This Surplus Unit →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* STATE B: NO SURPLUS FOUND */
                <div className="bg-white border border-[#E8E3DA] p-8 shadow-wood space-y-6">
                  <div className="border-b border-[#E8E3DA] pb-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8F5338]"></span>
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8F5338]">
                        Zero Active Surplus Detected
                      </span>
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-[#1C1B18] font-normal">
                      No matching surplus currently registered for "{checkResult.query}"
                    </h3>
                    <p className="text-[13px] text-[#615C53] max-w-2xl leading-relaxed">
                      Campus inventory currently does not have active spare units of this item. Don't worry — you can post
                      an <strong>Official Campus Requisition</strong> so departments, laboratories, and graduating students
                      with uncatalogued stock can fulfill your requirement!
                    </p>
                  </div>

                  {!showRequisitionForm ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                      <div className="text-[12px] text-[#8A8276]">
                        Posting a requisition broadcasts your need to all campus lab managers and student custodians.
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRequisitionForm(true)}
                        className="btn-woodwrights-primary px-6 py-3 whitespace-nowrap"
                      >
                        + Post Official Campus Requisition
                      </button>
                    </div>
                  ) : (
                    /* INLINE REQUISITION FORM */
                    <form onSubmit={handleRequisitionSubmit} className="space-y-6 pt-4 border-t border-[#E8E3DA]">
                      <h4 className="text-[12px] tracking-[0.18em] uppercase font-bold text-[#1C1B18]">
                        Register Needed Requisition
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-[0.14em] uppercase text-[#6B655C] font-semibold mb-1">
                            Required Item Title *
                          </label>
                          <input
                            type="text"
                            value={reqTitle}
                            onChange={(e) => setReqTitle(e.target.value)}
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-4 py-2.5 text-[13px] text-[#1C1B18]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-[0.14em] uppercase text-[#6B655C] font-semibold mb-1">
                            Category *
                          </label>
                          <select
                            value={reqCategory}
                            onChange={(e) => setReqCategory(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3 py-2.5 text-[13px] text-[#1C1B18]"
                          >
                            {CAMPUS_CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-[0.14em] uppercase text-[#6B655C] font-semibold mb-1">
                            Units Needed *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={reqQty}
                            onChange={(e) => setReqQty(e.target.value)}
                            required
                            className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-4 py-2.5 text-[13px] text-[#1C1B18]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-[0.14em] uppercase text-[#6B655C] font-semibold mb-1">
                            Urgency Level
                          </label>
                          <select
                            value={reqUrgency}
                            onChange={(e) => setReqUrgency(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-3 py-2.5 text-[13px] text-[#1C1B18]"
                          >
                            <option value="standard">Standard (Within Semester)</option>
                            <option value="priority">Priority (Needed within 2 weeks)</option>
                            <option value="urgent">Urgent (Immediate Lab/Project Need)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] tracking-[0.14em] uppercase text-[#6B655C] font-semibold mb-1">
                            Use Case / Department Justification
                          </label>
                          <textarea
                            rows="2"
                            value={reqDescription}
                            onChange={(e) => setReqDescription(e.target.value)}
                            placeholder="Explain why this equipment or textbook is needed (e.g. Capstone project, replacement for broken lab monitor)..."
                            className="w-full bg-[#FAF8F5] border border-[#E8E3DA] px-4 py-2.5 text-[13px] text-[#1C1B18]"
                          ></textarea>
                        </div>
                      </div>

                      {reqError && (
                        <div className="p-3 bg-[#FCE8E8] text-[#802B2B] text-[12px] border border-[#E8B8B8]">
                          {reqError}
                        </div>
                      )}

                      <div className="flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowRequisitionForm(false)}
                          className="btn-woodwrights-outline px-5 py-2.5"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={reqSubmitting}
                          className="btn-woodwrights-primary px-6 py-2.5 disabled:opacity-50"
                        >
                          {reqSubmitting ? 'Publishing Requisition...' : 'Publish Campus Requisition'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE CAMPUS REQUISITIONS FEED */}
      {activeTab === 'requisitions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3DA] pb-4">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#1C1B18] font-normal">
                Active Campus Requisitions
              </h2>
              <p className="text-[13px] text-[#615C53]">
                Items currently needed by campus departments, research labs, and students. Check if you have dormant surplus to fulfill!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('check');
                setShowRequisitionForm(true);
              }}
              className="btn-woodwrights-primary px-5 py-2.5 whitespace-nowrap self-start sm:self-auto"
            >
              + Submit New Requisition
            </button>
          </div>

          {loadingRequisitions ? (
            <div className="p-12 text-center text-[13px] text-[#8A8276]">
              Loading campus requisitions ledger...
            </div>
          ) : requisitionsList.length === 0 ? (
            <div className="bg-white border border-[#E8E3DA] p-12 text-center space-y-3">
              <span className="font-editorial text-2xl text-[#1C1B18] block">No Open Requisitions</span>
              <p className="text-[13px] text-[#8A8276] max-w-md mx-auto">
                There are currently no unmet resource requisitions. Use the Surplus Check tab to search campus inventory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requisitionsList.map((req) => (
                <div
                  key={req._id}
                  className="bg-white border border-[#E8E3DA] p-5 shadow-wood hover:border-[#1C1B18] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#8A8276]">
                        {req.category} • Needed: {req.quantityNeeded} Units
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 border ${
                          req.urgency === 'urgent'
                            ? 'bg-[#FCE8E8] text-[#802B2B] border-[#E8B8B8]'
                            : req.urgency === 'priority'
                            ? 'bg-[#FFF8E1] text-[#B78103] border-[#FFE082]'
                            : 'bg-[#F4EFEA] text-[#544F46] border-[#E8E3DA]'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl text-[#1C1B18] font-normal leading-snug">
                      {req.title}
                    </h3>

                    {req.description && (
                      <p className="text-[12px] text-[#615C53] line-clamp-2 leading-relaxed">
                        {req.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E8E3DA] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-[#8A8276] block text-[10px] uppercase">Requested By</span>
                      <span className="font-medium text-[#1C1B18]">
                        {req.requester?.name || 'Campus Member'} ({req.departmentName || req.requesterRole})
                      </span>
                    </div>

                    <Link
                      href={`/resources/new`}
                      className="btn-woodwrights-outline px-3 py-1.5 text-[10px]"
                    >
                      I Have This Surplus (List Item) →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
