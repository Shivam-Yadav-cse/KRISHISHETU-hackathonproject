import React from 'react';

const statusConfig = {
  'Pending':         { cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
  'Assigned':        { cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  'Picked Up':       { cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' },
  'Out for Delivery':{ cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500 animate-pulse' },
  'Delivered':       { cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
  'Escrow Hold':     { cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', dot: 'bg-indigo-500' },
  'Released':        { cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  'Refunded':        { cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function OrderStatusBadge({ status }) {
  const cfg = statusConfig[status] || { cls: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {status}
    </span>
  );
}
