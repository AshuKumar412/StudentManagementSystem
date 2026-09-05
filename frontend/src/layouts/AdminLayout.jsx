import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationService } from '../services/registrationService';
import { Icons } from '../components/common/Icons';
import ThemeToggle from '../components/common/ThemeToggle';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchPendingCount = () => {
    registrationService.getPendingRegistrations()
      .then(res => {
        const list = res.data?.data || [];
        setPendingCount(list.length);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPendingCount();
    const timer = setInterval(fetchPendingCount, 20000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { path: '/admin/registrations', label: 'Registrations', icon: Icons.FileText, badge: pendingCount },
    { path: '/admin/students', label: 'Students', icon: Icons.Students },
    { path: '/admin/teachers', label: 'Faculty', icon: Icons.Teacher },
    { path: '/admin/departments', label: 'Departments', icon: Icons.Department },
    { path: '/admin/courses', label: 'Courses', icon: Icons.Courses },
    { path: '/admin/enrollments', label: 'Enrollments', icon: Icons.Enrollments },
    { path: '/admin/attendance', label: 'Attendance', icon: Icons.Attendance },
    { path: '/admin/marks', label: 'Marks', icon: Icons.Marks },
    { path: '/admin/fees', label: 'Fees', icon: Icons.Fees },
  ];

  // Get current page title
  const currentNav = navItems.find(n => location.pathname.startsWith(n.path));
  const pageTitle = currentNav ? currentNav.label : 'Admin Portal';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-slate-900 dark:bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileDrawerOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30 shrink-0">
              <Icons.GraduationCap className="w-6 h-6" />
            </div>
            {(!sidebarCollapsed || mobileDrawerOpen) && (
              <div className="animate-fadeIn">
                <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                  SMS Portal
                </h1>
                <p className="text-[11px] font-medium text-indigo-400">
                  University ERP
                </p>
              </div>
            )}
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                <IconComponent className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />

                {(!sidebarCollapsed || mobileDrawerOpen) && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {item.badge > 0 && (
                  <span
                    className={`shrink-0 text-[10px] font-bold rounded-full ${
                      sidebarCollapsed && !mobileDrawerOpen
                        ? 'absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-400 p-0 animate-ping'
                        : 'px-2 py-0.5 bg-amber-400 text-slate-950 animate-pulse'
                    }`}
                  >
                    {(!sidebarCollapsed || mobileDrawerOpen) && item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-1 shrink-0 bg-slate-900/60">
          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <Icons.ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-3 w-full px-1 text-xs text-slate-400">
                <Icons.ChevronLeft className="w-5 h-5" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>

          {/* Quick Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <Icons.LogOut className="w-5 h-5 shrink-0" />
            {(!sidebarCollapsed || mobileDrawerOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Icons.Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                {pageTitle}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Student Management System
              </p>
            </div>
          </div>

          {/* Right: Actions, ThemeToggle, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="View notifications"
              >
                <Icons.Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-3 z-50 animate-scaleUp">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {pendingCount} Pending
                    </span>
                  </div>
                  <div className="p-2 space-y-1">
                    {pendingCount > 0 ? (
                      <NavLink
                        to="/admin/registrations"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                          <Icons.FileText className="w-4 h-4" />
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {pendingCount} Registration Approvals
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            New students or faculty awaiting verification.
                          </p>
                        </div>
                      </NavLink>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    System Admin
                  </p>
                </div>
                <Icons.ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-scaleUp">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/80">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Signed in as
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/admin/dashboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Icons.Dashboard className="w-4 h-4 text-slate-400" />
                      <span>Dashboard Overview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/admin/students');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Icons.Students className="w-4 h-4 text-slate-400" />
                      <span>Manage Students</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700/80 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Icons.LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}