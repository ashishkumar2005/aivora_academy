import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/authContext';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { StudentRegistrationModal } from './components/student/StudentRegistrationModal';
import { PdfViewerModal } from './components/student/PdfViewerModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { UnitList } from './components/student/UnitList';
import { UnitDetail } from './components/student/UnitDetail';
import { LectureView } from './components/student/LectureView';
import { CbseSamplePapersView } from './components/student/CbseSamplePapersView';
import { ProgressView } from './components/student/ProgressView';
import { SuggestionsView } from './components/student/SuggestionsView';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUnits } from './components/admin/AdminUnits';
import { AdminLectures } from './components/admin/AdminLectures';
import { AdminResources } from './components/admin/AdminResources';
import { AdminSamplePapers } from './components/admin/AdminSamplePapers';
import { AdminSuggestions } from './components/admin/AdminSuggestions';
import { AdminQuizzes } from './components/admin/AdminQuizzes';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';
import { AdminClassesSubjects } from './components/admin/AdminClassesSubjects';
import { AdminDatabaseGuide } from './components/admin/AdminDatabaseGuide';

const MainAppContent: React.FC = () => {
  const {
    role,
    currentView,
    activePdfResource,
    closePdfViewer,
  } = useAuth();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // If in Admin mode, render the Admin Portal
  if (role === 'ADMIN') {
    return (
      <AdminLayout currentTab={adminTab} onSelectTab={setAdminTab}>
        {adminTab === 'overview' && <AdminDashboard onSelectTab={setAdminTab} />}
        {adminTab === 'units' && <AdminUnits />}
        {adminTab === 'lectures' && <AdminLectures />}
        {adminTab === 'resources' && <AdminResources />}
        {adminTab === 'sample-papers' && <AdminSamplePapers />}
        {adminTab === 'suggestions' && <AdminSuggestions />}
        {adminTab === 'quizzes' && <AdminQuizzes />}
        {adminTab === 'students' && <AdminStudents />}
        {adminTab === 'announcements' && <AdminAnnouncements />}
        {adminTab === 'classes' && <AdminClassesSubjects />}
        {adminTab === 'database' && <AdminDatabaseGuide />}

        {/* In-app PDF preview modal if admin clicks preview */}
        <PdfViewerModal resource={activePdfResource} onClose={closePdfViewer} />
      </AdminLayout>
    );
  }

  // Otherwise render the Student Portal
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Navbar
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Student Portal Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'home' && <StudentDashboard />}
        {currentView === 'units' && <UnitList />}
        {currentView === 'unit-detail' && <UnitDetail />}
        {currentView === 'lecture' && <LectureView />}
        {currentView === 'sample-papers' && <CbseSamplePapersView />}
        {currentView === 'suggestions' && <SuggestionsView />}
        {currentView === 'progress' && <ProgressView />}
      </main>

      {/* Global Modals */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />

      <StudentRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <PdfViewerModal
        resource={activePdfResource}
        onClose={closePdfViewer}
      />

      <GlobalSearchModal />

      {/* Mobile-first Bottom Touch Bar */}
      <MobileBottomNav />

      {/* Educational Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 mb-16 md:mb-0 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AIVORA AI Academy</span>
            <span>·</span>
            <span>Class 10 CBSE Curriculum (Subject Code 417)</span>
          </div>

          {/* Made with ❤️ by AIVORA */}
          <div className="flex items-center justify-center gap-1.5 font-medium text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse mx-0.5" />
            <span>by</span>
            <span className="font-extrabold text-indigo-600 tracking-wide">AIVORA</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Units & CBSE Board Sample Papers</span>
            <span>·</span>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
