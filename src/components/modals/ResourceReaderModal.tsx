import React, { useState } from 'react';
import { X, Bookmark, Share2, Printer, Check, BookOpen } from 'lucide-react';
import { EducationalResource } from '../../types';

interface ResourceReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: EducationalResource | null;
}

export const ResourceReaderModal: React.FC<ResourceReaderModalProps> = ({
  isOpen,
  onClose,
  resource,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !resource) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                {resource.subject} • {resource.type}
              </span>
              <h3 className="font-bold text-slate-800 text-sm truncate max-w-sm sm:max-w-md">
                {resource.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-700' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{resource.title}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{resource.author}</span>
              <span>•</span>
              <span>{resource.authorRole || 'Peer Contributor'}</span>
              <span>•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">{resource.badgeMeta}</span>
            </div>
          </div>

          <p className="text-base text-slate-600 leading-relaxed italic bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60">
            "{resource.description}"
          </p>

          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <h3 className="text-lg font-bold text-slate-900">1. Conceptual Overview & Core Equations</h3>
            <p>
              In modern computational models, asymptotic behavior describes the limiting behavior of execution complexity as the input size <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">n → ∞</code>. Rather than measuring wall-clock time which varies across architecture, asymptotic analysis categorizes growth rates systematically.
            </p>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs space-y-1">
              <div className="text-emerald-400">// Formal Big-O Definition</div>
              <div>f(n) = O(g(n)) ⟺ ∃ c &gt; 0, n₀ &gt; 0 such that ∀ n ≥ n₀: 0 ≤ f(n) ≤ c · g(n)</div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 pt-2">2. Key Principles to Remember</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Amortized analysis guarantees average performance over a sequence of operations without stochastic assumptions.</li>
              <li>Always identify worst-case partitions before bounding recurrence relations via the Master Theorem.</li>
              <li>Space complexity must distinguish auxiliary space from memory occupied by input instances.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 pt-2">3. Recommended Practice Sequence</h3>
            <p>
              Before tackling advanced tree balance invariants (such as Red-Black or AVL self-balancing trees), review standard recursion invariants and proof techniques via induction.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Peer Verified Resource • MindSpace Academic Network</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2E6B4D] hover:bg-[#25573e] text-white font-bold rounded-xl transition-colors shadow-xs"
          >
            Finished Reading
          </button>
        </div>
      </div>
    </div>
  );
};
