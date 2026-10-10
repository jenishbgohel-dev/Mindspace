import React, { useState } from 'react';
import { X, Upload, BookOpen } from 'lucide-react';
import { EducationalResource } from '../../types';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (resource: EducationalResource) => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<EducationalResource['subject']>('Computer Science');
  const [type, setType] = useState<EducationalResource['type']>('PDF Guide');
  const [badgeMeta, setBadgeMeta] = useState('PDF Guide • 12 pages');
  const [author, setAuthor] = useState('Alex Chen');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRes: EducationalResource = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      subject,
      type,
      badgeMeta,
      author: author.trim() || 'Alex Chen',
      authorRole: 'Peer Contributor',
      description: description.trim() || 'Comprehensive summary and verified notes shared with the MindSpace community.',
      ctaText: type === 'Deck' ? 'Practice Deck →' : type === 'Quiz' ? 'Take Quiz →' : 'Read Guide →',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    };

    onUpload(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Share Study Material</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resource Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Statistical Mechanics & Thermodynamics Cheat Sheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as EducationalResource['subject'])}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Psychology">Psychology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Literature">Literature</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Format / Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const t = e.target.value as EducationalResource['type'];
                  setType(t);
                  if (t === 'PDF Guide') setBadgeMeta('PDF Guide • 10 pages');
                  else if (t === 'Deck') setBadgeMeta('60 Cards • Active Recall');
                  else if (t === 'Quiz') setBadgeMeta('Interactive Quiz • 25 Qs');
                  else setBadgeMeta('Article • 6 min read');
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="PDF Guide">PDF Guide</option>
                <option value="Deck">Flashcard Deck</option>
                <option value="Live Doc">Live Doc</option>
                <option value="Article">Article</option>
                <option value="Video">Video</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Badge / Details (e.g. 15 pages, 80 cards)
            </label>
            <input
              type="text"
              value={badgeMeta}
              onChange={(e) => setBadgeMeta(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description & Key Takeaways
            </label>
            <textarea
              rows={2}
              required
              placeholder="Explain how this resource helped you and what key topics it covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#2E6B4D] hover:bg-[#25573e] transition-colors shadow-xs"
            >
              Share with Peers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
