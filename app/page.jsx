'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceCard from '@/components/ResourceCard';
import { CAMPUS_CATEGORIES, CONDITIONS } from '@/lib/categories';

export default function HomePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCondition !== 'all') params.append('condition', selectedCondition);
      if (selectedRole !== 'all') params.append('ownerRole', selectedRole);

      const res = await fetch(`/api/resources?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedCondition, selectedRole]);

  return (
    <div className="space-y-16 pb-20">
      {/* Editorial Hero Section */}
      <section className="bg-[#F4EFEA] hairline-bottom py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-block px-3 py-1 bg-[#FAF8F5] hairline-border text-[10px] tracking-[0.25em] uppercase text-[#7A746B] font-semibold">
            Institutional Circularity Network
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#1C1B18] leading-[1.08]">
            Restoring purpose to dormant campus resources.
          </h1>

          <p className="max-w-2xl mx-auto text-[15px] sm:text-base text-[#615C53] font-sans font-light leading-relaxed">
            Eliminating redundant procurement across departments and student bodies. Discover textbooks,
            laboratory apparatus, electronics, and furnishings ready for seamless transfer.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/check-surplus"
              className="btn-woodwrights-primary px-7 py-3.5 inline-flex items-center text-center gap-2 shadow-wood hover:shadow-wood-hover"
            >
              <span>🔍 Need An Item? Check Campus Surplus</span>
            </Link>
            <a
              href="#catalogue"
              className="btn-woodwrights-outline px-7 py-3.5 inline-flex items-center text-center"
            >
              Browse Catalogue
            </a>
            <Link
              href="/resources/new"
              className="btn-woodwrights-outline px-7 py-3.5 inline-flex items-center text-center"
            >
              + List Available Item
            </Link>
          </div>
        </div>
      </section>

      {/* Main Catalogue Discovery Area */}
      <div id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search & Top Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Field */}
            <div className="relative flex-grow max-w-xl">
              <input
                type="text"
                placeholder="Search by textbook title, microcontroller, chair, lab apparatus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white hairline-border px-5 py-3.5 text-[14px] text-[#1C1B18] placeholder-[#9E988E] focus:outline-none focus:border-[#1C1B18] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] tracking-wider uppercase text-[#8A8276] hover:text-[#1C1B18]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filter Selectors */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white hairline-border px-4 py-3 text-[12px] tracking-[0.08em] uppercase font-medium text-[#1C1B18] focus:outline-none focus:border-[#1C1B18]"
              >
                <option value="all">All Donors</option>
                <option value="department">Department Surplus</option>
                <option value="student">Student Listings</option>
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-white hairline-border px-4 py-3 text-[12px] tracking-[0.08em] uppercase font-medium text-[#1C1B18] focus:outline-none focus:border-[#1C1B18]"
              >
                <option value="all">Any Condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6 Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none hairline-bottom">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-[11px] tracking-[0.14em] uppercase font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#1C1B18] text-[#FAF8F5]'
                  : 'bg-white text-[#5E5950] hairline-border hover:bg-[#F2EDE4]'
              }`}
            >
              All Resources
            </button>
            {CAMPUS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-[11px] tracking-[0.14em] uppercase font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#1C1B18] text-[#FAF8F5]'
                    : 'bg-white text-[#5E5950] hairline-border hover:bg-[#F2EDE4]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Items Header */}
        <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#8A8276]">
          <span>
            {loading ? 'Consulting campus registry...' : `${resources.length} Available Listings`}
          </span>
          <span>Verified Transfer Chain</span>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="font-editorial text-2xl text-[#8A8276] italic">
              Retrieving catalogue...
            </div>
            <div className="text-[11px] tracking-[0.15em] uppercase text-[#A39C90]">
              Connecting to campus database
            </div>
          </div>
        ) : resources.length === 0 ? (
          <div className="py-24 text-center bg-white hairline-border space-y-4 px-6">
            <h3 className="font-editorial text-3xl text-[#1C1B18]">No resources currently found</h3>
            <p className="text-[13px] text-[#7A746B] max-w-md mx-auto">
              No active listings match your selected parameters. Be the first to list surplus items in this category.
            </p>
            <div className="pt-2">
              <Link href="/resources/new" className="btn-woodwrights-primary px-6 py-2.5 inline-block">
                List an Item Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((item) => (
              <ResourceCard key={item._id} resource={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
