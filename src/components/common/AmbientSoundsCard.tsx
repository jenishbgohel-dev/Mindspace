import React, { useState } from 'react';
import { Headphones, CloudRain, Trees, Coffee, Waves, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface SoundState {
  id: 'rain' | 'forest' | 'coffee' | 'ocean';
  name: string;
  active: boolean;
  volume: number;
  icon: React.ElementType;
  bgLight: string;
  textColor: string;
}

export const AmbientSoundsCard: React.FC = () => {
  const [sounds, setSounds] = useState<SoundState[]>([
    {
      id: 'rain',
      name: 'Gentle Rain',
      active: false,
      volume: 65,
      icon: CloudRain,
      bgLight: 'bg-blue-100/70',
      textColor: 'text-blue-600',
    },
    {
      id: 'forest',
      name: 'Pine Forest',
      active: false,
      volume: 60,
      icon: Trees,
      bgLight: 'bg-emerald-100/70',
      textColor: 'text-emerald-700',
    },
    {
      id: 'coffee',
      name: 'Coffee Shop',
      active: false,
      volume: 50,
      icon: Coffee,
      bgLight: 'bg-amber-100/70',
      textColor: 'text-amber-700',
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      active: false,
      volume: 55,
      icon: Waves,
      bgLight: 'bg-indigo-100/70',
      textColor: 'text-indigo-600',
    },
  ]);

  const toggleSound = (id: 'rain' | 'forest' | 'coffee' | 'ocean') => {
    setSounds((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newActive = !s.active;
          soundEngine.toggleAmbient(id, newActive, s.volume / 100);
          return { ...s, active: newActive };
        }
        return s;
      })
    );
  };

  const handleVolumeChange = (id: 'rain' | 'forest' | 'coffee' | 'ocean', newVolume: number) => {
    setSounds((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          soundEngine.setVolume(id, newVolume / 100);
          return { ...s, volume: newVolume };
        }
        return s;
      })
    );
  };

  const stopAll = () => {
    soundEngine.stopAll();
    setSounds((prev) => prev.map((s) => ({ ...s, active: false })));
  };

  const hasAnyActive = sounds.some((s) => s.active);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Ambient Sounds</h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            HQ Audio
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Block distractions with immersive soundscapes tailored for cognitive flow.
        </p>
      </div>

      {/* 2x2 Sound Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {sounds.map((sound) => {
          const Icon = sound.icon;
          return (
            <div
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                sound.active
                  ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-200 shadow-xs'
                  : 'bg-[#F8F9FA] hover:bg-[#F1F5F3] border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${sound.bgLight} ${sound.textColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    sound.active
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 bg-slate-100'
                  }`}
                >
                  {sound.active ? 'On' : 'Off'}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-bold text-slate-800">{sound.name}</div>
                {sound.active ? (
                  <div
                    className="mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3 h-3 text-slate-400" />
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={sound.volume}
                        onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 accent-emerald-600 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 mt-0.5">Off</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stop all button if playing */}
      {hasAnyActive && (
        <button
          onClick={stopAll}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
        >
          <VolumeX className="w-3.5 h-3.5" />
          Mute All Ambient Sounds
        </button>
      )}
    </div>
  );
};
