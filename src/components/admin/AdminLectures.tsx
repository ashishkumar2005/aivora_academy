import React, { useState } from 'react';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Clock,
  Sparkles,
  Link2,
  Upload,
  Play,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { Lecture } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminLectures: React.FC = () => {
  const { units, lectures, refreshState } = useAuth();
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Form fields
  const [targetUnitId, setTargetUnitId] = useState<string>(units[0]?.id || 'unit-1');
  const [lectureNumber, setLectureNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoStreamId, setVideoStreamId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoProvider, setVideoProvider] = useState<'cloudflare_stream' | 'mux' | 'direct_stream' | 'youtube' | 'uploaded'>('direct_stream');
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [learningObjectivesText, setLearningObjectivesText] = useState('');
  const [keyConceptsText, setKeyConceptsText] = useState('');
  const [importantPointsText, setImportantPointsText] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const filteredLectures = selectedUnitFilter === 'all'
    ? lectures
    : lectures.filter((l) => l.unitId === selectedUnitFilter);

  const handleOpenCreate = () => {
    setEditingLecture(null);
    setTargetUnitId(units[0]?.id || 'unit-1');
    setLectureNumber(lectures.length + 1);
    setTitle('');
    setDescription('');
    setVideoStreamId('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setVideoProvider('direct_stream');
    setDurationMinutes(20);
    setLearningObjectivesText('Understand fundamental concepts\nAnalyze real-world AI applications\nSolve CBSE board questions');
    setKeyConceptsText('Core Definition, Algorithm Working, Exam Question');
    setImportantPointsText('Important for 4-mark CBSE board subjective section.\nRequires understanding of input-output mappings.');
    setIsPublished(true);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lec: Lecture) => {
    setEditingLecture(lec);
    setTargetUnitId(lec.unitId);
    setLectureNumber(lec.lectureNumber);
    setTitle(lec.title);
    setDescription(lec.description);
    setVideoStreamId(lec.videoStreamId);
    setVideoUrl(lec.videoUrl || lec.videoStreamId || '');
    setVideoProvider(lec.videoProvider);
    setDurationMinutes(Math.round(lec.durationSeconds / 60));
    setLearningObjectivesText(lec.learningObjectives?.join('\n') || '');
    setKeyConceptsText(lec.keyConcepts?.join(', ') || '');
    setImportantPointsText(lec.importantPoints?.join('\n') || '');
    setIsPublished(lec.isPublished);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setVideoStreamId(objUrl);
      setVideoUrl(objUrl);
      setVideoProvider('direct_stream');
      setUploadedFileName(file.name);

      // Auto-detect duration from video element
      const tempVideo = document.createElement('video');
      tempVideo.src = objUrl;
      tempVideo.onloadedmetadata = () => {
        if (tempVideo.duration && !isNaN(tempVideo.duration)) {
          setDurationMinutes(Math.max(1, Math.round(tempVideo.duration / 60)));
        }
      };
    }
  };

  const handleSave = (publishState: boolean) => {
    if (!title.trim() || !description.trim() || !videoStreamId.trim()) {
      alert('Please fill in Lecture Title, Description, and Video source.');
      return;
    }

    const objectives = learningObjectivesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const concepts = keyConceptsText.split(',').map((s) => s.trim()).filter(Boolean);
    const points = importantPointsText.split('\n').map((s) => s.trim()).filter(Boolean);

    const lectureData: Lecture = {
      id: editingLecture ? editingLecture.id : `lec-${Date.now()}`,
      unitId: targetUnitId,
      lectureNumber: Number(lectureNumber),
      title: title.trim(),
      description: description.trim(),
      videoStreamId: videoStreamId.trim(),
      videoUrl: (videoUrl || videoStreamId).trim(),
      videoProvider,
      durationSeconds: Number(durationMinutes) * 60,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      learningObjectives: objectives,
      keyConcepts: concepts,
      importantPoints: points,
      displayOrder: Number(lectureNumber),
      isPublished: publishState,
      createdAt: editingLecture ? editingLecture.createdAt : new Date().toISOString(),
    };

    DataService.upsertLecture(lectureData);
    refreshState();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this lecture? Student progress and associated notes will be disconnected.')) {
      DataService.deleteLecture(id);
      refreshState();
    }
  };

  const handleTogglePublish = (lec: Lecture) => {
    DataService.upsertLecture({ ...lec, isPublished: !lec.isPublished });
    refreshState();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lectures Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload video lessons or attach streaming playback IDs across all 7 units. Students can immediately watch uploaded videos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedUnitFilter}
            onChange={(e) => setSelectedUnitFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Units ({lectures.length})</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unitNumber}: {u.title.substring(0, 22)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture</span>
          </button>
        </div>
      </div>

      {/* Lectures List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Lecture / Unit</th>
                <th className="py-3 px-4">Title & Objectives</th>
                <th className="py-3 px-4">Video Source / Stream</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLectures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                      <Video className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">No Lectures Uploaded Yet</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                      All 7 Class 10 curriculum units are active. Currently every lecture video is blank until you upload them. Click below to add your first lecture video (MP4/WebM file or stream link).
                    </p>
                    <button
                      onClick={handleOpenCreate}
                      className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Upload / Add Lecture Video</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLectures.map((lec) => {
                const parentUnit = units.find((u) => u.id === lec.unitId);
                return (
                  <tr key={lec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">Lec {lec.lectureNumber}</span>
                      <span className="text-[11px] text-indigo-600 font-medium">
                        Unit {parentUnit?.unitNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 text-sm">{lec.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{lec.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lec.keyConcepts?.slice(0, 2).map((k, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewVideoUrl(lec.videoUrl || lec.videoStreamId)}
                          className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 cursor-pointer transition-colors"
                          title="Preview Video Player"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Preview</span>
                        </button>
                        <span className="text-slate-400 text-[10px] truncate max-w-[130px]" title={lec.videoStreamId}>
                          {lec.videoStreamId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {Math.round(lec.durationSeconds / 60)} min
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(lec)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                          lec.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {lec.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{lec.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(lec)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                        title="Edit Lecture"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lec.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                        title="Delete Lecture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 rounded-2xl max-w-2xl w-full border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <span className="text-xs font-semibold flex items-center gap-1.5 text-indigo-400">
                <Video className="w-4 h-4" />
                <span>Admin Video Stream Preview</span>
              </span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={previewVideoUrl}
                  title="Video Preview"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="p-3 text-right bg-slate-900">
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Lecture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingLecture ? 'Edit Lecture' : 'Create New Lecture'}
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
                    Assign to Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={targetUnitId}
                    onChange={(e) => setTargetUnitId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium"
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
                    Lecture Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={lectureNumber}
                    onChange={(e) => setLectureNumber(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lecture Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Precision & Recall Calculations"
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
                  placeholder="Summary of lecture concepts for students..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                />
              </div>

              {/* VIDEO UPLOAD & STREAMING SECTION */}
              <div className="p-4 bg-slate-50 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span>Upload Video or Attach Stream URL</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                    Instant Student Playback
                  </span>
                </div>

                {/* Direct Video File Upload */}
                <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white rounded-xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    id="admin-video-file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="admin-video-file"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 hover:underline">
                        Click to upload lecture video file
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        MP4, WebM, or QuickTime (instant student playback)
                      </p>
                    </div>
                  </label>

                  {uploadedFileName && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-md font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Uploaded: {uploadedFileName}</span>
                    </div>
                  )}
                </div>

                {/* Or enter video URL / ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Stream Provider
                    </label>
                    <select
                      value={videoProvider}
                      onChange={(e) => setVideoProvider(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="direct_stream">Direct MP4 / WebM Video</option>
                      <option value="cloudflare_stream">Cloudflare Stream</option>
                      <option value="mux">Mux Video</option>
                      <option value="youtube">YouTube Embed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      min={1}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Video Stream URL or Playback ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={videoStreamId}
                    onChange={(e) => {
                      setVideoStreamId(e.target.value);
                      setVideoUrl(e.target.value);
                    }}
                    placeholder="e.g. https://.../video.mp4 or YouTube link or Cloudflare Playback ID"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white"
                  />
                </div>

                {/* Quick Presets for Demo */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span>Quick Sample AI Videos:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
                      setVideoStreamId(sample);
                      setVideoUrl(sample);
                      setVideoProvider('direct_stream');
                      setDurationMinutes(15);
                    }}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    Sample 1 (AI Lesson)
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                      setVideoStreamId(sample);
                      setVideoUrl(sample);
                      setVideoProvider('direct_stream');
                      setDurationMinutes(10);
                    }}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    Sample 2 (Python Demo)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learning Objectives (1 per line)
                </label>
                <textarea
                  value={learningObjectivesText}
                  onChange={(e) => setLearningObjectivesText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Concepts (comma-separated)
                </label>
                <input
                  type="text"
                  value={keyConceptsText}
                  onChange={(e) => setKeyConceptsText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Important Points & Board Exam Tips (1 per line)
                </label>
                <textarea
                  value={importantPointsText}
                  onChange={(e) => setImportantPointsText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg leading-relaxed"
                />
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
                  Publish Lecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
