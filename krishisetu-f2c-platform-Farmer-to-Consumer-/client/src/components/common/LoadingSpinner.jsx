import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className={`${sizeMap[size]} border-4 border-green-200 border-t-green-600 rounded-full animate-spin`}></div>
      {text && <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}
