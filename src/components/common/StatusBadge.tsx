import React from 'react';
import { ItemStatus, BorrowRequestStatus } from '../../types';

interface StatusBadgeProps {
  status: ItemStatus | BorrowRequestStatus | 'SOS' | 'Upcoming';
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let label: string = status;

  switch (status) {
    case 'Available':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      label = 'Available Now';
      break;
    case 'Borrowed':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
      label = 'Currently Borrowed';
      break;
    case 'Pending':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      dotColor = 'bg-blue-500';
      label = 'Pending Approval';
      break;
    case 'Active':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      dotColor = 'bg-emerald-500';
      label = 'Active Borrowing';
      break;
    case 'Upcoming':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      dotColor = 'bg-indigo-500';
      label = 'Upcoming';
      break;
    case 'Accepted':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      label = 'Accepted';
      break;
    case 'Rejected':
    case 'Cancelled':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      dotColor = 'bg-rose-500';
      label = status;
      break;
    case 'Returned':
      colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
      dotColor = 'bg-teal-500';
      label = 'Returned';
      break;
    case 'Overdue':
      colorClasses = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold animate-pulse';
      dotColor = 'bg-rose-600';
      label = 'Overdue';
      break;
    case 'Unavailable':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-300';
      dotColor = 'bg-slate-400';
      label = 'Unavailable';
      break;
    case 'SOS':
      colorClasses = 'bg-amber-500 text-white border-amber-600 font-semibold';
      dotColor = 'bg-white';
      label = '⚡ SOS Urgent';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
};
