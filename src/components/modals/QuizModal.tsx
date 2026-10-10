import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { QUIZ_SAMPLE } from '../../data/initialData';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  title = 'Neuroanatomy & Synaptic Transmission Quiz',
}) => {
  const [questions] = useState(QUIZ_SAMPLE);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      try {
        confetti({ particleCount: 70, spread: 70 });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            <p className="text-[11px] text-slate-500">Diagnostic Practice Module</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="font-semibold text-emerald-700">Score: {score}</span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h4 className="text-base font-bold text-slate-800 mb-4 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options list */}
            <div className="space-y-2.5 mb-5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct;

                let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                  } else {
                    btnStyle = 'border-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-5 animate-in fade-in duration-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  {selectedOption === currentQ.correct ? '✓ Correct!' : '✗ Explanation:'}
                </span>
                <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#2E6B4D] hover:bg-[#25573e] transition-colors shadow-xs"
              >
                {currentIdx + 1 < questions.length ? 'Next Question' : 'Complete Quiz'}
              </button>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">Quiz Completed!</h4>
            <p className="text-sm text-slate-500 mb-4">
              You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%).
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E6B4D] hover:bg-[#25573e] text-xs font-bold text-white shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
