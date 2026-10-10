import React, { useState } from 'react';
import { Task, ViewType } from '../../types';
import { FocusTimerCard } from '../common/FocusTimerCard';
import { DailyMotivation } from '../common/DailyMotivation';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  CheckCircle2,
  Plus,
  ArrowRight,
  MoreVertical,
  Droplets,
  BookOpen,
  Brain,
  Check,
  LogIn,
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onNavigate: (view: ViewType) => void;
  streakCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  onToggleTask,
  onOpenAddTask,
  onNavigate,
  streakCount,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [selectedMood, setSelectedMood] = useState<'drained' | 'neutral' | 'calm' | 'focused' | 'energized' | null>('calm');
  const [hydrationCups, setHydrationCups] = useState(6);
  const [moodSavedToast, setMoodSavedToast] = useState(false);

  // Filter tasks for Today's Focus list
  const focusTasks = tasks.slice(0, 4);

  const moodOptions = [
    { id: 'drained', label: 'Drained', emoji: '🌧️', bg: 'hover:bg-blue-50' },
    { id: 'neutral', label: 'Neutral', emoji: '⛅', bg: 'hover:bg-amber-50' },
    { id: 'calm', label: 'Calm', emoji: '🌿', bg: 'hover:bg-emerald-50' },
    { id: 'focused', label: 'Focused', emoji: '⚡', bg: 'hover:bg-yellow-50' },
    { id: 'energized', label: 'Energized', emoji: '☀️', bg: 'hover:bg-orange-50' },
  ];

  const handleSelectMood = (moodId: 'drained' | 'neutral' | 'calm' | 'focused' | 'energized') => {
    setSelectedMood(moodId);
    setMoodSavedToast(true);
    setTimeout(() => setMoodSavedToast(false), 2500);
  };

  const handleHydration = (delta: number) => {
    setHydrationCups((prev) => Math.min(12, Math.max(0, prev + delta)));
  };

  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'Guest Scholar';
  const activeStreak = currentUser ? currentUser.streakCount : streakCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              Daily Overview
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Thursday, October 24</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {displayName}. <span className="text-2xl">🌱</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAuthenticated
              ? "You've completed 4 of 7 daily habits. Keep the momentum going gently."
              : 'Sign in to sync your study streak, personalized goals, and research notes.'}
          </p>
        </div>

        {/* 5 Day Streak Badge Card or Sign In Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3.5 bg-emerald-50/70 border border-emerald-100 p-3.5 px-5 rounded-2xl self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-emerald-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{activeStreak} Day Streak</div>
              <div className="text-[11px] text-slate-500 font-medium">Personal Best: 12 Days</div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-2.5 bg-[#2E6B4D] hover:bg-[#25573e] text-white p-3.5 px-5 rounded-2xl self-start sm:self-auto text-xs font-bold transition-all shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to MindSpace</span>
          </button>
        )}
      </div>

      {/* Daily Motivation Inspirational Quote */}
      <DailyMotivation />

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): Today's Focus Tasks + Mood Check-in */}
        <div className="lg:col-span-7 space-y-7">
          {/* Today's Focus Tasks Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Today's Focus Tasks</h2>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task list items */}
            <div className="space-y-2.5">
              {focusTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50/70 border-slate-100 opacity-75'
                      : 'bg-white hover:bg-slate-50/60 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      type="button"
                      className="shrink-0 focus:outline-hidden"
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.completed ? (
                        <div className="w-5 h-5 rounded-full bg-[#2E6B4D] flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-emerald-600 transition-colors" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 group-hover:text-emerald-950'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.category === 'Academics'
                              ? 'bg-emerald-50 text-emerald-700'
                              : task.category === 'Deep Work'
                              ? 'bg-indigo-50 text-indigo-700'
                              : task.category === 'Wellness'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {task.category}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {task.dueTime || task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-1 text-slate-300 group-hover:text-slate-500">
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add task button */}
            <button
              onClick={onOpenAddTask}
              className="w-full mt-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-dashed border-slate-200 hover:border-slate-300 transition-all"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>Add New Task</span>
            </button>
          </div>

          {/* Daily Mood Check-In Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  How are you feeling right now?
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Daily Check-in
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Select the emoji that best captures your current mental energy and mood.
            </p>

            {/* 5 Emojis row */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {moodOptions.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleSelectMood(mood.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200 shadow-xs scale-102'
                        : `bg-[#F8F9FA] border-slate-200/80 ${mood.bg} hover:border-slate-300`
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{mood.emoji}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-emerald-900' : 'text-slate-600'
                      }`}
                    >
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {moodSavedToast && (
              <div className="mt-3 p-2 text-center text-xs text-emerald-800 font-semibold bg-emerald-50 rounded-xl animate-in fade-in duration-200">
                ✓ Check-in recorded! Logged into your Mood & Wellness Journal.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Focus Timer + Daily Goals */}
        <div className="lg:col-span-5 space-y-7">
          {/* Focus Timer */}
          <FocusTimerCard variant="dashboard" />

          {/* Daily Goals Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Daily Goals</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">78% Complete</span>
            </div>

            <div className="space-y-4">
              {/* Goal 1: Study & Deep Work */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Study & Deep Work</span>
                  </div>
                  <span className="text-slate-600 font-mono text-[11px]">3.5 / 4 hrs</span>
                </div>
                <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2E6B4D] rounded-full" style={{ width: '87.5%' }} />
                </div>
              </div>

              {/* Goal 2: Mindfulness & Wellness */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mindfulness & Wellness</span>
                  </div>
                  <span className="text-slate-600 font-mono text-[11px]">20 / 30 mins</span>
                </div>
                <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '66.7%' }} />
                </div>
              </div>

              {/* Goal 3: Hydration Target */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-amber-800" />
                    <span>Hydration Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleHydration(-1)}
                      className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="text-slate-600 font-mono text-[11px]">{hydrationCups} / 8 cups</span>
                    <button
                      onClick={() => handleHydration(1)}
                      className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#831843] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (hydrationCups / 8) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
