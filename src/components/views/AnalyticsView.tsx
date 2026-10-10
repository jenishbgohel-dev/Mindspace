import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Target,
  Brain,
} from 'lucide-react';
import { Task } from '../../types';

interface AnalyticsViewProps {
  tasks: Task[];
}

// 7-day task completion trend data
const TASK_COMPLETION_DATA = [
  { day: 'Mon', completed: 3, assigned: 4, rate: 75, date: 'Oct 18' },
  { day: 'Tue', completed: 5, assigned: 5, rate: 100, date: 'Oct 19' },
  { day: 'Wed', completed: 4, assigned: 5, rate: 80, date: 'Oct 20' },
  { day: 'Thu', completed: 6, assigned: 6, rate: 100, date: 'Oct 21' },
  { day: 'Fri', completed: 3, assigned: 4, rate: 75, date: 'Oct 22' },
  { day: 'Sat', completed: 4, assigned: 4, rate: 100, date: 'Oct 23' },
  { day: 'Sun', completed: 3, assigned: 4, rate: 75, date: 'Oct 24' },
];

// 7-day study time distribution by category (in hours)
const STUDY_TIME_DATA = [
  { day: 'Mon', deepWork: 1.5, academics: 1.0, examPrep: 0.5, reading: 0.5, total: 3.5 },
  { day: 'Tue', deepWork: 2.0, academics: 1.2, examPrep: 0.8, reading: 0.5, total: 4.5 },
  { day: 'Wed', deepWork: 1.8, academics: 0.8, examPrep: 0.5, reading: 0.4, total: 3.5 },
  { day: 'Thu', deepWork: 2.2, academics: 1.5, examPrep: 0.8, reading: 0.5, total: 5.0 },
  { day: 'Fri', deepWork: 1.0, academics: 0.8, examPrep: 0.5, reading: 0.5, total: 2.8 },
  { day: 'Sat', deepWork: 1.5, academics: 0.5, examPrep: 0.8, reading: 0.6, total: 3.4 },
  { day: 'Sun', deepWork: 1.0, academics: 0.5, examPrep: 0.3, reading: 0.5, total: 2.3 },
];

// Subject breakdown over past 7 days
const SUBJECT_DISTRIBUTION_DATA = [
  { name: 'Computer Science', hours: 8.5, color: '#2E6B4D', percentage: 35 },
  { name: 'Organic Chemistry', hours: 6.8, color: '#3B82F6', percentage: 28 },
  { name: 'Cognitive Science', hours: 4.4, color: '#8B5CF6', percentage: 18 },
  { name: 'Macroeconomics', hours: 2.9, color: '#F59E0B', percentage: 12 },
  { name: 'Humanities & Lit', hours: 1.9, color: '#EC4899', percentage: 7 },
];

// Hourly focus rhythm curve
const HOURLY_FOCUS_RHYTHM = [
  { hour: '8 AM', intensity: 35 },
  { hour: '10 AM', intensity: 85 },
  { hour: '12 PM', intensity: 60 },
  { hour: '2 PM', intensity: 90 },
  { hour: '4 PM', intensity: 75 },
  { hour: '6 PM', intensity: 45 },
  { hour: '8 PM', intensity: 70 },
  { hour: '10 PM', intensity: 30 },
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | 'semester'>('7d');
  const [taskViewMode, setTaskViewMode] = useState<'daily' | 'cumulative'>('daily');

  const chartGridStroke = '#F1F5F9';
  const chartTickFill = '#64748B';
  const tooltipStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    fontSize: '12px',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              Performance Intelligence
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Updated 5m ago</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Analytics & Velocity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Visualize task completion dynamics, deep work distribution, and cognitive momentum across the last 7 days.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs self-start sm:self-auto">
          {(['7d', '14d', 'semester'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                timeRange === range
                  ? 'bg-[#2E6B4D] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {range === '7d' ? 'Past 7 Days' : range === '14d' ? 'Past 14 Days' : 'Semester'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Study Time */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Study Time</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">25.0 hrs</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3.2 hrs vs last week</span>
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Tasks Completed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">28 / 32</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 mt-1">
              <span>87.5% completion rate</span>
            </div>
          </div>
        </div>

        {/* Daily Focus Average */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Daily Average Focus</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">3.57 hrs</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-1">
              <span>Goal: 4.0 hrs/day (89%)</span>
            </div>
          </div>
        </div>

        {/* Cognitive Velocity */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Peak Focus Window</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">2 - 5 PM</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1">
              <span>Optimal retention phase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): Task Completion Trends */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Task Completion Trends
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Completed assignments and daily deliverables over the past 7 days.
                </p>
              </div>

              {/* View toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button
                  onClick={() => setTaskViewMode('daily')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    taskViewMode === 'daily'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTaskViewMode('cumulative')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    taskViewMode === 'cumulative'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Rate %
                </button>
              </div>
            </div>

            {/* Recharts BarChart / AreaChart */}
            <div className="w-full h-72 pt-3 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {taskViewMode === 'daily' ? (
                  <BarChart data={TASK_COMPLETION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: chartTickFill, fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: chartTickFill, fontSize: 11 }}
                      domain={[0, 7]}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(val: any, name: any) => [
                        `${val} tasks`,
                        name === 'completed' ? 'Completed Tasks' : 'Planned Tasks',
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
                    />
                    <Bar
                      dataKey="assigned"
                      name="Planned"
                      fill="#E2E8F0"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="completed"
                      name="Completed"
                      fill="#2E6B4D"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={TASK_COMPLETION_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E6B4D" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2E6B4D" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: chartTickFill, fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: chartTickFill, fontSize: 11 }}
                      unit="%"
                      domain={[50, 100]}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(val: unknown) => [`${val}%`, 'Daily Completion Velocity']}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#2E6B4D"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#rateGradient)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Peak Execution: Thursday (6 of 6 tasks cleared)</span>
            <span className="text-emerald-700 font-bold">Velocity: 4.0 tasks/day avg</span>
          </div>
        </div>

        {/* Right Column (5 cols): Study Time Distribution (Stacked Bar) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Study Time Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hours logged across deep work, academics & exam prep.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                25.0 hrs
              </span>
            </div>

            {/* Recharts Stacked BarChart */}
            <div className="w-full h-72 pt-3 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STUDY_TIME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartTickFill, fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartTickFill, fontSize: 11 }}
                    unit="h"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(val: any, name: any) => [
                      `${val} hrs`,
                      name === 'deepWork'
                        ? 'Deep Work'
                        : name === 'academics'
                        ? 'Lecture / Academics'
                        : name === 'examPrep'
                        ? 'Exam Prep'
                        : 'Reading',
                    ]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', paddingBottom: '12px' }}
                  />
                  <Bar dataKey="deepWork" name="Deep Work" stackId="a" fill="#2E6B4D" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="academics" name="Academics" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="examPrep" name="Exam Prep" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="reading" name="Reading" stackId="a" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Primary Focus: Deep Work (44% of total)</span>
            <span className="text-slate-800 font-bold">Peak Day: Thursday (5.0h)</span>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Row: Subject Allocation Donut + Cognitive Rhythm + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Subject Allocation Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                Subject Allocation (7 Days)
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">By Total Hours</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of coursework distribution across academic domains.
            </p>

            <div className="relative w-full h-56 flex items-center justify-center min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SUBJECT_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="hours"
                  >
                    {SUBJECT_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(val: unknown) => [`${val} hrs`, 'Study Time']}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900">24.5h</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Logged</span>
              </div>
            </div>

            {/* Legend breakdown list */}
            <div className="space-y-2 mt-2">
              {SUBJECT_DISTRIBUTION_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium truncate max-w-[140px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">{item.hours}h</span>
                    <span className="text-slate-800 font-bold w-9 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cognitive Focus Rhythm (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                Hourly Focus Rhythm
              </h3>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Diurnal Flow
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Relative cognitive focus intensity by hour of day.
            </p>

            <div className="w-full h-48 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_FOCUS_RHYTHM} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke} />
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartTickFill, fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartTickFill, fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(val: unknown) => [`${val}% Intensity`, 'Focus Level']}
                  />
                  <Area
                    type="monotone"
                    dataKey="intensity"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#focusGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Prime Window:</span>
              <span className="text-purple-800 font-bold">2:00 PM – 4:30 PM</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Secondary Peak:</span>
              <span>10:00 AM – 11:30 AM</span>
            </div>
          </div>
        </div>

        {/* MindSpace Academic Insights (3 cols) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-emerald-50/80 via-[#F3F8F5] to-teal-50/60 rounded-3xl p-6 sm:p-7 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#2E6B4D] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-emerald-950 text-sm">
                Velocity Insights
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100/80 shadow-2xs">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Exam Prep Velocity
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Organic Chemistry study blocks increased by <strong className="text-emerald-800">+40%</strong> ahead of Friday's comprehensive lab.
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100/80 shadow-2xs">
                <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Algorithm Mastery
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Completed 8.5 hours of Data Structures practice. LeetCode milestone tracking is on schedule.
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100/80 shadow-2xs">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Balance Recommendation
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Macroeconomics reading is slightly trailing at 2.9 hours. Recommend allocating two 25m Pomodoros tomorrow.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/50 text-center">
            <span className="text-[10px] text-emerald-800/80 font-semibold uppercase tracking-wider">
              Calculated over 7 active study sessions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
