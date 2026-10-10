import React, { useState } from 'react';
import { X, Flag, Plus, Trash2 } from 'lucide-react';
import { Goal } from '../../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Goal) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
}) => {
  const [title, setTitle] = useState('');
  const [categoryTag, setCategoryTag] = useState('STEM • FALL SEMESTER');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState<string[]>([
    'Complete initial literature synthesis',
    'Execute core experimental trial',
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones([...milestones, newMilestoneText.trim()]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      title: title.trim(),
      categoryTag: categoryTag.trim(),
      description: description.trim(),
      progressPercentage: 0,
      milestones: milestones.map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m,
        status: 'due',
        completed: false,
      })),
    };

    onAddGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Add New Semester Goal</h3>
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
              Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Molecular Biology Distinction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Tag / Academic Period
            </label>
            <input
              type="text"
              required
              placeholder="e.g. STEM • FALL SEMESTER or COMPUTER SCIENCE • HONORS"
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Vision & Description
            </label>
            <textarea
              rows={2}
              required
              placeholder="Describe what mastery looks like (e.g. target GPA, mastery of key proofs, or project outcome)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Milestones list */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Key Milestones ({milestones.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700"
                >
                  <span className="truncate">{m}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add milestone step..."
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Buttons */}
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
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
