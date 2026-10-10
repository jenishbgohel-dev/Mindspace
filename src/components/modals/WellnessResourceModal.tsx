import React, { useState } from 'react';
import { X, Play, Pause, Headphones, Volume2, Sparkles, BookOpen } from 'lucide-react';

interface WellnessResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string | null;
}

export const WellnessResourceModal: React.FC<WellnessResourceModalProps> = ({
  isOpen,
  onClose,
  resourceId,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !resourceId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">MindSpace Wellness Library</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content depending on resource clicked */}
        {resourceId === 'anxiety' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" /> AUDIO GUIDE • 10 MIN
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Overcoming Academic Anxiety
            </h2>
            <p className="text-xs text-slate-500">
              By Dr. Elena Vance • Clinical Cognitive Psychologist
            </p>

            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-4">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-12 h-12 rounded-full bg-[#2E6B4D] text-white flex items-center justify-center hover:bg-[#25573e] transition-colors shadow-xs shrink-0"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{isPlayingAudio ? 'Playing session audio...' : 'Ready to listen'}</span>
                  <span>10:00</span>
                </div>
                <div className="h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-emerald-600 rounded-full ${
                      isPlayingAudio ? 'w-2/5 animate-pulse' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2 pt-2">
              <p className="font-semibold text-slate-800">Guide Outline:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Decoupling self-worth from exam outcomes and GPA metrics.</li>
                <li>Identifying somatic tension triggers during timed examinations.</li>
                <li>Immediate cognitive reframing protocols for pre-exam panic.</li>
              </ul>
            </div>
          </div>
        )}

        {resourceId === 'grounding' && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> ARTICLE • 5 MIN READ
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Grounding Techniques for Exam Stress
            </h2>
            <p className="text-xs text-slate-500">The 5-4-3-2-1 Sensory Reset Protocol</p>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="font-bold text-emerald-800">5 Things You Can See:</span> Look around your desk: notice your pen grip, paper texture, lighting shadow, textbook binding, or windowsill.
              </div>
              <div>
                <span className="font-bold text-emerald-800">4 Things You Can Feel:</span> Feel your feet flat on the floor, your back pressed into the chair, the cool desk surface, and fabric of your sweater.
              </div>
              <div>
                <span className="font-bold text-emerald-800">3 Things You Can Hear:</span> Tune into ambient clock ticks, faint ventilation air currents, or birds outside.
              </div>
              <div>
                <span className="font-bold text-emerald-800">2 Things You Can Smell:</span> Fresh pencil shavings or coffee aroma nearby.
              </div>
              <div>
                <span className="font-bold text-emerald-800">1 Thing You Can Taste:</span> Sip cool water and anchor in the present moment.
              </div>
            </div>
          </div>
        )}

        {resourceId === 'playlist' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" /> PLAYLIST • 45 MIN
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Deep Focus & Low-Fi Binaural Beats
            </h2>
            <p className="text-xs text-slate-500">Binaural beats engineered for deep focus & alpha waves</p>

            <div className="space-y-2">
              {[
                { title: 'Alpha Wave Awakening (10Hz)', duration: '12:30', active: true },
                { title: 'Library Midnight Murmur', duration: '15:10', active: false },
                { title: 'Gentle Synapse Flow', duration: '17:20', active: false },
              ].map((track, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400 font-mono text-[10px]">0{i + 1}</span>
                    <span className="font-semibold text-slate-800">{track.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
