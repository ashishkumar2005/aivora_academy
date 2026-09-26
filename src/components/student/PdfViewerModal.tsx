import React, { useState } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  CheckCircle,
} from 'lucide-react';
import { EducationalResource, CbseSamplePaper } from '../../types';

interface PdfViewerModalProps {
  resource: EducationalResource | CbseSamplePaper | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ resource, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<boolean>(false);

  if (!resource) return null;

  const totalPages = resource.pageCount || 4;
  const docType = ('resourceType' in resource ? resource.resourceType : resource.paperType) || 'PDF';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDownload = () => {
    // If real direct URL (pdfUrl or downloadUrl) is available and valid blob, trigger direct download
    const directUrl = 'pdfUrl' in resource ? resource.pdfUrl : (resource as EducationalResource).downloadUrl;
    if (directUrl && directUrl.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = directUrl;
      link.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadNotice(true);
      setTimeout(() => setDownloadNotice(false), 3000);
      return;
    }

    // Generate downloadable text / markdown file for student offline study
    const content = resource.textContentMarkdown || `# ${resource.title}\n\n${resource.description}\n\nCBSE Class 10 Artificial Intelligence Study Material.`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 border border-slate-200 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        {/* PDF Top Toolbar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{docType} Document</span>
                <span>·</span>
                <span>{resource.fileSize}</span>
                <span>·</span>
                <span>Verified CBSE Study Material</span>
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Page navigation */}
            <div className="flex items-center bg-slate-800 rounded-lg px-2 py-1 gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="p-1 hover:text-indigo-400 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300 px-1">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="p-1 hover:text-indigo-400 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg px-2 py-1 gap-1">
              <button
                onClick={handleZoomOut}
                aria-label="Zoom out"
                className="p-1 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300 px-1">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                aria-label="Zoom in"
                className="p-1 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Print */}
            <button
              onClick={handlePrint}
              aria-label="Print Document"
              className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label="Toggle Fullscreen"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close PDF Viewer"
              className="p-1.5 bg-slate-800 hover:bg-rose-600 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download notification snackbar */}
        {downloadNotice && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Document downloaded successfully for offline study!</span>
            </div>
          </div>
        )}

        {/* PDF Document Canvas / Reading Stage */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
          <div
            style={{ width: `${zoomLevel}%`, maxWidth: '850px' }}
            className="bg-white rounded-lg shadow-md border border-slate-200 min-h-[700px] p-6 sm:p-12 text-slate-800 font-sans transition-all duration-150"
          >
            {/* Document Header Page Badge */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-600">AI LEARNING HUB</span>
                <span>·</span>
                <span>Class 10 CBSE AI (Code 417)</span>
              </div>
              <span className="font-mono">Page {currentPage} of {totalPages}</span>
            </div>

            {/* Rendered Educational Note Content */}
            {resource.textContentMarkdown ? (
              <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
                {resource.textContentMarkdown.split('\n\n').map((block, idx) => {
                  if (block.startsWith('# ')) {
                    return (
                      <h1 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-indigo-100 pb-2">
                        {block.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-lg font-bold text-indigo-900 mt-6 pt-2">
                        {block.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-semibold text-slate-800 mt-4">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('$$') && block.endsWith('$$')) {
                    return (
                      <div key={idx} className="my-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center font-mono text-indigo-950 font-semibold text-base shadow-xs">
                        {block.replaceAll('$$', '')}
                      </div>
                    );
                  }
                  if (block.startsWith('|')) {
                    // Render simple markdown table
                    const lines = block.trim().split('\n');
                    const headers = lines[0].split('|').filter(Boolean).map((h) => h.trim());
                    const rows = lines.slice(2).map((line) => line.split('|').filter(Boolean).map((c) => c.trim()));

                    return (
                      <div key={idx} className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                        <table className="min-w-full text-xs text-left">
                          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              {headers.map((h, i) => (
                                <th key={i} className="p-2.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2.5 text-slate-800">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {block}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-semibold text-slate-700">Official Study Notes PDF</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {resource.description}
                </p>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Original PDF ({resource.fileSize})
                  </button>
                </div>
              </div>
            )}

            {/* Document Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span>Artificial Intelligence (Code 417) — Academic Year 2026-27</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>

        {/* PDF Bottom Status Bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>Reading Mode</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline font-mono">Status: Verified Study Note</span>
          </div>
          <div className="flex items-center gap-3">
            <span>CBSE Curriculum Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
