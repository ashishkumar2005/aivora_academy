import React, { useState } from 'react';
import {
  Search,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

interface NavbarProps {
  onOpenRoleModal: () => void;
  onOpenRegisterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRoleModal, onOpenRegisterModal }) => {
  const {
    role,
    currentStudent,
    currentView,
    navigateTo,
    toggleSearch,
    exitAdmin,
  } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(role === 'ADMIN' ? 'admin' : 'home')}
            className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xs shadow-xs tracking-wider">
              AV
            </div>
            <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
              AIVORA AI Academy
            </span>
          </button>

          {role === 'ADMIN' && (
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Admin Portal
            </span>
          )}
        </div>

        {/* Zone 2: Clean Text Navigation Links (Desktop) */}
        {role === 'STUDENT' ? (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo('units')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                currentView === 'units' || currentView === 'unit-detail' || currentView === 'lecture'
                  ? 'text-indigo-600 font-bold'
                  : ''
              }`}
            >
              Units
            </button>
            <button
              onClick={() => navigateTo('sample-papers')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                currentView === 'sample-papers' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              CBSE Sample Papers
            </button>
            <button
              onClick={() => navigateTo('suggestions')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'suggestions' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Suggestions</span>
            </button>
            <button
              onClick={() => navigateTo('progress')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                currentView === 'progress' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              My Progress
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="text-xs text-slate-500 font-normal">
              Course Management · Class 10 Artificial Intelligence
            </span>
          </nav>
        )}

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => toggleSearch(true)}
            aria-label="Search curriculum"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-xs"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-slate-400">Search topics...</span>
          </button>

          {/* Admin Switcher Button / Exit */}
          {role === 'ADMIN' ? (
            <button
              onClick={exitAdmin}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          ) : (
            <button
              onClick={onOpenRoleModal}
              className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Portal</span>
            </button>
          )}

          {/* Student Profile avatar dropdown */}
          {role === 'STUDENT' && currentStudent && (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentStudent.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Roll {currentStudent.rollNumber}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                  {currentStudent.avatarUrl ? (
                    <img src={currentStudent.avatarUrl} alt={currentStudent.fullName} className="w-full h-full object-cover" />
                  ) : (
                    currentStudent.fullName[0]
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{currentStudent.fullName}</p>
                    <p className="text-slate-500 text-[11px]">{currentStudent.school}</p>
                    <p className="text-indigo-600 font-mono text-[11px] mt-0.5">
                      Class {currentStudent.classNumber} · Roll #{currentStudent.rollNumber}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigateTo('progress');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>My Learning Progress ({currentStudent.courseProgress}%)</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigateTo('suggestions');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-500" />
                      <span>Submit a Suggestion</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenRegisterModal();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Register Another Student</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenRoleModal();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-indigo-600 font-medium flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <ShieldAlert className="w-4 h-4 text-indigo-500" />
                      <span>Switch Profile / Enter Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
