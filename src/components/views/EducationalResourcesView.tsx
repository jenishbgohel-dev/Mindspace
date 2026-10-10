import React, { useState } from 'react';
import { EducationalResource } from '../../types';
import {
  Search,
  Bookmark,
  BookOpen,
  Play,
  Upload,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';

interface EducationalResourcesViewProps {
  resources: EducationalResource[];
  onOpenResource: (resource: EducationalResource) => void;
  onOpenUpload: () => void;
}

export const EducationalResourcesView: React.FC<EducationalResourcesViewProps> = ({
  resources,
  onOpenResource,
  onOpenUpload,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['res-1']));
  const [savedToLibraryFeatured, setSavedToLibraryFeatured] = useState(false);

  const subjects = [
    'All Subjects',
    'Computer Science',
    'Psychology',
    'Mathematics',
    'Literature',
  ];

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredResources = resources.filter((res) => {
    if (selectedSubject !== 'All Subjects' && res.subject !== selectedSubject) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.author.toLowerCase().includes(q) ||
        res.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSubjectBadgeStyle = (subject: string) => {
    switch (subject) {
      case 'Computer Science':
        return 'bg-emerald-100 text-emerald-800';
      case 'Psychology':
        return 'bg-purple-100 text-purple-800';
      case 'Mathematics':
        return 'bg-rose-100 text-rose-800';
      case 'Literature':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Curated Spotlight Banner matching screenshot */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-[#F3F8F5] to-teal-50/70 rounded-3xl p-7 sm:p-9 border border-emerald-100/90 shadow-xs relative overflow-hidden">
        {/* Right Decorative Open Book Icon */}
        <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden sm:block">
          <svg className="w-56 h-56 text-[#2E6B4D]" fill="none" viewBox="0 0 100 100" stroke="currentColor">
            <path
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 15 25 C 35 20 48 30 50 35 C 52 30 65 20 85 25 L 85 75 C 65 70 52 80 50 85 C 48 80 35 70 15 75 Z"
            />
          </svg>
        </div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E6B4D] text-white text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Spotlight</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2.5">
            Mastering Complex Algorithms & Cognitive Flow
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            Explore high-yield collaborative notes and interactive flashcards hand-picked by peer educators for the current term.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenResource(resources[1] || resources[0])}
              className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Explore Featured Deck</span>
            </button>

            <button
              onClick={() => setSavedToLibraryFeatured(!savedToLibraryFeatured)}
              className={`flex items-center gap-2 py-3 px-5 rounded-full text-xs sm:text-sm font-bold border transition-all ${
                savedToLibraryFeatured
                  ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900'
                  : 'bg-white/80 hover:bg-white border-slate-200/90 text-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedToLibraryFeatured ? 'fill-emerald-800' : ''}`} />
              <span>{savedToLibraryFeatured ? 'Saved in Library' : 'Save to Library'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, notes..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-hidden focus:border-emerald-600 shadow-2xs"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          {subjects.map((sub) => {
            const isActive = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2E6B4D] text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Resource Cards Grid matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const isBookmarked = bookmarkedIds.has(res.id);
          const badgeStyle = getSubjectBadgeStyle(res.subject);

          return (
            <div
              key={res.id}
              onClick={() => onOpenResource(res)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image Banner with Overlay Badge & Bookmark */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={res.imageUrl}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient shadow overlay for badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Subject Tag Pill at top left */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeStyle}`}>
                      {res.subject}
                    </span>
                  </div>

                  {/* Bookmark at top right */}
                  <button
                    onClick={(e) => toggleBookmark(res.id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                  </button>

                  {/* Bottom Meta Pill overlay matching screenshot */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {res.badgeMeta}
                    </span>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug mb-1.5">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {res.description}
                  </p>
                </div>
              </div>

              {/* Author & CTA Button Footer matching screenshot */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                    {res.author.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">
                    {res.author}
                  </span>
                </div>

                <span className="text-xs font-bold text-emerald-800 group-hover:text-emerald-950 flex items-center gap-1">
                  <span>{res.ctaText}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Driven Bottom Banner matching screenshot */}
      <div className="bg-[#EEF4F0] rounded-3xl p-6 sm:p-8 border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Community Driven</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Have study materials to share with peers?
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Upload your verified notes, flashcard decks, or summaries to help fellow MindSpace members excel in their coursework.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="self-start sm:self-auto flex items-center gap-2 py-3 px-6 rounded-full bg-[#2E6B4D] hover:bg-[#25573e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>
    </div>
  );
};
