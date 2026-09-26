import React from 'react';
import {
  ArrowLeft,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Play,
  Download,
  Eye,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export const UnitDetail: React.FC = () => {
  const {
    selectedUnitId,
    publishedUnits,
    publishedLectures,
    publishedResources,
    quizzes,
    studentProgress,
    openLecture,
    openPdfViewer,
    navigateTo,
  } = useAuth();

  const unit = publishedUnits.find((u) => u.id === selectedUnitId) || publishedUnits[0];

  if (!unit) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p>Unit not found.</p>
        <button
          onClick={() => navigateTo('units')}
          className="mt-4 text-xs font-semibold text-indigo-600 underline cursor-pointer"
        >
          Back to Units
        </button>
      </div>
    );
  }

  const lectures = publishedLectures
    .filter((l) => l.unitId === unit.id)
    .sort((a, b) => a.lectureNumber - b.lectureNumber);

  const resources = publishedResources.filter((r) => r.unitId === unit.id);

  const completedLectureIds = studentProgress
    .filter((p) => p.isCompleted)
    .map((p) => p.lectureId);

  const progressRecordsMap = new Map(
    studentProgress.filter((p) => p.studentId).map((p) => [p.lectureId, p])
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('units')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Units</span>
      </button>

      {/* Unit Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            Unit {unit.unitNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {unit.title}
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {unit.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-4 mt-4 border-t border-slate-100">
            <span className="font-semibold text-slate-700">{lectures.length} Lectures</span>
            <span>·</span>
            <span>{unit.estimatedHours} Hours of Curated Learning</span>
            <span>·</span>
            <span>{resources.length} Downloadable Revision Resources</span>
          </div>
        </div>
      </div>

      {/* Lectures List Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
          <span>Lectures in Unit {unit.unitNumber}</span>
          <span className="text-xs font-mono font-medium text-slate-500">
            {completedLectureIds.filter((id) => lectures.some((l) => l.id === id)).length} of {lectures.length} completed
          </span>
        </h2>

        <div className="space-y-3">
          {lectures.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Video Lectures Uploaded Yet for Unit {unit.unitNumber}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                The syllabus structure for <span className="font-semibold text-slate-700">{unit.title}</span> is established. Lectures will be uploaded from the Admin Portal. Once published by the admin, video streams will appear here immediately.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigateTo('suggestions')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit a Suggestion</span>
                </button>
                <button
                  onClick={() => navigateTo('sample-papers')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Practice CBSE Sample Papers</span>
                </button>
              </div>
            </div>
          ) : (
            lectures.map((lecture) => {
              const prog = progressRecordsMap.get(lecture.id);
              const isCompleted = prog?.isCompleted;
              const hasStarted = prog && prog.lastWatchedSeconds > 10;
              const hasQuiz = quizzes.some((q) => q.lectureId === lecture.id && q.isPublished);

              return (
                <div
                  key={lecture.id}
                  onClick={() => openLecture(unit.id, lecture.id)}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Status Circle / Play Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : hasStarted
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600">
                          Lecture {lecture.lectureNumber}
                        </span>
                        {hasQuiz && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            <HelpCircle className="w-3 h-3 text-indigo-500" />
                            Quiz Included
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {lecture.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                        {lecture.description}
                      </p>
                    </div>
                  </div>

                  {/* Right duration & play button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.round(lecture.durationSeconds / 60)} min
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>{isCompleted ? 'Review' : hasStarted ? 'Resume' : 'Watch'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Unit Notes & Resources Section */}
      {resources.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900">
            Unit Notes & Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-indigo-600">{res.resourceType} Document</span>
                    <span>{res.fileSize}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{res.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openPdfViewer(res)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </button>
                  <button
                    onClick={() => openPdfViewer(res)}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
