import React from 'react';

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs animate-pulse">
      <div className="h-12 bg-slate-100 dark:bg-slate-700/40 border-b border-slate-200/60 dark:border-slate-700" />
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-6 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-200/80 dark:bg-slate-700 rounded-md"
                style={{ width: `${Math.max(40, 100 - c * 15)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs animate-pulse space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-7 w-14 bg-slate-300 dark:bg-slate-600 rounded" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
          </div>
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded pt-2" />
        </div>
      ))}
    </div>
  );
}