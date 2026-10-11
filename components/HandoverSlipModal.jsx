'use client';

import React from 'react';

export default function HandoverSlipModal({ req, onClose }) {
  if (!req) return null;

  const resItem = req.resource;
  const transfer = req.transfer;
  const isCompleted = req.status === 'completed';
  const hasGiverConfirmed = transfer?.giverConfirmedAt;
  const hasReceiverConfirmed = transfer?.receiverConfirmedAt;
  const passId = `RCP-${req._id ? req._id.toString().slice(-6).toUpperCase() : 'PASS'}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B18]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Printable Pass Container */}
      <div className="bg-[#FAF8F5] max-w-2xl w-full border border-[#DED7CB] shadow-2xl p-6 sm:p-10 space-y-6 my-8 text-[#1C1B18] relative">
        
        {/* Top Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4 print:hidden">
          <div className="flex items-center space-x-2 text-[11px] tracking-[0.2em] uppercase font-bold text-[#8A8276]">
            <span>Digital Circulation Pass</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              type="button"
              className="btn-woodwrights-primary px-4 py-1.5 text-[11px] uppercase tracking-wider flex items-center space-x-1.5"
            >
              <span>🖨️ Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="text-[#8A8276] hover:text-[#1C1B18] text-xl font-light px-2"
              title="Close Pass"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Pass Inner Border */}
        <div className="border-2 border-[#1C1B18] p-6 sm:p-8 space-y-6 bg-white relative">
          {/* Institutional Header */}
          <div className="text-center space-y-1.5 border-b border-[#E8E3DA] pb-6">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#7A502E] font-bold">
              Campus Resource Circulation System
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1C1B18] tracking-tight">
              Official Handover & Gate Pass
            </h2>
            <p className="text-[11px] text-[#7A746B] uppercase tracking-widest">
              Authorized Inter-Departmental Transfer Certificate
            </p>
          </div>

          {/* Reference & Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3 border border-[#E8E3DA] text-[12px]">
            <div>
              <span className="text-[#8A8276] text-[10px] uppercase tracking-wider block">Pass Reference ID</span>
              <span className="font-mono font-bold text-[#1C1B18] tracking-wider">{passId}</span>
            </div>
            <div>
              <span className="text-[#8A8276] text-[10px] uppercase tracking-wider block">Issued Date</span>
              <span className="font-medium text-[#1C1B18]">
                {new Date(req.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[#8A8276] text-[10px] uppercase tracking-wider block">Current Status</span>
              <span
                className={`font-bold uppercase text-[11px] tracking-wider px-2 py-0.5 rounded inline-block ${
                  isCompleted
                    ? 'bg-[#EAF5EA] text-[#2C542C] border border-[#B8D8B8]'
                    : 'bg-[#FFF7E6] text-[#8F5338] border border-[#F3D6B5]'
                }`}
              >
                {isCompleted ? '✓ Handover Completed' : '● Approved for Pickup'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[13px] border-b border-[#E8E3DA] pb-6">
            {/* Resource & Quantity */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#8A8276] font-bold block">
                Item Information
              </span>
              <div className="font-editorial text-xl text-[#1C1B18]">
                {resItem?.title || 'Campus Resource'}
              </div>
              <div className="text-[#544F46] space-y-0.5 text-[12px]">
                <div>Category: <span className="font-medium text-[#1C1B18] capitalize">{resItem?.category || 'General'}</span></div>
                <div>Condition: <span className="font-medium text-[#1C1B18] capitalize">{resItem?.condition || 'Good'}</span></div>
                <div>Allocated Units: <strong className="text-[#1C1B18]">{req.requestedQuantity}</strong></div>
              </div>
            </div>

            {/* Custodian / Donor Source */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#8A8276] font-bold block">
                Issuing Custodian / Source
              </span>
              <div className="font-medium text-[#1C1B18]">
                {resItem?.owner?.name || 'Department Custodian'}
              </div>
              <div className="text-[#544F46] space-y-0.5 text-[12px]">
                <div>Department: <span className="font-medium text-[#1C1B18]">{resItem?.owner?.department || 'Campus Department'}</span></div>
                <div>Pickup Location: <span className="font-medium text-[#1C1B18]">📍 {resItem?.location || 'Designated Campus Point'}</span></div>
                {resItem?.owner?.phone && <div>Contact: <span className="font-mono text-[#1C1B18]">{resItem.owner.phone}</span></div>}
              </div>
            </div>
          </div>

          {/* Recipient & Schedule Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[13px] border-b border-[#E8E3DA] pb-6">
            {/* Recipient Details */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#8A8276] font-bold block">
                Authorized Recipient / Bearer
              </span>
              <div className="font-medium text-[#1C1B18]">
                {req.requester?.name || 'Student / Staff'}
              </div>
              <div className="text-[#544F46] space-y-0.5 text-[12px]">
                <div>Affiliation: <span className="font-medium text-[#1C1B18]">{req.requester?.department || 'Student Body'}</span></div>
                <div>Stated Purpose: <span className="italic text-[#1C1B18]">"{req.purpose}"</span></div>
              </div>
            </div>

            {/* Scheduled Handover */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#8A8276] font-bold block">
                Pickup Schedule & Instructions
              </span>
              <div className="text-[#1C1B18] font-medium">
                {req.pickupScheduledAt
                  ? `🗓️ ${new Date(req.pickupScheduledAt).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : 'Time: Coordinate directly with custodian'}
              </div>
              <div className="text-[#544F46] text-[12px]">
                Note: {req.decisionNote || resItem?.pickupInstructions || 'Bring student ID for identification.'}
              </div>
            </div>
          </div>

          {/* Handover Verification Protocol Stamps */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8A8276] font-bold block">
              Dual-Verification Handover Stamps
            </span>
            <div className="grid grid-cols-2 gap-4">
              {/* Donor Stamp */}
              <div
                className={`p-3 border rounded text-[11px] space-y-1 ${
                  hasGiverConfirmed
                    ? 'border-[#B8D8B8] bg-[#F2FAF2] text-[#2C542C]'
                    : 'border-[#E8E3DA] bg-[#FAF8F5] text-[#8A8276]'
                }`}
              >
                <div className="font-bold flex items-center space-x-1.5">
                  <span>{hasGiverConfirmed ? '✓ STAMPED' : '○ PENDING'}</span>
                  <span>— Donor Handover</span>
                </div>
                <div className="text-[10px]">
                  {hasGiverConfirmed && transfer?.giverConfirmedAt
                    ? `Confirmed on ${new Date(transfer.giverConfirmedAt).toLocaleDateString()}`
                    : 'Physical dispatch awaiting donor confirmation'}
                </div>
              </div>

              {/* Receiver Stamp */}
              <div
                className={`p-3 border rounded text-[11px] space-y-1 ${
                  hasReceiverConfirmed
                    ? 'border-[#B8D8B8] bg-[#F2FAF8] text-[#2C542C]'
                    : 'border-[#E8E3DA] bg-[#FAF8F5] text-[#8A8276]'
                }`}
              >
                <div className="font-bold flex items-center space-x-1.5">
                  <span>{hasReceiverConfirmed ? '✓ STAMPED' : '○ PENDING'}</span>
                  <span>— Recipient Receipt</span>
                </div>
                <div className="text-[10px]">
                  {hasReceiverConfirmed && transfer?.receiverConfirmedAt
                    ? `Confirmed on ${new Date(transfer.receiverConfirmedAt).toLocaleDateString()}`
                    : 'Physical receipt awaiting recipient confirmation'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Notice */}
          <div className="pt-2 text-center text-[10px] text-[#8A8276] uppercase tracking-wider border-t border-[#F0ECE4]">
            This pass authorizes temporary or permanent asset transfer under the Campus Resource Circulation Charter.
          </div>
        </div>

        {/* Modal Bottom Close Button (Hidden on Print) */}
        <div className="flex justify-end pt-2 print:hidden">
          <button
            onClick={onClose}
            type="button"
            className="btn-woodwrights-outline px-6 py-2 text-[11px] uppercase tracking-wider"
          >
            Close Pass
          </button>
        </div>
      </div>
    </div>
  );
}
