import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle,
  Presentation,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { EducationalResource, ResourceType } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminResources: React.FC = () => {
  const { units, lectures, resources, refreshState, openPdfViewer } = useAuth();
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [editingResource, setEditingResource] = useState<EducationalResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [targetUnitId, setTargetUnitId] = useState<string>(units[0]?.id || 'unit-1');
  const [targetLectureId, setTargetLectureId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('PDF');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [pageCount, setPageCount] = useState<number>(4);
  const [textContentMarkdown, setTextContentMarkdown] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const availableLectures = lectures.filter((l) => l.unitId === targetUnitId);

  const filteredResources = selectedUnitFilter === 'all'
    ? resources
    : resources.filter((r) => r.unitId === selectedUnitFilter);

  const handleOpenCreate = () => {
    setEditingResource(null);
    setTargetUnitId(units[0]?.id || 'unit-1');
    setTargetLectureId(availableLectures[0]?.id || '');
    setTitle('');
    setDescription('');
    setResourceType('PDF');
    setFileSize('1.8 MB');
    setPageCount(4);
    setTextContentMarkdown(`# CBSE Class 10 Artificial Intelligence Notes\n## Topic: Model Evaluation\n\n### Key Formulas:\n$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$$\n$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$`);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: EducationalResource) => {
    setEditingResource(res);
    setTargetUnitId(res.unitId);
    setTargetLectureId(res.lectureId || '');
    setTitle(res.title);
    setDescription(res.description);
    setResourceType(res.resourceType);
    setFileSize(res.fileSize);
    setPageCount(res.pageCount || 4);
    setTextContentMarkdown(res.textContentMarkdown || '');
    setIsPublished(res.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = (publishState: boolean) => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in Resource Title and Description.');
      return;
    }

    const newRes: EducationalResource = {
      id: editingResource ? editingResource.id : `res-${Date.now()}`,
      unitId: targetUnitId,
      lectureId: targetLectureId || undefined,
      title: title.trim(),
      description: description.trim(),
      resourceType,
      fileSize,
      pageCount: Number(pageCount),
      downloadUrl: `/downloads/CBSE_Class10_AI_${resourceType}_${Date.now()}.pdf`,
      textContentMarkdown,
      displayOrder: 1,
      isPublished: publishState,
      uploadedAt: editingResource ? editingResource.uploadedAt : new Date().toISOString(),
    };

    DataService.upsertResource(newRes);
    refreshState();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this resource?')) {
      DataService.deleteResource(id);
      refreshState();
    }
  };

  const handleTogglePublish = (res: EducationalResource) => {
    DataService.upsertResource({ ...res, isPublished: !res.isPublished });
    refreshState();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notes & Resources Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload revision PDFs, lecture PPTs, board numerical worksheets, and assign them to units & lectures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedUnitFilter}
            onChange={(e) => setSelectedUnitFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Units ({resources.length})</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unitNumber}: {u.title.substring(0, 20)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Resource Title & Scope</th>
                <th className="py-3 px-4">Target Unit / Lecture</th>
                <th className="py-3 px-4">File Size / Pages</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.map((res) => {
                const parentUnit = units.find((u) => u.id === res.unitId);
                const parentLecture = lectures.find((l) => l.id === res.lectureId);

                return (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-flex items-center gap-1">
                        {res.resourceType === 'PPT' ? (
                          <Presentation className="w-3 h-3" />
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                        {res.resourceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 text-sm">{res.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{res.description}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold block">Unit {parentUnit?.unitNumber}</span>
                      <span className="text-[11px] text-slate-400">
                        {parentLecture ? `Lecture ${parentLecture.lectureNumber}` : 'General Unit Note'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {res.fileSize} {res.pageCount ? `· ${res.pageCount} pgs` : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(res)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                          res.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {res.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{res.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openPdfViewer(res)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(res)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                        title="Edit Resource"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingResource ? 'Edit Study Resource' : 'Upload Notes & Resources'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={targetUnitId}
                    onChange={(e) => setTargetUnitId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.unitNumber}: {u.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Lecture (Optional)
                  </label>
                  <select
                    value={targetLectureId}
                    onChange={(e) => setTargetLectureId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">Unit-Wide Resource</option>
                    {availableLectures.map((l) => (
                      <option key={l.id} value={l.id}>
                        Lecture {l.lectureNumber}: {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Precision & Recall Comprehensive Notes.pdf"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of formulas and notes contents..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="PDF">PDF Notes</option>
                    <option value="PPT">Presentation PPT</option>
                    <option value="WORKSHEET">Worksheet</option>
                    <option value="DOC">DOC / Document</option>
                    <option value="IMAGE">Diagram Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 1.8 MB"
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
                    min={1}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  In-App PDF Viewer Document Content (Markdown & Formulas)
                </label>
                <textarea
                  value={textContentMarkdown}
                  onChange={(e) => setTextContentMarkdown(e.target.value)}
                  rows={6}
                  placeholder="Enter full markdown text with headings, formulas, and tables..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer with buttons: [Upload], [Save], [Publish] as per prompt */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
              >
                Publish Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
