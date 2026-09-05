import React from 'react';

export default function StatusBadge({ status, label, size = "md" }) {
  if (!status && !label) return null;

  const raw = String(status || label).toUpperCase().trim();
  const displayLabel = label || status;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold"
  };

  const getStyle = () => {
    switch (raw) {
      // Enrollment Statuses
      case 'ENROLLED':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60';
      case 'ACTIVE':
      case 'APPROVED':
      case 'PRESENT':
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60';
      case 'DROPPED':
      case 'REJECTED':
      case 'ABSENT':
      case 'OVERDUE':
      case 'INACTIVE':
      case 'F':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60';
      case 'PENDING':
      case 'LATE':
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60';
      // Grades
      case 'A+':
      case 'A':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      case 'C':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getDotColor = () => {
    switch (raw) {
      case 'ENROLLED':
        return 'bg-blue-500';
      case 'ACTIVE':
      case 'APPROVED':
      case 'PRESENT':
      case 'PAID':
        return 'bg-emerald-500';
      case 'COMPLETED':
        return 'bg-purple-500';
      case 'DROPPED':
      case 'REJECTED':
      case 'ABSENT':
      case 'OVERDUE':
      case 'INACTIVE':
      case 'F':
        return 'bg-rose-500';
      case 'PENDING':
      case 'LATE':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium tracking-wide ${sizeClasses[size] || sizeClasses.md} ${getStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
      <span>{displayLabel}</span>
    </span>
  );
}