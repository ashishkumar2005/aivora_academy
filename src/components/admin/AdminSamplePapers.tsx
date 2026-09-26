import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  FileText,
  Clock,
  CheckCircle,
  X,
  FileCheck,
  Search,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { CbseSamplePaper } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminSamplePapers: React.FC = () => {
  const { samplePapers, refreshState, openPdfViewer } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<CbseSamplePaper | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [paperType, setPaperType] = useState<CbseSamplePaper['paperType']>('OFFICIAL_SQP');
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [timeAllowed, setTimeAllowed] = useState('2 Hours');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [textContentMarkdown, setTextContentMarkdown] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [pageCount, setPageCount] = useState<number>(6);
  const [isPublished, setIsPublished] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const filteredPapers = samplePapers.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.academicYear.toLowerCase().includes(q) ||
      p.paperType.toLowerCase().includes(q)
    );
  });

  const handleOpenCreate = () => {
    setEditingPaper(null);
    setTitle('');
    setAcademicYear('2024-25');
    setPaperType('OFFICIAL_SQP');
    setMaxMarks(50);
    setTimeAllowed('2 Hours');
    setDescription('');
    setPdfUrl('');
    setTextContentMarkdown(`# CBSE CLASS X — ARTIFICIAL INTELLIGENCE (CODE 417)\n## SAMPLE QUESTION PAPER 2024-25\n\n### SECTION A: OBJECTIVE (24 Marks)\n1. What is the 4Ws canvas in AI Project Cycle?\n2. What is False Positive in Confusion Matrix?\n\n### SECTION B: SUBJECTIVE (26 Marks)\n1. Explain Precision vs Recall with formula and real-life example.\n2. Write Python code using Pandas to clean null values.`);
    setFileSize('1.8 MB');
    setPageCount(6);
    setIsPublished(true);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (paper: CbseSamplePaper) => {
    setEditingPaper(paper);
    setTitle(paper.title);
    setAcademicYear(paper.academicYear);
    setPaperType(paper.paperType);
    setMaxMarks(paper.maxMarks);
    setTimeAllowed(paper.timeAllowed);
    setDescription(paper.description);
    setPdfUrl(paper.pdfUrl || '');
    setTextContentMarkdown(paper.textContentMarkdown || '');
    setFileSize(paper.fileSize);
    setPageCount(paper.pageCount);
    setIsPublished(paper.isPublished);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setPdfUrl(objUrl);
      setUploadedFileName(file.name);
      const calculatedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setFileSize(calculatedSize);
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSave = (publishStatus: boolean) => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in Paper Title and Description.');
      return;
    }

    const paperData: CbseSamplePaper = {
      id: editingPaper ? editingPaper.id : `cbse-paper-${Date.now()}`,
      title: title.trim(),
      academicYear: academicYear.trim(),
      paperType,
      subjectCode: '417',
      maxMarks: Number(maxMarks),
      timeAllowed: timeAllowed.trim(),
      description: description.trim(),
      pdfUrl: pdfUrl.trim() || undefined,
      textContentMarkdown: textContentMarkdown.trim(),
      fileSize: fileSize.trim() || '1.8 MB',
      pageCount: Number(pageCount) || 6,
      isPublished: publishStatus,
      uploadedAt: editingPaper ? editingPaper.uploadedAt : new Date().toISOString(),
    };

    DataService.upsertSamplePaper(paperData);
    refreshState();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this CBSE sample paper?')) {
      DataService.deleteSamplePaper(id);
      refreshState();
    }
  };

  const handleTogglePublish = (paper: CbseSamplePaper) => {
    DataService.upsertSamplePaper({ ...paper, isPublished: !paper.isPublished });
    refreshState();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CBSE Sample Papers & Marking Schemes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload official CBSE sample papers, blueprints, and marking scheme PDFs for Class 10 AI students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers or year..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Sample Paper PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Paper Type</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Max Marks / Time</th>
                <th className="py-3 px-4">Size & Pages</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPapers.map((paper) => (
                <tr key={paper.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-bold text-slate-900 text-sm">{paper.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{paper.description}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
                      {paper.paperType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {paper.academicYear}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    <span>{paper.maxMarks} Marks</span>
                    <span className="text-slate-400 block text-[11px]">{paper.timeAllowed}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {paper.pageCount} pgs ({paper.fileSize})
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(paper)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                        paper.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {paper.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{paper.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => openPdfViewer(paper)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                      title="Preview in PDF Viewer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(paper)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                      title="Edit Paper"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(paper.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                      title="Delete Paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPapers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">No CBSE Sample Papers Uploaded Yet</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          The CBSE Sample Papers repository is clean and ready. Click below to upload your first official sample question paper, blueprint, or marking scheme PDF.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload First Sample Paper</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload & Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingPaper ? 'Edit CBSE Sample Paper' : 'Upload CBSE Sample Paper / Marking Scheme'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* PDF File Upload Dropzone */}
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-xl p-5 text-center transition-colors">
                <input
                  type="file"
                  id="admin-sample-pdf-file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <label
                  htmlFor="admin-sample-pdf-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-600 hover:underline">
                      Click to browse and upload CBSE PDF file
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload official board paper, marking scheme, or model solutions
                    </p>
                  </div>
                </label>

                {uploadedFileName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-lg font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>File Selected: {uploadedFileName} ({fileSize})</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paper Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CBSE Class 10 AI Official Sample Question Paper 2024-25"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2024-25"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paper Type
                  </label>
                  <select
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="OFFICIAL_SQP">Official SQP</option>
                    <option value="MARKING_SCHEME">Marking Scheme</option>
                    <option value="BLUEPRINT">Blueprint & Weightage</option>
                    <option value="MODEL_PAPER">Model Practice Paper</option>
                    <option value="PREVIOUS_YEAR">Previous Year Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Allowed
                  </label>
                  <input
                    type="text"
                    value={timeAllowed}
                    onChange={(e) => setTimeAllowed(e.target.value)}
                    placeholder="2 Hours"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Overview of question sections (Section A Objective, Section B Subjective)..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paper Content & Model Questions (Markdown formatted for In-App PDF Viewer)
                </label>
                <textarea
                  value={textContentMarkdown}
                  onChange={(e) => setTextContentMarkdown(e.target.value)}
                  rows={6}
                  placeholder="# Question Paper Heading..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    File Size Display
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="1.8 MB"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Publish Sample Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
