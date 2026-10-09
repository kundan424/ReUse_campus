import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    available: 'bg-[#EBF2EB] text-[#2F442F] border-[#D1E0D1]',
    reserved: 'bg-[#F7EFE6] text-[#7A502E] border-[#E8D9C5]',
    in_progress: 'bg-[#F7EFE6] text-[#7A502E] border-[#E8D9C5]',
    ready_for_pickup: 'bg-[#EBF3F5] text-[#2D5460] border-[#CFE1E6]',
    completed: 'bg-[#EBF2EB] text-[#2F442F] border-[#D1E0D1]',
    rejected: 'bg-[#F7EBEB] text-[#803333] border-[#E8CACA]',
    cancelled: 'bg-[#F2EFEB] text-[#696156] border-[#DDD7CD]',
    pending: 'bg-[#FAF4E6] text-[#7A642B] border-[#EDE0BE]',
  };

  const labels = {
    available: 'Available',
    reserved: 'Reserved',
    in_progress: 'Handover In Progress',
    ready_for_pickup: 'Ready For Pickup',
    completed: 'Transfer Verified',
    rejected: 'Declined',
    cancelled: 'Cancelled',
    pending: 'Awaiting Decision',
  };

  const currentStyle = styles[status] || 'bg-[#F2EFEB] text-[#696156] border-[#DDD7CD]';
  const label = labels[status] || status;

  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[10px] tracking-[0.14em] uppercase font-semibold border ${currentStyle}`}
    >
      {label}
    </span>
  );
}
