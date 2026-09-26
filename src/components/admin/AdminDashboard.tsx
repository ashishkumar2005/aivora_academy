import React from 'react';
import {
  Users,
  Layers,
  Video,
  FileText,
  HelpCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Award,
  MessageSquare,
  EyeOff,
  Clock,
  Reply,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { DataService } from '../../lib/storage';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectTab }) => {
  const { allStudents, units, lectures, resources, quizzes, samplePapers, suggestions } = useAuth();
  const quizAttempts = DataService.getQuizAttempts();

  const totalStudents = allStudents.length;
  const totalUnits = units.length;
  const totalLectures = lectures.length;
  const totalNotes = resources.filter((r) => r.resourceType === 'PDF').length;
  const totalResources = resources.length;
  const totalAttempts = quizAttempts.length;
  const totalSamplePapers = samplePapers.length;
  const totalSuggestions = suggestions.length;
  const unreadSuggestions = suggestions.filter((s) => !s.isRead).length;

  const avgProgress = totalStudents > 0
    ? Math.round(allStudents.reduce((acc, s) => acc + s.courseProgress, 0) / totalStudents)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Admin Portal Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Class 10 Artificial Intelligence (Code 417)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage course units, video streaming, CBSE sample papers, notes, and student communications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectTab('suggestions')}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-colors ${
              unreadSuggestions > 0
                ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Suggestions {unreadSuggestions > 0 ? `(${unreadSuggestions} new)` : ''}</span>
          </button>
          <button
            onClick={() => onSelectTab('lectures')}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Lecture Video</span>
          </button>
          <button
            onClick={() => onSelectTab('sample-papers')}
            className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload Sample Paper PDF</span>
          </button>
        </div>
      </div>

      {/* 8 Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectTab('students')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalStudents}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Enrolled Class 10</p>
        </div>

        <div
          onClick={() => onSelectTab('units')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Course Units</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalUnits}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{units.filter((u) => u.isPublished).length} Published</p>
        </div>

        <div
          onClick={() => onSelectTab('lectures')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Lectures</span>
            <Video className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalLectures}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Streaming video lessons</p>
        </div>

        <div
          onClick={() => onSelectTab('suggestions')}
          className={`bg-white rounded-xl p-4 border shadow-xs cursor-pointer transition-colors ${
            unreadSuggestions > 0 ? 'border-rose-300 hover:border-rose-400' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Student Suggestions</span>
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-extrabold text-slate-900 font-mono">{totalSuggestions}</p>
            {unreadSuggestions > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                {unreadSuggestions} new
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Suggestions & feedback</p>
        </div>

        <div
          onClick={() => onSelectTab('resources')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Notes & Docs</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalResources}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{totalNotes} PDF Notes · {totalResources - totalNotes} Other</p>
        </div>

        <div
          onClick={() => onSelectTab('sample-papers')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">CBSE Sample Papers</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalSamplePapers}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Official SQP & Marking Schemes</p>
        </div>

        <div
          onClick={() => onSelectTab('quizzes')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Quiz Attempts</span>
            <HelpCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalAttempts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{quizzes.length} Quizzes configured</p>
        </div>

        <div
          onClick={() => onSelectTab('students')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Progress</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{avgProgress}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across student roster</p>
        </div>
      </div>

      {/* Quick Access Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Student Suggestions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Recent Student Suggestions</h3>
              {unreadSuggestions > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadSuggestions}
                </span>
              )}
            </div>
            <button
              onClick={() => onSelectTab('suggestions')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Open Suggestions ({suggestions.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {suggestions.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onSelectTab('suggestions')}
                className="py-2.5 flex items-start justify-between gap-3 text-xs cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{msg.studentName}</span>
                    {msg.rollNumber && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                        #{msg.rollNumber}
                      </span>
                    )}
                    {!msg.isRead && (
                      <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-slate-800 truncate">{msg.subject}</p>
                  <p className="text-slate-500 line-clamp-1 text-[11px]">{msg.message}</p>
                </div>

                <div className="shrink-0 text-right space-y-1">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    {msg.category === 'LECTURE_REQUEST' ? 'Lecture Req' : 'Query'}
                  </span>
                  {msg.adminReply && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-semibold">
                      <Reply className="w-3 h-3" />
                      <span>Replied</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Units Overview */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">7 Curriculum Units Structure</h3>
            <button
              onClick={() => onSelectTab('units')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Manage Units →
            </button>
          </div>

          <div className="space-y-2">
            {units.map((u) => {
              const lecCount = lectures.filter((l) => l.unitId === u.id).length;
              return (
                <div
                  key={u.id}
                  className="p-2 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-indigo-700 mr-2">Unit {u.unitNumber}</span>
                    <span className="font-semibold text-slate-800 truncate">{u.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono text-xs ${lecCount === 0 ? 'text-slate-400' : 'text-indigo-600 font-bold'}`}>
                      {lecCount} {lecCount === 1 ? 'Lecture' : 'Lectures'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        u.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {u.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
