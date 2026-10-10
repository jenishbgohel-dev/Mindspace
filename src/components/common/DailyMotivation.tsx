import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, RefreshCw, Bookmark, Share2, Check } from 'lucide-react';
import { MOTIVATION_QUOTES, MotivationQuote } from '../../data/motivationQuotes';

interface DailyMotivationProps {
  className?: string;
}

export const DailyMotivation: React.FC<DailyMotivationProps> = ({ className = '' }) => {
  // Compute deterministic index based on day of year so each calendar day gets a consistent quote
  const getDayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % MOTIVATION_QUOTES.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem('mindspace_quote_custom_idx');
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < MOTIVATION_QUOTES.length) {
        return idx;
      }
    }
    return getDayIndex();
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(() => {
    const favs = localStorage.getItem('mindspace_quote_favs');
    if (favs) {
      try {
        const parsed = JSON.parse(favs);
        return Array.isArray(parsed) && parsed.includes(MOTIVATION_QUOTES[currentIndex]?.id);
      } catch {
        return false;
      }
    }
    return false;
  });

  const quote: MotivationQuote = MOTIVATION_QUOTES[currentIndex] || MOTIVATION_QUOTES[0];

  useEffect(() => {
    // Check favorited status when currentIndex changes
    const favs = localStorage.getItem('mindspace_quote_favs');
    if (favs) {
      try {
        const parsed = JSON.parse(favs);
        setIsFavorited(Array.isArray(parsed) && parsed.includes(quote.id));
      } catch {
        setIsFavorited(false);
      }
    } else {
      setIsFavorited(false);
    }
  }, [currentIndex, quote.id]);

  const handleNextQuote = () => {
    const nextIdx = (currentIndex + 1) % MOTIVATION_QUOTES.length;
    setCurrentIndex(nextIdx);
    localStorage.setItem('mindspace_quote_custom_idx', String(nextIdx));
  };

  const handleResetToToday = () => {
    const todayIdx = getDayIndex();
    setCurrentIndex(todayIdx);
    localStorage.removeItem('mindspace_quote_custom_idx');
  };

  const handleCopyQuote = async () => {
    const text = `"${quote.quote}" — ${quote.author}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    const favsStr = localStorage.getItem('mindspace_quote_favs');
    let favs: string[] = [];
    if (favsStr) {
      try {
        favs = JSON.parse(favsStr);
        if (!Array.isArray(favs)) favs = [];
      } catch {
        favs = [];
      }
    }

    if (isFavorited) {
      favs = favs.filter((id) => id !== quote.id);
      setIsFavorited(false);
    } else {
      favs.push(quote.id);
      setIsFavorited(true);
    }
    localStorage.setItem('mindspace_quote_favs', JSON.stringify(favs));
  };

  const isTodayQuote = currentIndex === getDayIndex();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-[#1F4E38] to-[#173D2C] text-white p-6 sm:p-7 shadow-xs border border-emerald-800/80 ${className}`}
    >
      {/* Decorative backdrop elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-36 h-36 bg-teal-300/10 rounded-full blur-xl pointer-events-none" />

      {/* Header pill & action buttons */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700/60 text-[11px] font-bold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Daily Motivation</span>
          </div>

          <span className="text-[11px] font-semibold text-emerald-300/80 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            {quote.tag}
          </span>

          {!isTodayQuote && (
            <button
              onClick={handleResetToToday}
              className="text-[10px] text-emerald-300/90 underline hover:text-white transition-colors cursor-pointer"
            >
              Return to today's quote
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyQuote}
            className="p-1.5 rounded-xl bg-emerald-800/40 hover:bg-emerald-800/80 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            title="Copy quote to clipboard"
            aria-label="Copy quote"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isFavorited
                ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30'
                : 'bg-emerald-800/40 hover:bg-emerald-800/80 text-emerald-200 hover:text-white'
            }`}
            title={isFavorited ? 'Saved to favorites' : 'Save to favorite quotes'}
            aria-label="Favorite quote"
          >
            <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-amber-300 text-amber-300' : ''}`} />
          </button>

          <button
            onClick={handleNextQuote}
            className="p-1.5 rounded-xl bg-emerald-800/40 hover:bg-emerald-800/80 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            title="Shuffle inspiration"
            aria-label="Shuffle quote"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quote body */}
      <div className="relative z-10 my-2">
        <div className="flex items-start gap-3">
          <Quote className="w-6 h-6 text-emerald-400/60 shrink-0 mt-0.5 rotate-180" />
          <p className="text-base sm:text-lg lg:text-xl font-medium text-emerald-50 leading-relaxed tracking-normal font-serif italic">
            "{quote.quote}"
          </p>
        </div>
      </div>

      {/* Author and context */}
      <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            {quote.author}
          </span>
          {quote.context && (
            <>
              <span className="text-emerald-400/60 text-xs">•</span>
              <span className="text-[11px] sm:text-xs text-emerald-200/80">
                {quote.context}
              </span>
            </>
          )}
        </div>

        <div className="text-[11px] text-emerald-300/70 font-medium">
          {isTodayQuote ? "Today's Reflection" : `Quote #${currentIndex + 1} of ${MOTIVATION_QUOTES.length}`}
        </div>
      </div>
    </div>
  );
};
