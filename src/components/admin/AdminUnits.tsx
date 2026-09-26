import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { Unit } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminUnits: React.FC = () => {
  const { units, refreshState } = useAuth();
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [unitNumber, setUnitNumber] = useState<number>(units.length + 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(units.length + 1);
  const [isPublished, setIsPublished] = useState(true);
  const [estimatedHours, setEstimatedHours] = useState(6);

  const handleOpenCreate = () => {
    setEditingUnit(null);
    setUnitNumber(units.length + 1);
    setTitle('');
    setDescription('');
    setThumbnail('');
    setDisplayOrder(units.length + 1);
    setIsPublished(true);
    setEstimatedHours(6);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setUnitNumber(unit.unitNumber);
    setTitle(unit.title);
    setDescription(unit.description);
    setThumbnail(unit.thumbnail || '');
    setDisplayOrder(unit.displayOrder);
    setIsPublished(unit.isPublished);
    setEstimatedHours(unit.estimatedHours || 6);
    setIsModalOpen(true);
  };

  const handleSave = (publishState: boolean) => {
    if (!title.trim() || !description.trim()) {
      alert('Please provide a Unit Title and Description.');
      return;
    }

    const unitData: Unit = {
      id: editingUnit ? editingUnit.id : `unit-${Date.now()}`,
      courseId: 'course-ai-10',
      unitNumber: Number(unitNumber),
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      displayOrder: Number(displayOrder),
      isPublished: publishState,
      estimatedHours: Number(estimatedHours),
    };

    DataService.upsertUnit(unitData);
    refreshState();
    setIsModalOpen(false);
  };

  const handleDelete = (unitId: string) => {
    if (confirm('Are you sure you want to delete this Unit? All lectures inside will be orphaned.')) {
      DataService.deleteUnit(unitId);
      refreshState();
    }
  };

  const handleTogglePublish = (unit: Unit) => {
    DataService.upsertUnit({ ...unit, isPublished: !unit.isPublished });
    refreshState();
  };

  const sortedUnits = [...units].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Units Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize CBSE Class 10 Artificial Intelligence curriculum units, descriptions, and publication status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Unit</span>
        </button>
      </div>

      {/* Units Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order / Unit #</th>
                <th className="py-3 px-4">Unit Title & Syllabus Scope</th>
                <th className="py-3 px-4">Est. Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Unit {unit.unitNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="font-bold text-slate-900 text-sm">{unit.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{unit.description}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {unit.estimatedHours} hrs
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(unit)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                        unit.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {unit.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{unit.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(unit)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                      title="Edit Unit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(unit.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                      title="Delete Unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingUnit ? 'Edit Unit' : 'Create New Unit'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unit Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Model Evaluation"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the unit syllabus objectives and topics covered..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={isPublished ? 'published' : 'draft'}
                    onChange={(e) => setIsPublished(e.target.value === 'published')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="published">Published (Visible to Students)</option>
                    <option value="draft">Draft (Hidden from Students)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons as requested in prompt */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
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
                  Publish Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
