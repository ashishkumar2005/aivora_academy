import React from 'react';
import {
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Bell,
  Layers,
  Award,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { DataService } from '../../lib/storage';
import suggestionBoxImg from '../../assets/images/ai_suggestion_box_1790406653830.jpg';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    publishedUnits,
    publishedLectures,
    announcements,
    studentProgress,
    studentBookmarks,
    openLecture,
    openUnit,
    openPdfViewer,
    navigateTo,
  } = useAuth();

  const badges = DataService.getBadges();

  // Find the lecture to "Continue Learning":
  const inProgressLectureRecord = studentProgress
    .filter((p) => !p.isCompleted && p.lastWatchedSeconds > 10)
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0];

  const continueLecture = inProgressLectureRecord
    ? publishedLectures.find((l) => l.id === inProgressLectureRecord.lectureId)
    : publishedLectures.find((l) => l.id === 'lec-3-3') || publishedLectures[0];

  const continueUnit = continueLecture
    ? publishedUnits.find((u) => u.id === continueLecture.unitId)
    : publishedUnits[0];

  // Recently completed lectures
  const completedLectureIds = studentProgress
    .filter((p) => p.isCompleted)
    .map((p) => p.lectureId);

  const recentlyCompletedLectures = publishedLectures.filter((l) =>
    completedLectureIds.includes(l.id)
  );

  const courseProgressPercent = currentStudent?.courseProgress || 65;

  // Determine current AI Journey Milestone based on progress
  const getJourneyStage = (pct: number) => {
    if (pct < 20) return 0; // AI Starter
    if (pct < 40) return 1; // AI Explorer
    if (pct < 65) return 2; // Model Builder
    if (pct < 90) return 3; // AI Analyst
    return 4; // AI Creator
  };

  const currentStageIdx = getJourneyStage(courseProgressPercent);

  const journeySteps = [
    { label: '🌱 AI Starter', desc: 'Orientation & Foundations' },
    { label: '🧠 AI Explorer', desc: 'Computer Vision & NLP' },
    { label: '🔬 Model Builder', desc: 'AI Project Cycle' },
    { label: '📊 AI Analyst', desc: 'Precision & Recall Master' },
    { label: '🤖 AI Creator', desc: 'CBSE AI Capstone' },
  ];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Welcome Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Class {currentStudent?.classNumber || '10'} · Artificial Intelligence (Code 417)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentStudent?.fullName?.split(' ')[0] || 'Rahul'} 👋
          </h1>

          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            {currentStudent?.school || 'Delhi Public School'} · Roll #{currentStudent?.rollNumber || '24'}
          </p>

          <p className="text-slate-500 text-xs mt-2">
            Keep your momentum going! You are making steady progress toward mastering CBSE Class 10 Model Evaluation and AI Project Cycles.
          </p>
        </div>

        {/* Learning Streak Pill */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:top-8 sm:right-8 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold text-base">
            🔥
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Learning Streak
            </p>
            <p className="text-sm font-bold text-amber-950 font-mono">
              {currentStudent?.learningStreakDays || 5} Days Active
            </p>
          </div>
        </div>
      </div>

      {/* Announcements Bar */}
      {announcements.length > 0 && (
        <div className="bg-indigo-950 text-white rounded-xl p-4 border border-indigo-900 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-white text-sm">
                Teacher Notice: {announcements[0].title}
              </span>
              <span className="text-[10px] bg-indigo-800 px-2 py-0.5 rounded text-indigo-200 uppercase font-semibold">
                {announcements[0].category}
              </span>
            </div>
            <p className="text-indigo-200 leading-relaxed">
              {announcements[0].content}
            </p>
          </div>
        </div>
      )}

      {/* 2. Top Grid: Continue Learning + Your Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CONTINUE LEARNING CARD (7 cols) */}
        {continueLecture && continueUnit ? (
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-indigo-600">
                  Continue Learning
                </span>
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.round(continueLecture.durationSeconds / 60)} min lecture
                </span>
              </div>

              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Unit {continueUnit.unitNumber} — {continueUnit.title}
              </h2>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Lecture {continueLecture.lectureNumber}: {continueLecture.title}
              </h3>

              <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                {continueLecture.description}
              </p>

              {/* Progress Resume Time Note */}
              {inProgressLectureRecord && inProgressLectureRecord.lastWatchedSeconds > 0 && (
                <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span>Last stopped at: {formatTime(inProgressLectureRecord.lastWatchedSeconds)}</span>
                  <span className="text-indigo-600 font-semibold">
                    {inProgressLectureRecord.percentageWatched}% Watched
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => openLecture(continueUnit.id, continueLecture.id)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Lecture</span>
              </button>

              <button
                onClick={() => openUnit(continueUnit.id)}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Unit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-indigo-600">
                  Curriculum Ready
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  7 Units Configured
                </span>
              </div>

              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Class 10 · Artificial Intelligence
              </h2>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Syllabus Outline & CBSE Sample Papers Live
              </h3>

              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                All 7 units (Project Cycle, Modeling, Model Evaluation, Statistical Data, Computer Vision, NLP, and Advance Python) are ready. Video lectures will be uploaded by the Admin. You can explore unit outlines, study CBSE Sample Papers, and send lecture requests or doubts directly to the Admin.
              </p>

              <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-950">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Have a specific lecture request or topic doubt?</span>
                </div>
                <button
                  onClick={() => navigateTo('suggestions')}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline shrink-0 cursor-pointer"
                >
                  Send Request →
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => openUnit('unit-1')}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Unit 1 Syllabus</span>
              </button>

              <button
                onClick={() => navigateTo('sample-papers')}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
              >
                <span>CBSE Sample Papers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* YOUR PROGRESS CARD (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Progress
              </span>
              <button
                onClick={() => navigateTo('progress')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer"
              >
                Detailed Analytics →
              </button>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Course Completion</span>
              <span className="text-2xl font-extrabold text-indigo-600 font-mono">
                {courseProgressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                style={{ width: `${courseProgressPercent}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              />
            </div>

            {/* Mini stat pills */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Lectures Done</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {completedLectureIds.length} / {publishedLectures.length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Quiz Success</span>
                <span className="text-base font-bold text-slate-900 font-mono">88% Avg</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Next Milestone: Model Evaluation Expert</span>
          </div>
        </div>
      </div>

      {/* 3. YOUR AI JOURNEY ROADMAP */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your AI Journey
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Class 10 CBSE Learning Milestones & Skill Progression
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Stage {currentStageIdx + 1} of 5
          </span>
        </div>

        {/* Roadmap visual track */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {journeySteps.map((step, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{step.label}</span>
                  {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CBSE Sample Papers Banner Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            <Award className="w-3.5 h-3.5 text-emerald-200" />
            <span>CBSE Class 10 Board Exam Section</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Official CBSE Sample Papers & Marking Schemes</h3>
          <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
            Practice the official 2024-25 Sample Question Paper (SQP), solutions, blueprints, and model answers covering all units in the in-app PDF viewer.
          </p>
        </div>
        <button
          onClick={() => navigateTo('sample-papers')}
          className="inline-flex items-center gap-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs shrink-0 self-start md:self-auto"
        >
          <span>Open CBSE Sample Papers</span>
          <ArrowRight className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* Student Suggestions Box Card with Image */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-4 relative min-h-[170px] bg-slate-900 group">
          <img
            src={suggestionBoxImg}
            alt="AIVORA Suggestions Box"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex items-end p-4">
            <span className="text-white text-xs font-bold bg-indigo-600/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              Suggestions
            </span>
          </div>
        </div>

        <div className="md:col-span-8 p-6 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Communication with Admin</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Have a Suggestion or Feedback for the Academy?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Share your thoughts, suggestions, and feedback directly with course administrators. The Admin reviews every message in the Admin Portal!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Streamlined 2-field form (Subject & Message)</span>
            <button
              onClick={() => navigateTo('suggestions')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit a Suggestion →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Units Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">CBSE Class 10 Syllabus Units</h3>
            <p className="text-xs text-slate-500">
              Artificial Intelligence (Subject Code 417) — Academic Year 2026-27
            </p>
          </div>
          <button
            onClick={() => navigateTo('units')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publishedUnits.map((unit) => {
            const unitLectures = publishedLectures.filter((l) => l.unitId === unit.id);
            const completedInUnit = unitLectures.filter((l) => completedLectureIds.includes(l.id)).length;
            const unitProgress = unitLectures.length > 0 ? Math.round((completedInUnit / unitLectures.length) * 100) : 0;

            return (
              <div
                key={unit.id}
                onClick={() => openUnit(unit.id)}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-indigo-600">Unit {unit.unitNumber}</span>
                    <span className="font-mono">{unitLectures.length} Lectures · {unit.estimatedHours} hrs</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {unit.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Progress:</span>
                    <span className="font-bold text-slate-900 font-mono">{unitProgress}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${unitProgress}%` }}
                        className="h-full bg-indigo-600 rounded-full"
                      />
                    </div>
                  </div>

                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Explore Unit <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recently Completed & Learning Progress */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Recently Completed Lectures</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Track your watched video lessons and syllabus checkpoints</p>
          </div>
          <button
            onClick={() => navigateTo('progress')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            Full Progress Log →
          </button>
        </div>

        {recentlyCompletedLectures.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-slate-100">
            Start watching video lessons as they are uploaded to view your progress log!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentlyCompletedLectures.map((lec) => (
              <div
                key={lec.id}
                onClick={() => openLecture(lec.unitId, lec.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    Lecture {lec.lectureNumber}: {lec.title}
                  </p>
                  <p className="text-[11px] text-slate-400">Watched 100% · Complete</p>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold shrink-0">
                  Done
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
