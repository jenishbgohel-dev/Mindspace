import React, { useState } from 'react';
import { Task } from '../../types';
import { FocusTimerCard } from '../common/FocusTimerCard';
import { AmbientSoundsCard } from '../common/AmbientSoundsCard';
import {
  Plus,
  Sparkles,
  Calendar,
  Check,
  MoreVertical,
  Clock,
  CheckCircle2,
  Filter,
  Play,
  Trash2,
} from 'lucide-react';

interface TaskPlannerViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTask: () => void;
}

export const TaskPlannerView: React.FC<TaskPlannerViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenAddTask,
}) => {
  const [filterTab, setFilterTab] = useState<'All' | 'Due Today' | 'Upcoming' | 'Completed'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | undefined>('Quantum Mechanics Problem Set #4');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter tasks based on selected tab and category
  const filteredTasks = tasks.filter((t) => {
    if (filterTab === 'Completed') {
      if (!t.completed) return false;
    } else if (filterTab === 'Due Today') {
      if (t.completed || !t.dueDate.toLowerCase().includes('today')) return false;
    } else if (filterTab === 'Upcoming') {
      if (t.completed || t.dueDate.toLowerCase().includes('today')) return false;
    }

    if (categoryFilter !== 'All' && t.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const handleStartTaskTimer = (task: Task) => {
    setActiveTaskTitle(task.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Section: Focus Session + Ambient Sounds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <div className="lg:col-span-6">
          <FocusTimerCard
            variant="planner"
            activeTaskTitle={activeTaskTitle}
          />
        </div>
        <div className="lg:col-span-6">
          <AmbientSoundsCard />
        </div>
      </div>

      {/* Bottom Section: Task Pipeline + Study Momentum & AI Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): Study & Task Pipeline */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            {/* Header with Title and Add New Task button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Study & Task Pipeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage your assignments, exam preparations, and core readings.
                </p>
              </div>

              <button
                onClick={onOpenAddTask}
                className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Task</span>
              </button>
            </div>

            {/* Filter Tabs & Category Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {(['All', 'Due Today', 'Upcoming', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                      filterTab === tab
                        ? 'bg-[#2E6B4D] text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-750'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Category selector */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="All">All Categories</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Exam">Exam Prep</option>
                  <option value="Reading">Reading</option>
                  <option value="Academics">Academics</option>
                  <option value="Deep Work">Deep Work</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>
            </div>

            {/* Task List matching screenshot */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                  No tasks found under this filter.
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isMenuOpen = openMenuId === task.id;
                  return (
                    <div
                      key={task.id}
                      className={`relative group flex items-start sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                        task.completed
                          ? 'bg-slate-50/70 dark:bg-slate-850/40 border-slate-100 dark:border-slate-800 opacity-65'
                          : 'bg-white dark:bg-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 border-slate-200/90 dark:border-slate-750 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        {/* Checkbox button */}
                        <button
                          type="button"
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 sm:mt-0 shrink-0 focus:outline-hidden"
                          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {task.completed ? (
                            <div className="w-5 h-5 rounded-md bg-[#2E6B4D] flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-600 transition-colors" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1 pr-2">
                          <p
                            className={`text-xs sm:text-sm font-bold truncate ${
                              task.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                task.category === 'Assignment'
                                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                  : task.category === 'Exam'
                                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                  : task.category === 'Reading'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {task.category}
                            </span>

                            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                              {task.dueDate} {task.dueTime ? `• ${task.dueTime}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.priority === 'High'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Action menu toggle */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : task.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 text-xs animate-in fade-in duration-150">
                                <button
                                  onClick={() => {
                                    handleStartTaskTimer(task);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                                >
                                  <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>Focus on Task</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onToggleTask(task.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                                >
                                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                  <span>{task.completed ? 'Mark Pending' : 'Mark Completed'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onDeleteTask(task.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium border-t border-slate-100 dark:border-slate-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Task</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Study Momentum & MindSpace AI Tip */}
        <div className="lg:col-span-5 space-y-7">
          {/* Study Momentum Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Study Momentum</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Hours Focused</div>
                <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-400">18.5 hrs</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Tasks Done</div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">24 / 29</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                <span>Weekly Target (25h)</span>
                <span>74%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2E6B4D] rounded-full" style={{ width: '74%' }} />
              </div>
            </div>
          </div>

          {/* MindSpace AI Tip Card matching screenshot */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/20 rounded-3xl p-6 border border-emerald-100/90 dark:border-emerald-900/40 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">MindSpace AI Tip</h3>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "You have a Quantum Mechanics assignment due tonight. We recommend breaking it into two 25-minute Pomodoro blocks with a 5-minute break in between to maximize retention."
            </p>

            <button
              onClick={() => {
                setActiveTaskTitle('Quantum Mechanics Problem Set #4');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50/80 dark:hover:bg-slate-750 border border-emerald-200/90 dark:border-slate-700 text-emerald-900 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs"
            >
              Start Recommended Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
