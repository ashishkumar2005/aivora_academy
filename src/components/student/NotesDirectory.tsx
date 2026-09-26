import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Download,
  Eye,
  Presentation,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { ResourceType } from '../../types';

export const NotesDirectory: React.FC = () => {
  const {
    publishedUnits,
    publishedLectures,
    publishedResources,
    openPdfViewer,
    openLecture,
  } = useAuth();

  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [browseMode, setBrowseMode] = useState<'unit' | 'lecture' | 'all'>('unit');

  // Filtered resources
  const filteredResources = useMemo(() => {
    return publishedResources.filter((res) => {
      // Unit filter
      if (selectedUnitFilter !== 'all' && res.unitId !== selectedUnitFilter) {
        return false;
      }
      // Type filter
      if (selectedTypeFilter !== 'all' && res.resourceType !== selectedTypeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesText = res.textContentMarkdown?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesText) {
          return false;
        }
      }
      return true;
    });
  }, [publishedResources, selectedUnitFilter, selectedTypeFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Class 10 CBSE AI Notes & Materials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notes & Study Resources
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Access certified chapter notes, lecture summaries, board numerical worksheets, and slide decks. View instantly in our in-browser reader or download for offline revision.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes (e.g., 'Precision', 'Confusion Matrix', '4Ws Canvas')..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
            />
          </div>

          {/* Unit Filter */}
          <div className="flex gap-2">
            <select
              value={selectedUnitFilter}
              onChange={(e) => setSelectedUnitFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Units</option>
              {publishedUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title.substring(0, 24)}...
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Formats</option>
              <option value="PDF">PDF Notes</option>
              <option value="PPT">Presentation Slides</option>
              <option value="WORKSHEET">Worksheets</option>
            </select>
          </div>
        </div>

        {/* Browse Options Segmented Control */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setBrowseMode('unit')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                browseMode === 'unit'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Organized by Unit
            </button>
            <button
              onClick={() => setBrowseMode('lecture')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                browseMode === 'lecture'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Lecture
            </button>
            <button
              onClick={() => setBrowseMode('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                browseMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Files ({filteredResources.length})
            </button>
          </div>

          <span className="text-slate-500 font-mono">
            Showing {filteredResources.length} of {publishedResources.length} resources
          </span>
        </div>
      </div>

      {/* Content Rendering based on Browse Mode */}
      {browseMode === 'unit' ? (
        /* OPTION 1: ORGANIZED BY UNIT */
        <div className="space-y-6">
          {publishedUnits.map((unit) => {
            const unitRes = filteredResources.filter((r) => r.unitId === unit.id);
            if (unitRes.length === 0) return null;

            return (
              <div key={unit.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Unit {unit.unitNumber}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {unit.title}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {unitRes.length} document{unitRes.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unitRes.map((res) => {
                    const parentLecture = publishedLectures.find((l) => l.id === res.lectureId);
                    return (
                      <ResourceCard
                        key={res.id}
                        resource={res}
                        lecture={parentLecture}
                        onViewPdf={() => openPdfViewer(res)}
                        onJumpToLecture={
                          parentLecture ? () => openLecture(unit.id, parentLecture.id) : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : browseMode === 'lecture' ? (
        /* OPTION 2: ORGANIZED BY LECTURE */
        <div className="space-y-6">
          {publishedLectures.map((lec) => {
            const lecRes = filteredResources.filter((r) => r.lectureId === lec.id);
            if (lecRes.length === 0) return null;
            const parentUnit = publishedUnits.find((u) => u.id === lec.unitId);

            return (
              <div key={lec.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      Unit {parentUnit?.unitNumber} · Lecture {lec.lectureNumber}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">
                      {lec.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => openLecture(lec.unitId, lec.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Open Lecture →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {lecRes.map((res) => (
                    <ResourceCard
                      key={res.id}
                      resource={res}
                      lecture={lec}
                      onViewPdf={() => openPdfViewer(res)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* OPTION 3: ALL FILES FLAT GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const parentLecture = publishedLectures.find((l) => l.id === res.lectureId);
            return (
              <ResourceCard
                key={res.id}
                resource={res}
                lecture={parentLecture}
                onViewPdf={() => openPdfViewer(res)}
              />
            );
          })}
        </div>
      )}

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 text-xs">
          No resources found matching the specified filters or search query.
        </div>
      )}
    </div>
  );
};

interface ResourceCardProps {
  resource: any;
  lecture?: any;
  onViewPdf: () => void;
  onJumpToLecture?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  lecture,
  onViewPdf,
  onJumpToLecture,
}) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-indigo-600 flex items-center gap-1">
            {resource.resourceType === 'PPT' ? (
              <Presentation className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
            )}
            {resource.resourceType}
          </span>
          <span className="font-mono text-[11px] text-slate-400">{resource.fileSize}</span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-snug">
          {resource.title}
        </h3>

        {lecture && (
          <p className="text-[11px] text-indigo-600 font-medium truncate">
            Lecture {lecture.lectureNumber}: {lecture.title}
          </p>
        )}

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={onViewPdf}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View PDF</span>
        </button>

        <button
          onClick={onViewPdf}
          className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
