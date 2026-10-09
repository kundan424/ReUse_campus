'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/StatusBadge';

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'transfers'
  const [message, setMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      const [usersRes, transfersRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/transfers'),
      ]);

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (transfersRes.ok) {
        const tData = await transfersRes.json();
        setTransfers(tData.transfers || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleUserActive = async (userId, currentStatus) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
        <h2 className="font-editorial text-3xl text-[#1C1B18]">Restricted Governance Area</h2>
        <p className="text-[13px] text-[#7A746B]">
          Administrator credentials required. Please sign in with an authorized institutional account.
        </p>
        <Link href="/login" className="btn-woodwrights-primary px-6 py-2.5 inline-block">
          Go To Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E8E3DA] pb-8 space-y-2">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8F5338] font-semibold">
          Platform Moderation & Oversight
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#1C1B18] font-normal">
          Institutional Governance
        </h1>
        <p className="text-[13px] text-[#615C53]">
          Audit campus-wide custody handovers, enforce registration integrity, and monitor circularity.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-[#EAF5EA] text-[#2C542C] text-[13px] border border-[#B8D8B8]">
          ✓ {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8E3DA] space-x-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-[12px] tracking-[0.16em] uppercase font-semibold transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-[#1C1B18] text-[#1C1B18]'
              : 'text-[#8A8276] hover:text-[#1C1B18]'
          }`}
        >
          Campus User Registry ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`pb-3 text-[12px] tracking-[0.16em] uppercase font-semibold transition-colors ${
            activeTab === 'transfers'
              ? 'border-b-2 border-[#1C1B18] text-[#1C1B18]'
              : 'text-[#8A8276] hover:text-[#1C1B18]'
          }`}
        >
          Complete Transfer Ledger ({transfers.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-editorial text-2xl text-[#8A8276] italic">
          Loading institutional records...
        </div>
      ) : activeTab === 'users' ? (
        /* Users Table */
        <div className="bg-white border border-[#E8E3DA] overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E8E3DA] bg-[#FAF8F5] text-[10px] tracking-[0.16em] uppercase text-[#8A8276]">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Campus Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Affiliation</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA]">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#FAF8F5]">
                  <td className="p-4 font-medium text-[#1C1B18]">{u.name}</td>
                  <td className="p-4 text-[#544F46]">{u.email}</td>
                  <td className="p-4 capitalize">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold border ${
                        u.role === 'admin'
                          ? 'bg-[#FAF0E6] text-[#8F5338] border-[#E8D0C0]'
                          : u.role === 'department'
                          ? 'bg-[#EBF2EB] text-[#2F442F] border-[#D1E0D1]'
                          : 'bg-[#F4F1EA] text-[#4A453D] border-[#DDD5C7]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-[#6E675D]">
                    {u.role === 'department' ? u.departmentName : u.collegeId || 'General'}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        u.isActive ? 'text-[#2F442F]' : 'text-[#803333]'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleUserActive(u._id, u.isActive)}
                        className={`text-[10px] tracking-[0.12em] uppercase font-semibold px-3 py-1 border transition-colors ${
                          u.isActive
                            ? 'border-[#CCA8A8] text-[#803333] hover:bg-[#FCE8E8]'
                            : 'border-[#A8CCA8] text-[#2F442F] hover:bg-[#EAF5EA]'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Reinstate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Transfer Ledger Table */
        <div className="bg-white border border-[#E8E3DA] overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E8E3DA] bg-[#FAF8F5] text-[10px] tracking-[0.16em] uppercase text-[#8A8276]">
                <th className="p-4 font-semibold">Resource Item</th>
                <th className="p-4 font-semibold">Giver (Custodian)</th>
                <th className="p-4 font-semibold">Receiver</th>
                <th className="p-4 font-semibold text-center">Quantity</th>
                <th className="p-4 font-semibold text-center">Transfer Status</th>
                <th className="p-4 font-semibold text-right">Completed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA]">
              {transfers.map((t) => (
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
                  <td className="p-4 text-center">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="p-4 text-right text-[#8A8276]">
                    {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'In Progress'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
