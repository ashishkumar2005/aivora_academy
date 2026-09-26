import React from 'react';
import {
  Layers,
  Clock,
  FileText,
  Video,
  ArrowRight,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export const UnitList: React.FC = () => {
  const { publishedUnits, publishedLectures, publishedResources, studentProgress, openUnit } = useAuth();

  const completedLectureIds = studentProgress.filter((p) => p.isCompleted).map((p) => p.lectureId);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Class 10 · Course Units</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Artificial Intelligence (Subject Code 417)
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Follow the systematic CBSE syllabus structured across foundational AI theory, project cycles, computer vision, natural language processing, and rigorous model evaluation.
          </p>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {publishedUnits.map((unit) => {
          const unitLectures = publishedLectures.filter((l) => l.unitId === unit.id);
          const unitResources = publishedResources.filter((r) => r.unitId === unit.id);
          const completedInUnit = unitLectures.filter((l) => completedLectureIds.includes(l.id)).length;
          const progressPercent = unitLectures.length > 0 ? Math.round((completedInUnit / unitLectures.length) * 100) : 0;
          const totalDurationMinutes = Math.round(
            unitLectures.reduce((acc, l) => acc + (l.durationSeconds || 0), 0) / 60
          );

          return (
            <div
              key={unit.id}
              onClick={() => openUnit(unit.id)}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Unit Info Left */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    Unit {unit.unitNumber}
                  </span>
                  {progressPercent === 100 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Completed
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {unit.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {unit.description}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{unitLectures.length} Lectures</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{totalDurationMinutes} Minutes Total</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{unitResources.length} Notes & Resources</span>
                  </span>
                </div>
              </div>

              {/* Progress and CTA Right */}
              <div className="md:w-64 flex flex-col sm:flex-row md:flex-col justify-between items-start md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="w-full md:text-right">
                  <div className="flex items-center justify-between md:justify-end gap-2 text-xs mb-1">
                    <span className="text-slate-500">Unit Progress:</span>
                    <span className="font-bold text-slate-900 font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        progressPercent === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <span>{progressPercent > 0 ? 'Continue Unit' : 'Start Unit'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
