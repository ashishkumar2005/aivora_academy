import React from 'react';
import { Bookmark, Video, FileText, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export const BookmarksView: React.FC = () => {
  const {
    studentBookmarks,
    publishedLectures,
    publishedResources,
    openLecture,
    openPdfViewer,
    toggleBookmarkItem,
    navigateTo,
  } = useAuth();

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Saved for Rapid Revision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Content
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Quickly jump back into your bookmarked video lectures and saved PDF study materials for pre-exam practice.
          </p>
        </div>
      </div>

      {/* Bookmarks List */}
      {studentBookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 text-xs space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No Bookmarks Saved Yet</p>
          <p className="text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon on any lecture or study note to save it here for fast revision!
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('units')}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer"
            >
              <span>Explore Units</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentBookmarks.map((bm) => {
            const isLecture = bm.type === 'LECTURE';

            return (
              <div
                key={bm.id}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                        isLecture
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {isLecture ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {bm.type}
                    </span>
                    <button
                      onClick={() => toggleBookmarkItem(bm.targetId, bm.type, bm.title, bm.subtitle)}
                      title="Remove bookmark"
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {bm.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{bm.subtitle}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Saved on {new Date(bm.savedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => {
                      if (isLecture) {
                        const lec = publishedLectures.find((l) => l.id === bm.targetId);
                        if (lec) openLecture(lec.unitId, lec.id);
                      } else {
                        const res = publishedResources.find((r) => r.id === bm.targetId);
                        if (res) openPdfViewer(res);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <span>{isLecture ? 'Watch Lecture' : 'View Document'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
