import React, { useState, useEffect, useRef } from 'react';
import { MoodLog } from '../../types';
import { PAST_WEEK_TREND } from '../../data/initialData';
import {
  Sparkles,
  Flame,
  Plus,
  Play,
  Pause,
  ChevronRight,
  Headphones,
  BookOpen,
  Volume2,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  CloudRain,
  Sun,
  Activity,
} from 'lucide-react';

interface MoodWellnessViewProps {
  onOpenWellnessModal: (resourceId: string) => void;
}

export const MoodWellnessView: React.FC<MoodWellnessViewProps> = ({
  onOpenWellnessModal,
}) => {
  // Check-in form state
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'low'>('good');
  const [energyLevel, setEnergyLevel] = useState(75);
  const [stressLevel, setStressLevel] = useState(30);
  const [journalText, setJournalText] = useState(
    "Felt calm and locked in during morning lecture. Heading into Quantum problem set with a clear plan."
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Box Breathing exercise state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold (In)' | 'Exhale' | 'Hold (Out)'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const breathingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isBreathingActive) {
      breathingIntervalRef.current = window.setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold (In)';
              if (currentPhase === 'Hold (In)') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Hold (Out)';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    }

    return () => {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    };
  }, [isBreathingActive]);

  const toggleBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
  };

  const handleSaveCheckIn = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Row matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Emotional Balance & Reflection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mood & Wellness Journal
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Reflection streak pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/80 border border-blue-100 rounded-full text-blue-900 text-xs font-bold">
            <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>4-Day Reflection Streak</span>
          </div>

          <button
            onClick={() => {
              setJournalText('');
              setSelectedMood('good');
            }}
            className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Log Entry</span>
          </button>
        </div>
      </div>

      {/* Main 2-column Grid matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): How Are You Feeling Right Now + Past Week Mood Trend */}
        <div className="lg:col-span-7 space-y-7">
          {/* Check-In Card matching screenshot */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    How are you feeling right now?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Thursday, October 24 • Afternoon Check-in
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Daily Log
              </span>
            </div>

            {/* 4 Mood options row matching screenshot */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'great', label: 'Great', emoji: '😄', bg: 'hover:bg-amber-50' },
                { id: 'good', label: 'Good', emoji: '🙂', bg: 'hover:bg-emerald-50' },
                { id: 'okay', label: 'Okay', emoji: '😐', bg: 'hover:bg-slate-50' },
                { id: 'low', label: 'Low', emoji: '🌧️', bg: 'hover:bg-blue-50' },
              ].map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id as any)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200 shadow-xs'
                        : `bg-[#F8F9FA] border-slate-200/80 ${m.bg} hover:border-slate-300`
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1.5">{m.emoji}</span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-emerald-900' : 'text-slate-600'
                      }`}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Energy Level Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Energy Level
                </span>
                <span className="text-slate-800">{energyLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 accent-[#2E6B4D] rounded-lg cursor-pointer"
              />
            </div>

            {/* Stress Level Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  Stress Level
                </span>
                <span className="text-rose-700">{stressLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 accent-[#9f1239] rounded-lg cursor-pointer"
              />
            </div>

            {/* Journal Reflection & Thoughts textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Journal Reflection & Thoughts
              </label>
              <textarea
                rows={4}
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="What's on your mind today? Note down any wins, triggers, or gratitude points..."
                className="w-full p-3.5 text-xs sm:text-sm bg-[#F8F9FA] border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-600 focus:outline-hidden transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveCheckIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2E6B4D] hover:bg-[#25573e] text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Check-in Saved Successfully!</span>
                </>
              ) : (
                <span>Save Today's Check-in</span>
              )}
            </button>
          </div>

          {/* Past Week Mood Trend Card matching screenshot */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Past Week Mood Trend</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Avg: Good (82%)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Consistent tracking helps identify emotional cycles
            </p>

            {/* Bar chart visualization */}
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4 border-b border-slate-100">
              {PAST_WEEK_TREND.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-600 mb-1">
                    {item.score}%
                  </span>

                  {/* Rounded pill bar */}
                  <div className="w-full max-w-[34px] bg-slate-100 rounded-full h-full flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-full transition-all duration-500"
                      style={{
                        height: `${item.score}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-bold ${
                      item.current ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Box Breathing + Curated Resources */}
        <div className="lg:col-span-5 space-y-7">
          {/* Box Breathing Card matching screenshot */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">Box Breathing</h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  3 Min Session
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Regulate your nervous system with guided rhythmic breathing.
              </p>
            </div>

            {/* Guided Breathing Circle Graphic */}
            <div className="relative flex items-center justify-center my-6 py-4">
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center transition-all duration-1000 ${
                  isBreathingActive && (breathPhase === 'Inhale' || breathPhase === 'Hold (In)')
                    ? 'scale-110 bg-emerald-100/70 ring-8 ring-emerald-50'
                    : 'scale-95 bg-emerald-50/50 ring-4 ring-emerald-50/40'
                }`}
              >
                <span className="text-sm font-bold text-emerald-950 mb-0.5">
                  {isBreathingActive ? breathPhase : 'Breathe In'}
                </span>
                <span className="text-3xl font-extrabold text-emerald-900 font-mono">
                  {isBreathingActive ? `${breathTimer}s` : '4s'}
                </span>
                <span className="text-[10px] text-emerald-700/80 uppercase font-semibold mt-1">
                  4-4-4-4 Cycle
                </span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={toggleBreathing}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all shadow-xs flex items-center justify-center gap-2 ${
                isBreathingActive
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#2E6B4D] hover:bg-[#25573e]'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Breathing Exercise</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Exercise</span>
                </>
              )}
            </button>
          </div>

          {/* Curated Resources Card matching screenshot */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Curated Resources</h3>
              <button
                onClick={() => onOpenWellnessModal('anxiety')}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div
                onClick={() => onOpenWellnessModal('anxiety')}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src="https://images.unsplash.com/photo-1511497584788-87676104235f?w=100&auto=format&fit=crop&q=80"
                    alt="Nature"
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      AUDIO GUIDE • 10 MIN
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900">
                      Overcoming Academic Anxiety
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      Dr. Elena Vance breaks down cognitive spirals
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
              </div>

              {/* Item 2 */}
              <div
                onClick={() => onOpenWellnessModal('grounding')}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=100&auto=format&fit=crop&q=80"
                    alt="Grounding"
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      ARTICLE • 5 MIN READ
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900">
                      Grounding Techniques for Exam Stress
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      Practical 5-4-3-2-1 sensory method
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
              </div>

              {/* Item 3 */}
              <div
                onClick={() => onOpenWellnessModal('playlist')}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&auto=format&fit=crop&q=80"
                    alt="Playlist"
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      PLAYLIST • 45 MIN
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900">
                      Deep Focus & Low-Fi Binaural Beats
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      Binaural beats engineered for cognitive flow
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
