import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';

interface FocusTimerCardProps {
  variant?: 'dashboard' | 'planner';
  activeTaskTitle?: string;
  onSessionComplete?: () => void;
}

type TimerMode = 'pomo' | 'break' | 'long';

export const FocusTimerCard: React.FC<FocusTimerCardProps> = ({
  variant = 'dashboard',
  activeTaskTitle,
  onSessionComplete,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomo');
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(4);

  // Default times in seconds
  const modeTimes: Record<TimerMode, number> = {
    pomo: 25 * 60,
    break: 5 * 60,
    long: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState(modeTimes.pomo);
  const timerRef = useRef<number | null>(null);

  const totalTime = modeTimes[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    soundEngine.playCompletionChime();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    if (mode === 'pomo') {
      setCompletedSessions((prev) => prev + 1);
      if (onSessionComplete) onSessionComplete();
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeTimes[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular gauge math
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between mb-5 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 text-base">
            {variant === 'planner' ? 'Focus Session' : 'Focus Timer'}
          </span>
        </div>

        {/* Tab switcher matching screenshot */}
        <div className="flex items-center p-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
          <button
            onClick={() => switchMode('pomo')}
            className={`px-3 py-1 rounded-full transition-all ${
              mode === 'pomo' ? 'bg-[#2E6B4D] text-white shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            {variant === 'planner' ? 'Pomodoro' : 'Pomo'}
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-3 py-1 rounded-full transition-all ${
              mode === 'break' ? 'bg-[#2E6B4D] text-white shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            {variant === 'planner' ? 'Short Break' : 'Break'}
          </button>
          <button
            onClick={() => switchMode('long')}
            className={`px-3 py-1 rounded-full transition-all ${
              mode === 'long' ? 'bg-[#2E6B4D] text-white shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            {variant === 'planner' ? 'Long Break' : 'Long'}
          </button>
        </div>
      </div>

      {/* Active task badge if provided */}
      {activeTaskTitle && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-[11px] text-emerald-800 font-medium truncate">
          Target: <span className="font-semibold">{activeTaskTitle}</span>
        </div>
      )}

      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center my-4 py-2">
        <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="9"
            fill="transparent"
            className="text-slate-200"
          />
          {/* Animated active progress arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#2E6B4D"
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Center Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-800 font-mono">
            {timeFormatted}
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-0.5">
            {isRunning ? 'IN PROGRESS' : variant === 'planner' ? 'DEEP WORK' : 'READY TO FOCUS'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={toggleTimer}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-sm text-white shadow-xs transition-all ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-[#2E6B4D] hover:bg-[#25573e]'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{variant === 'planner' ? 'Start Focus' : 'Start Focus Session'}</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          title="Reset Timer"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Footer info: completed sessions & streak */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
        <span>{completedSessions} sessions completed today · Streak: 3 days</span>
      </div>
    </div>
  );
};
