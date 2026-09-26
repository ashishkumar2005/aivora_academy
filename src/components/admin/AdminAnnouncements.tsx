import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Pin,
  X,
  Send,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { Announcement } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, units, refreshState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'LECTURE' | 'QUIZ' | 'NOTES' | 'GENERAL'>('GENERAL');
  const [isPinned, setIsPinned] = useState(false);
  const [targetUnitId, setTargetUnitId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both Title and Content.');
      return;
    }

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned,
      publishedAt: new Date().toISOString(),
      targetUnitId: targetUnitId || undefined,
    };

    DataService.upsertAnnouncement(newAnnouncement);
    refreshState();
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      DataService.deleteAnnouncement(id);
      refreshState();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Announcements & Notices</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast syllabus updates, newly published lectures, and mock quiz releases directly to student dashboards.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-700 bg-indigo-50 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-100">
                  {ann.category}
                </span>
                {ann.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Pinned
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(ann.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{ann.content}</p>
            </div>

            <button
              onClick={() => handleDelete(ann.id)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg cursor-pointer transition-colors"
              title="Delete announcement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Post New Announcement</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="LECTURE">New Lecture Broadcast</option>
                  <option value="QUIZ">Quiz / Assessment Notice</option>
                  <option value="NOTES">Revision Notes & Worksheets</option>
                  <option value="GENERAL">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unit 4 Model Evaluation Notes Published"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Content Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  placeholder="Details for students..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinAnnouncement"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-indigo-600 cursor-pointer"
                />
                <label htmlFor="pinAnnouncement" className="font-semibold text-slate-700 cursor-pointer">
                  Pin to top of student dashboard
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
