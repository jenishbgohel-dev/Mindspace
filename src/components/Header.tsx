import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  Flame,
  BookOpen,
  BarChart3,
  Clock,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ViewType } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onNavigate: (view: ViewType) => void;
  onSearchQuery?: (q: string) => void;
  onOpenLogoutConfirm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onNavigate,
  onSearchQuery,
  onOpenLogoutConfirm,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Quantum Mechanics Problem Set #4',
      desc: 'Due tonight at 11:59 PM. Review equations.',
      time: '1h ago',
      read: false,
      view: 'planner' as ViewType,
    },
    {
      id: 2,
      title: 'Daily Reflection Streak',
      desc: 'You hit a reflection streak! Keep it going.',
      time: '3h ago',
      read: false,
      view: 'wellness' as ViewType,
    },
    {
      id: 3,
      title: 'New Study Deck Added',
      desc: 'Cognitive Biases & Heuristics is trending in Psychology.',
      time: 'Yesterday',
      read: true,
      view: 'resources' as ViewType,
    },
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchQuery) onSearchQuery(val);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#F8F9FA]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Search input */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search tasks, goals, resources..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#EEF2F0] hover:bg-[#E7ECE9] focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-emerald-500 focus:outline-hidden transition-all duration-150"
            />
          </div>
        </div>

        {/* Right: Notifications & User Auth / Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">
                      Notifications ({unreadCount} new)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.view);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !item.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Auth Section */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                />
                <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile & Account Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                    {/* User info */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {currentUser.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                        <p className="text-[11px] text-emerald-800 font-medium truncate mt-0.5">
                          {currentUser.major}
                        </p>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-2 my-3 py-2 bg-slate-50 rounded-xl px-3">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {currentUser.streakCount} Days
                          </div>
                          <div className="text-[10px] text-slate-400">Streak</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-800">18.5 hrs</div>
                          <div className="text-[10px] text-slate-400">Weekly Focus</div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation shortcuts */}
                    <div className="space-y-1 text-xs font-medium text-slate-700 border-t border-slate-100 pt-2">
                      <button
                        onClick={() => {
                          onNavigate('planner');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
                      >
                        <span>Study Planner</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('goals');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
                      >
                        <span>Semester Goals</span>
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('analytics');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
                      >
                        <span>Study Analytics</span>
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                    {/* Logout button */}
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenLogoutConfirm();
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-normal">End session</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged out state */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#2E6B4D] hover:bg-[#25573e] transition-colors shadow-2xs"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
