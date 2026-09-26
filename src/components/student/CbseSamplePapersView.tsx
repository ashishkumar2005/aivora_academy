import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle,
  FileCheck,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { CbseSamplePaper } from '../../types';

export const CbseSamplePapersView: React.FC = () => {
  const { publishedSamplePapers, openPdfViewer } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPapers = publishedSamplePapers.filter((paper) => {
    const matchesFilter = filterType === 'all' || paper.paperType === filterType;
    const matchesQuery =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.academicYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const getBadgeForType = (type: CbseSamplePaper['paperType']) => {
    switch (type) {
      case 'OFFICIAL_SQP':
        return { label: 'Official CBSE SQP', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'MARKING_SCHEME':
        return { label: 'Marking Scheme & Solutions', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'BLUEPRINT':
        return { label: 'Exam Blueprint & Weightage', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'PREVIOUS_YEAR':
        return { label: 'Previous Year Board Paper', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Model Practice Paper', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const handleDownloadPaper = (paper: CbseSamplePaper) => {
    const content = paper.textContentMarkdown || `# ${paper.title}\n\n${paper.description}\n\nCBSE Class 10 Artificial Intelligence Sample Paper.`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paper.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>CBSE Board Examination Preparation · Class 10</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Curriculum Verified · Editable exclusively via Admin Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CBSE Sample Papers & Marking Schemes
          </h1>

          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Practice official CBSE Sample Question Papers (SQP), solutions, blueprints, and model answer keys for Class 10 Artificial Intelligence (Subject Code 417). Test your mastery across all units before the board exam.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-emerald-500/5 rounded-full pointer-events-none" />
      </div>

      {/* CBSE AI Exam Blueprint Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Total Exam Marks</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">100 Marks</p>
          <p className="text-xs text-slate-500 mt-1">
            50 Marks Theory (2 Hours) + 50 Marks Practical & Capstone Project
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>Part A: Employability</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">10 Marks</p>
          <p className="text-xs text-slate-500 mt-1">
            Communication, Self-Management, ICT, Entrepreneurial & Green Skills
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Part B: Core AI Units</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">40 Marks</p>
          <p className="text-xs text-slate-500 mt-1">
            AI Project Cycle & Ethics, Modeling, Evaluation, Statistics, CV, NLP & Advance Python
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'OFFICIAL_SQP', label: 'Official SQPs' },
            { id: 'MARKING_SCHEME', label: 'Marking Schemes' },
            { id: 'BLUEPRINT', label: 'Exam Blueprint' },
            { id: 'PREVIOUS_YEAR', label: 'Previous Years' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers or year..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => {
          const badge = getBadgeForType(paper.paperType);

          return (
            <div
              key={paper.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Year {paper.academicYear}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Code {paper.subjectCode}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {paper.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {paper.description}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{paper.timeAllowed}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Max {paper.maxMarks} Marks</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{paper.pageCount} Pages ({paper.fileSize})</span>
                  </span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => openPdfViewer(paper)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>View & Solve in PDF Viewer</span>
                </button>

                <button
                  onClick={() => handleDownloadPaper(paper)}
                  title="Download Paper"
                  className="inline-flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPapers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">No CBSE Sample Papers Uploaded Yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Official CBSE sample question papers, blueprints, and marking schemes will appear here once uploaded and published through the Admin Portal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
