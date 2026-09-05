import React from 'react';
import { Icons } from './Icons';

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = "indigo",
  subtitle
}) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/40",
      glow: "group-hover:shadow-indigo-500/10"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/40",
      glow: "group-hover:shadow-emerald-500/10"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/40",
      glow: "group-hover:shadow-amber-500/10"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/40",
      glow: "group-hover:shadow-blue-500/10"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/40",
      glow: "group-hover:shadow-purple-500/10"
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/40",
      glow: "group-hover:shadow-rose-500/10"
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-xl ${scheme.glow} transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
      {/* Decorative ambient gradient circle */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${scheme.bg} opacity-40 blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`}></div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-0.5">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value ?? '0'}
            </h3>
          </div>
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} border ${scheme.border} shadow-xs group-hover:scale-110 transition-transform duration-300 shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100/80 dark:border-slate-700/50 flex items-center justify-between text-xs">
          {change && (
            <span className={`inline-flex items-center gap-1 font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isPositive ? <Icons.ArrowUpRight className="w-3.5 h-3.5" /> : <Icons.ArrowDownRight className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-400 dark:text-slate-500 ml-auto truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}