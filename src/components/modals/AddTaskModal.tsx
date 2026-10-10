import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Task['category']>('Academics');
  const [dueDate, setDueDate] = useState('Due Today');
  const [dueTime, setDueTime] = useState('5:00 PM');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [priority, setPriority] = useState<Task['priority']>('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      dueDate,
      dueTime,
      estimatedMinutes,
      priority,
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Add New Task</h3>
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
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Synthesize Biochemistry Chapter 6 notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Task['category'])}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Academics">Academics</option>
                <option value="Assignment">Assignment</option>
                <option value="Deep Work">Deep Work</option>
                <option value="Exam">Exam Prep</option>
                <option value="Reading">Reading</option>
                <option value="Revision">Revision</option>
                <option value="Wellness">Wellness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Due Today / Oct 25"
                  className="w-full px-3 py-2 pl-8 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Due Time / Tag
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 11:59 PM / 45 min"
                  className="w-full px-3 py-2 pl-8 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estimated Duration: {estimatedMinutes} mins
            </label>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 accent-[#2E6B4D] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15m</span>
              <span>45m</span>
              <span>90m</span>
              <span>3h</span>
            </div>
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
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
