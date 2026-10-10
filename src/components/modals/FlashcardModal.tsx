import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCw, CheckCircle2, RotateCcw } from 'lucide-react';
import { FLASHCARDS_SAMPLE } from '../../data/initialData';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  title = 'Cognitive Biases & Heuristics Deck',
}) => {
  const [cards] = useState(FLASHCARDS_SAMPLE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  if (!isOpen) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleMarkMastered = () => {
    setMasteredCount((prev) => prev + 1);
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            <p className="text-[11px] text-slate-500">Active Recall & Spaced Repetition</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="text-emerald-700 font-semibold">{masteredCount} Mastered</span>
        </div>
        <div className="mx-6 mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>

        {/* Flashcard Body */}
        <div className="p-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[220px] rounded-2xl p-6 border-2 border-emerald-100 bg-[#FAFDFB] hover:border-emerald-300 cursor-pointer shadow-xs transition-all duration-200 flex flex-col justify-between items-center text-center select-none"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {currentCard.context}
            </span>

            <div className="my-auto py-4">
              {!isFlipped ? (
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{currentCard.front}</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <RotateCw className="w-3 h-3" /> Click to reveal definition
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-200">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {currentCard.back}
                  </p>
                  <p className="text-xs text-emerald-600 mt-3 font-semibold">
                    ✓ Definition Revealed
                  </p>
                </div>
              )}
            </div>

            <span className="text-[11px] text-slate-400">
              {isFlipped ? 'Click to flip back' : 'Tap anywhere to flip'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Previous Card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
            >
              <RotateCw className="w-4 h-4 text-slate-400" />
              Flip
            </button>

            <button
              onClick={handleMarkMastered}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Got It
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Next Card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
