import React, { useState } from 'react';
import { Goal, StrategicObjective, InspirationQuote } from '../../types';
import { INSPIRATION_QUOTES } from '../../data/initialData';
import {
  Flag,
  Plus,
  Shuffle,
  Check,
  Circle,
  Calendar,
  Sparkles,
  TrendingUp,
  Compass,
} from 'lucide-react';

interface GoalTrackerViewProps {
  goals: Goal[];
  strategicObjectives: StrategicObjective[];
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onOpenAddGoal: () => void;
}

export const GoalTrackerView: React.FC<GoalTrackerViewProps> = ({
  goals,
  strategicObjectives,
  onToggleMilestone,
  onOpenAddGoal,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stratFilter, setStratFilter] = useState<'All' | 'Research' | 'Career'>('All');

  const currentQuote = INSPIRATION_QUOTES[quoteIndex % INSPIRATION_QUOTES.length];

  const handleShuffleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRATION_QUOTES.length);
  };

  // Calculate overall semester velocity
  const allMilestones = goals.flatMap((g) => g.milestones);
  const totalMilestones = allMilestones.length || 25;
  const completedMilestones = allMilestones.filter((m) => m.completed).length;
  const semesterVelocityPercent = Math.round((completedMilestones / totalMilestones) * 100) || 72;

  // Filter strategic vision cards
  const filteredStrat = strategicObjectives.filter((obj) => {
    if (stratFilter === 'All') return true;
    if (stratFilter === 'Research') return obj.category === 'Research';
    if (stratFilter === 'Career') return obj.category === 'Internship' || obj.category === 'Career';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Row matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              Academic Horizon
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Updated 10m ago</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Goal Setting & Milestone Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Transform your grand academic aspirations into disciplined daily execution. Track milestones, monitor semester velocity, and sustain your drive.
          </p>
        </div>

        {/* Semester Velocity circular indicator matching screenshot */}
        <div className="flex items-center gap-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 p-3.5 px-5 rounded-3xl self-start sm:self-auto shrink-0">
          {/* Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-blue-100 dark:text-blue-900/60"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 dark:text-blue-400"
                strokeDasharray={`${semesterVelocityPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-blue-900 dark:text-blue-300">
              {semesterVelocityPercent}%
            </span>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Semester Velocity</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {completedMilestones} of {totalMilestones} milestones completed
            </div>
          </div>
        </div>
      </div>

      {/* Top 2 Cards: Daily Inspiration (Forest Green) + Pace Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Inspiration Card */}
        <div className="lg:col-span-7 bg-[#23583F] dark:bg-emerald-950/80 dark:border dark:border-emerald-900/50 rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-xs relative overflow-hidden">
          {/* Background decorative subtle arc */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-serif text-emerald-300 font-black">”</span>
              <span className="text-[11px] font-bold tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                Daily Inspiration
              </span>
            </div>

            <p className="text-base sm:text-lg font-medium text-emerald-50 leading-relaxed font-serif italic mb-4">
              “{currentQuote.quote}”
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-200/90 font-medium tracking-wide">
              — {currentQuote.author}
            </span>

            <button
              onClick={handleShuffleQuote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-all backdrop-blur-xs"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Quote</span>
            </button>
          </div>
        </div>

        {/* Pace Indicator Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Pace Indicator</h3>
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              You are tracking <span className="text-emerald-700 dark:text-emerald-400 font-bold">4 days ahead</span> of average deadlines.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Core Objectives</span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">4/5 Active</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">Weekly Micro-Tasks</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">12/15 Done</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Active Semester Goals */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Active Semester Goals</h2>
          <button
            onClick={onOpenAddGoal}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Goal</span>
          </button>
        </div>

        {/* 2 Semester Goal Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const completedCount = goal.milestones.filter((m) => m.completed).length;
            const totalCount = goal.milestones.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            const isStem = goal.categoryTag.includes('STEM');
            const tagBg = isStem ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300';
            const iconBg = isStem ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300';
            const barColor = isStem ? 'bg-[#2E6B4D]' : 'bg-indigo-600';

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                        <Flag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
                          {goal.categoryTag}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {goal.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl shrink-0 ${tagBg}`}>
                      {progress}% Done
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Milestones list with interactive completion checkboxes */}
                  <div className="space-y-2 mb-6">
                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => onToggleMilestone(goal.id, m.id)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800'
                            : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <button
                            type="button"
                            className="shrink-0 focus:outline-hidden"
                            aria-label={m.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {m.completed ? (
                              <div className="w-4 h-4 rounded-full bg-[#2E6B4D] flex items-center justify-center text-white">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-600 transition-colors" />
                            )}
                          </button>
                          <span
                            className={`truncate ${
                              m.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100 font-medium'
                            }`}
                          >
                            {m.title}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                            m.completed
                              ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800'
                              : m.dueDate
                              ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 font-bold'
                              : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 font-bold'
                          }`}
                        >
                          {m.completed ? 'Done' : m.dueDate || 'Ongoing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Progress Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>Milestone Progress</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {completedCount} of {totalCount} Completed
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Vision Section matching screenshot */}
      <div className="bg-slate-100/60 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Strategic Vision
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Long-Term Academic Objectives (2024 – 2026)
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 mr-1 text-[11px] font-semibold">Filter by:</span>
            {(['All', 'Research', 'Career'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setStratFilter(tag)}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  stratFilter === tag
                    ? 'bg-[#2E6B4D] text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Strategic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredStrat.map((obj) => (
            <div
              key={obj.id}
              className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-750 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      obj.category === 'Research'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : obj.category === 'Internship'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {obj.category}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{obj.progress}%</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5 leading-snug">
                  {obj.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {obj.description}
                </p>
              </div>

              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    obj.category === 'Research'
                      ? 'bg-emerald-700'
                      : obj.category === 'Internship'
                      ? 'bg-indigo-600'
                      : 'bg-emerald-800'
                  }`}
                  style={{ width: `${obj.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
