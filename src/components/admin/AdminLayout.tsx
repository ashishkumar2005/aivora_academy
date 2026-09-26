import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Video,
  FileText,
  HelpCircle,
  Bell,
  Sliders,
  Database,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Award,
  MessageSquare,
  Heart,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export type AdminTab =
  | 'overview'
  | 'units'
  | 'lectures'
  | 'resources'
  | 'sample-papers'
  | 'suggestions'
  | 'quizzes'
  | 'students'
  | 'announcements'
  | 'classes'
  | 'database';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const { exitAdmin, allStudents, units, lectures, resources, samplePapers, suggestions } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const unreadSuggestionsCount = suggestions.filter((s) => !s.isRead).length;

  const navItems: Array<{ id: AdminTab; label: string; icon: any; badge?: number; badgeAlert?: boolean }> = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'units', label: 'Units Management', icon: Layers, badge: units.length },
    { id: 'lectures', label: 'Lectures', icon: Video, badge: lectures.length },
    { id: 'resources', label: 'Notes & Resources', icon: FileText, badge: resources.length },
    { id: 'sample-papers', label: 'CBSE Sample Papers', icon: Award, badge: samplePapers.length },
    {
      id: 'suggestions',
      label: 'Suggestions',
      icon: MessageSquare,
      badge: unreadSuggestionsCount > 0 ? unreadSuggestionsCount : suggestions.length,
      badgeAlert: unreadSuggestionsCount > 0,
    },
    { id: 'quizzes', label: 'Quizzes & Questions', icon: HelpCircle },
    { id: 'students', label: 'Students Roster', icon: Users, badge: allStudents.length },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'classes', label: 'Classes & Subjects', icon: Sliders },
    { id: 'database', label: 'Supabase & RLS Guide', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-white text-xs tracking-wider">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  AIVORA AI Academy
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                CBSE Curriculum & Student Course Management System
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={exitAdmin}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch to Student View</span>
          </button>
        </div>
      </header>

      {/* Admin Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-1">
          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Content & Roster Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : item.badgeAlert
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Security Status Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>RLS Security Enforced</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Students can only read published content. All write and publication controls are restricted to the Admin role.
            </p>
          </div>
        </aside>

        {/* Mobile Slideout Sidebar */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 space-y-2 shadow-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
                  <span className="font-bold text-sm text-slate-900">Admin Navigation</span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="font-mono text-[10px]">{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={exitAdmin}
                className="w-full bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit to Student Mode</span>
              </button>
            </div>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Admin Tab Content with Footer */}
        <main className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex-1">{children}</div>

          {/* Admin Portal Footer */}
          <footer className="mt-12 py-5 border-t border-slate-200 bg-white text-xs text-slate-500 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">AIVORA AI Academy</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
                  Admin Portal
                </span>
                <span className="text-slate-300 hidden sm:inline">·</span>
                <span className="text-slate-400 hidden sm:inline text-[11px]">Class 10 CBSE AI Curriculum</span>
              </div>

              {/* Made with ❤️ by AIVORA */}
              <div className="flex items-center justify-center gap-1.5 font-medium text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse mx-0.5" />
                <span>by</span>
                <span className="font-extrabold text-indigo-600 tracking-wide">AIVORA</span>
              </div>

              <div className="text-slate-400 text-[11px]">
                Content & Course Management System
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
