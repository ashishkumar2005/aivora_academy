import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  Copy,
  Check,
  Server,
  Cloud,
  Lock,
  FileCode,
} from 'lucide-react';

export const AdminDatabaseGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sampleEnv = `# ===================================================
# AI LEARNING HUB — PRODUCTION ENVIRONMENT VARIABLES
# ===================================================

# 1. Supabase Database & Auth (Client-Safe)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."

# 2. Supabase Server Secrets (NEVER EXPOSE TO BROWSER)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# 3. Video Streaming (Cloudflare Stream or Mux)
CLOUDFLARE_STREAM_API_TOKEN="cf_stream_token_..."
# OR:
# MUX_TOKEN_ID="mux_id_..."
# MUX_TOKEN_SECRET="mux_secret_..."

# 4. Storage Bucket (Supabase Storage or Cloudflare R2)
SUPABASE_STORAGE_BUCKET="notes_and_resources"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enterprise Security & Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Supabase, Video Streaming & Storage Guide
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            Reference guide for connecting Supabase PostgreSQL, Row Level Security (RLS), Cloudflare Stream, and Document Storage.
          </p>
        </div>
      </div>

      {/* Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase">
            <Database className="w-4 h-4" />
            <span>Database & RLS</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Supabase PostgreSQL</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            16 relational tables with strict Row Level Security. Students can only read published content and write their own progress records.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-700 font-semibold">
            ✓ Schema saved at /supabase-schema.sql
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase">
            <Cloud className="w-4 h-4" />
            <span>Streaming Video</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Cloudflare Stream / Mux</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero direct MP4 file downloads. Videos are served via protected tokenized HLS playlists with signed playback URLs.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-700 font-semibold">
            ✓ Download buttons completely removed
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase">
            <Server className="w-4 h-4" />
            <span>Educational Notes</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Supabase Storage / R2</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Revision PDFs, slide presentations, and practice numerical worksheets with client view and download access.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-700 font-semibold">
            ✓ In-browser PDF Reader bundled
          </div>
        </div>
      </div>

      {/* Environment Variables Reference */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Required Environment Variables
            </h2>
            <p className="text-xs text-slate-500">
              Store sensitive tokens only in your deployment secrets (e.g. Vercel / Cloud Run).
            </p>
          </div>
          <button
            onClick={handleCopyEnv}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy .env'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
          {sampleEnv}
        </pre>
      </div>

      {/* Security Verification Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Authorization & Access Control Audit
        </h2>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Student Portal Isolation</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Enforced: Learning-Only Access
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Admin Route Protection (/admin)</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Enforced: Protected Role Verification
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Video Download Protection</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Enforced: No Download Button & Stream URLs Hidden
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Document View / Download Rights</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Enforced: Students Can View & Download PDFs, Cannot Edit/Delete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
