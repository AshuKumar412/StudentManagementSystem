import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from './Icons';

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Icons.Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Icons.Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}