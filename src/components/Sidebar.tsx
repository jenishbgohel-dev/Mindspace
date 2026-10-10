import React from 'react';
import { ViewType } from '../types';
import { BrandLogo } from './common/BrandLogo';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  Flag,
  Sparkles,
  BookOpen,
  BarChart3,
  Volume2,
  X,
  LogOut,
  LogIn,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isAudioPlaying?: boolean;
  onOpenAmbientControl?: () => void;
  onOpenLogoutConfirm: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  isAudioPlaying = false,
  onOpenAmbientControl,
  onOpenLogoutConfirm,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Task & Study Planner', icon: CalendarCheck2 },
    { id: 'goals', label: 'Goal Setting & Milestones', icon: Flag },
    { id: 'wellness', label: 'Mood & Wellness', icon: Sparkles },
    { id: 'resources', label: 'Educational Resources', icon: BookOpen },
    { id: 'analytics', label: 'Study Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (view: ViewType) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 md:w-68 shrink-0 bg-[#F4F7F5] md:bg-[#F3F6F4] border-r border-[#E2E8E4] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto">
          {/* Top Header / Logo */}
          <div className="flex items-center justify-between mb-8 pl-1">
            <BrandLogo size="md" />
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-700 md:hidden rounded-lg hover:bg-slate-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#2E6B4D] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#E8EEE9]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-[#64748B]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Ambient Controls + Auth Status */}
        <div className="p-3 space-y-2 border-t border-slate-200/70">
          {/* Ambient Sound status */}
          <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Focus Soundscape
              </span>
              {isAudioPlaying ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Playing
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Idle</span>
              )}
            </div>
            <button
              onClick={onOpenAmbientControl}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                isAudioPlaying
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAudioPlaying ? 'Tune Sounds' : 'Ambient Audio'}</span>
            </button>
          </div>

          {/* User profile / Log In & Log Out bar in Sidebar */}
          {isAuthenticated && currentUser ? (
            <div className="p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold truncate">
                    {currentUser.streakCount}d Streak
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenLogoutConfirm}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs font-bold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In to MindSpace</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
