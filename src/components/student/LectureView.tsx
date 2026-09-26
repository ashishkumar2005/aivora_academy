import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  FileText,
  Presentation,
  Download,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { StreamingVideoPlayer } from './StreamingVideoPlayer';
import { QuizCard } from './QuizCard';

export const LectureView: React.FC = () => {
  const {
    selectedUnitId,
    selectedLectureId,
    publishedUnits,
    publishedLectures,
    publishedResources,
    quizzes,
    studentProgress,
    openLecture,
    openUnit,
    openPdfViewer,
    toggleBookmarkItem,
    isItemBookmarked,
    saveProgress,
  } = useAuth();

  const unit = publishedUnits.find((u) => u.id === selectedUnitId) || publishedUnits[0];
  const unitLectures = publishedLectures
    .filter((l) => l.unitId === unit?.id)
    .sort((a, b) => a.lectureNumber - b.lectureNumber);

  const lecture = publishedLectures.find((l) => l.id === selectedLectureId) || unitLectures[0];

  const resources = publishedResources.filter((r) => r.lectureId === lecture?.id);
  const lectureQuiz = quizzes.find((q) => q.lectureId === lecture?.id && q.isPublished);

  const currentProg = studentProgress.find((p) => p.lectureId === lecture?.id);
  const isCompleted = currentProg?.isCompleted;
  const isBookmarked = lecture ? isItemBookmarked(lecture.id) : false;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!lecture || !unit) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p>Lecture not found.</p>
        <button
          onClick={() => openUnit(selectedUnitId || 'unit-4')}
          className="mt-4 text-xs font-semibold text-indigo-600 underline cursor-pointer"
        >
          Return to Unit
        </button>
      </div>
    );
  }

  // Next and Previous lecture calculations
  const currentIndex = unitLectures.findIndex((l) => l.id === lecture.id);
  const prevLecture = currentIndex > 0 ? unitLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < unitLectures.length - 1 ? unitLectures[currentIndex + 1] : null;

  const handleToggleBookmark = () => {
    const bookmarked = toggleBookmarkItem(
      lecture.id,
      'LECTURE',
      `Lecture ${lecture.lectureNumber}: ${lecture.title}`,
      `Unit ${unit.unitNumber} · ${unit.title}`
    );
    setToastMessage(bookmarked ? 'Lecture added to bookmarks!' : 'Bookmark removed.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleComplete = () => {
    const newStatus = !isCompleted;
    saveProgress(lecture.id, lecture.durationSeconds, lecture.durationSeconds, newStatus);
    setToastMessage(newStatus ? 'Lecture marked as completed! 🎉' : 'Marked as incomplete.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => openUnit(unit.id)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Unit {unit.unitNumber}: {unit.title}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            aria-label="Bookmark lecture"
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
          </button>

          {/* Mark Complete Button */}
          <button
            onClick={handleToggleComplete}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Title & Metadata */}
      <div>
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
          <span>Unit {unit.unitNumber}</span>
          <span>·</span>
          <span>Lecture {lecture.lectureNumber} of {unitLectures.length}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {lecture.title}
        </h1>
      </div>

      {/* STREAMING VIDEO PLAYER */}
      <div className="w-full">
        <StreamingVideoPlayer lecture={lecture} />
      </div>

      {/* Lecture Description & Key Concepts Grid */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Lecture Overview
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {lecture.description}
          </p>
        </div>

        {/* Learning Objectives Checklist */}
        {lecture.learningObjectives && lecture.learningObjectives.length > 0 && (
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>CBSE Learning Objectives</span>
            </h3>
            <ul className="space-y-1.5 pt-1">
              {lecture.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-indigo-950">
                  <span className="w-4 h-4 rounded-full bg-indigo-200/80 text-indigo-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Concepts & Important Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {lecture.keyConcepts && lecture.keyConcepts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Concepts Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {lecture.keyConcepts.map((kc, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md"
                  >
                    {kc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lecture.importantPoints && lecture.importantPoints.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Crucial Exam Points
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {lecture.importantPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Formulas Box if applicable */}
        {lecture.formulas && lecture.formulas.length > 0 && (
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Core Mathematical Formulas (CBSE Class 10 Model Evaluation)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {lecture.formulas.map((f, i) => (
                <div key={i} className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">{f.label}</p>
                  <p className="font-mono text-sm text-indigo-300 font-bold">{f.formula}</p>
                  <p className="text-[11px] text-slate-300 leading-tight">{f.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LECTURE RESOURCES SECTION (PDF Notes, PPT, Worksheet) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Lecture Notes & Downloads
            </h2>
            <p className="text-xs text-slate-500">
              Read in our built-in viewer or download for offline revision
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{resources.length} Available</span>
        </div>

        {resources.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
            No specific document attachments for this lecture. Check the general Unit Notes tab.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3 hover:border-indigo-200 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-indigo-600 flex items-center gap-1">
                      {res.resourceType === 'PPT' ? (
                        <Presentation className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      {res.resourceType}
                    </span>
                    <span className="font-mono text-[11px]">{res.fileSize}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => openPdfViewer(res)}
                    className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => openPdfViewer(res)}
                    className="inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK QUIZ SECTION */}
      {lectureQuiz && (
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            Interactive Lecture Quiz
          </h2>
          <QuizCard quiz={lectureQuiz} lectureId={lecture.id} />
        </div>
      )}

      {/* Bottom Lecture Navigation (Prev / Next) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {prevLecture ? (
          <button
            onClick={() => openLecture(unit.id, prevLecture.id)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-400">Previous Lecture</span>
              <span className="font-bold truncate max-w-[180px] sm:max-w-xs block">
                Lecture {prevLecture.lectureNumber}: {prevLecture.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextLecture ? (
          <button
            onClick={() => openLecture(unit.id, nextLecture.id)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
          >
            <div className="text-right">
              <span className="block text-[10px] text-slate-400">Next Lecture</span>
              <span className="font-bold truncate max-w-[180px] sm:max-w-xs block">
                Lecture {nextLecture.lectureNumber}: {nextLecture.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => openUnit(unit.id)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>Finish Unit Review</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
