import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Video,
  FileText,
  HelpCircle,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    toggleSearch,
    publishedUnits,
    publishedLectures,
    publishedResources,
    publishedSamplePapers,
    quizzes,
    openLecture,
    openUnit,
    openPdfViewer,
  } = useAuth();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      type: 'LECTURE' | 'RESOURCE' | 'QUIZ' | 'UNIT' | 'SAMPLE_PAPER';
      unitId?: string;
      lectureId?: string;
      rawObject?: any;
    }> = [];

    // Search CBSE Sample Papers
    publishedSamplePapers.forEach((paper) => {
      if (
        paper.title.toLowerCase().includes(q) ||
        paper.description.toLowerCase().includes(q) ||
        paper.academicYear.toLowerCase().includes(q) ||
        (paper.textContentMarkdown && paper.textContentMarkdown.toLowerCase().includes(q))
      ) {
        results.push({
          id: paper.id,
          title: paper.title,
          subtitle: `CBSE Sample Paper · Year ${paper.academicYear} · Max ${paper.maxMarks} Marks`,
          type: 'SAMPLE_PAPER',
          rawObject: paper,
        });
      }
    });

    // Search Units
    publishedUnits.forEach((u) => {
      if (
        u.title.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: u.id,
          title: `Unit ${u.unitNumber}: ${u.title}`,
          subtitle: u.description,
          type: 'UNIT',
          unitId: u.id,
        });
      }
    });

    // Search Lectures
    publishedLectures.forEach((l) => {
      const matchKeyConcepts = l.keyConcepts.some((k) => k.toLowerCase().includes(q));
      const matchObjectives = l.learningObjectives.some((obj) => obj.toLowerCase().includes(q));
      const matchPoints = l.importantPoints.some((p) => p.toLowerCase().includes(q));

      if (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        matchKeyConcepts ||
        matchObjectives ||
        matchPoints
      ) {
        results.push({
          id: l.id,
          title: `Lecture ${l.lectureNumber}: ${l.title}`,
          subtitle: l.description,
          type: 'LECTURE',
          unitId: l.unitId,
          lectureId: l.id,
        });
      }
    });

    // Search Notes / Resources
    publishedResources.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.textContentMarkdown && r.textContentMarkdown.toLowerCase().includes(q))
      ) {
        results.push({
          id: r.id,
          title: r.title,
          subtitle: `${r.resourceType} · ${r.fileSize} · ${r.description}`,
          type: 'RESOURCE',
          unitId: r.unitId,
          lectureId: r.lectureId,
          rawObject: r,
        });
      }
    });

    // Search Quizzes
    quizzes.forEach((quiz) => {
      const matchQuestion = quiz.questions?.some((qItem) =>
        qItem.question.toLowerCase().includes(q) || qItem.explanation?.toLowerCase().includes(q)
      );

      if (
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        matchQuestion
      ) {
        results.push({
          id: quiz.id,
          title: quiz.title,
          subtitle: `${quiz.questions?.length || 0} Questions · ${quiz.description}`,
          type: 'QUIZ',
          unitId: quiz.unitId,
          lectureId: quiz.lectureId,
        });
      }
    });

    return results;
  }, [query, publishedUnits, publishedLectures, publishedResources, publishedSamplePapers, quizzes]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (item: any) => {
    toggleSearch(false);
    if (item.type === 'LECTURE' && item.unitId && item.lectureId) {
      openLecture(item.unitId, item.lectureId);
    } else if (item.type === 'UNIT' && item.unitId) {
      openUnit(item.unitId);
    } else if (item.type === 'RESOURCE' && item.rawObject) {
      openPdfViewer(item.rawObject);
    } else if (item.type === 'SAMPLE_PAPER' && item.rawObject) {
      openPdfViewer(item.rawObject);
    } else if (item.type === 'QUIZ' && item.unitId && item.lectureId) {
      openLecture(item.unitId, item.lectureId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI units, lectures, precision, recall, formulas, notes..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => toggleSearch(false)}
            aria-label="Close Search"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p className="font-medium text-slate-500 mb-1">Search the entire AI Curriculum</p>
              <p>Try searching for: <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setQuery('Precision')}>Precision</span>, <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setQuery('Recall')}>Recall</span>, <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setQuery('Confusion Matrix')}>Confusion Matrix</span>, or <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setQuery('Ethics')}>Ethics</span>.</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No results found for &ldquo;<span className="text-slate-900 font-medium">{query}</span>&rdquo;.
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Found {searchResults.length} matching resources
              </p>
              {searchResults.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelectResult(item)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'LECTURE'
                          ? 'bg-blue-100 text-blue-700'
                          : item.type === 'RESOURCE'
                          ? 'bg-amber-100 text-amber-700'
                          : item.type === 'QUIZ'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {item.type === 'LECTURE' && <Video className="w-4 h-4" />}
                      {item.type === 'RESOURCE' && <FileText className="w-4 h-4" />}
                      {item.type === 'QUIZ' && <HelpCircle className="w-4 h-4" />}
                      {item.type === 'UNIT' && <FolderOpen className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5 max-w-md">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search index updated across Class 10 AI topics</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
