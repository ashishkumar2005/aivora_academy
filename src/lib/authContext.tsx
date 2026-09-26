import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Role,
  StudentProfile,
  Unit,
  Lecture,
  EducationalResource,
  Quiz,
  Announcement,
  LectureProgress,
  BookmarkItem,
  CbseSamplePaper,
  StudentSuggestionMessage,
} from '../types';
import { DataService } from './storage';

export type AppView =
  | 'home'
  | 'units'
  | 'unit-detail'
  | 'lecture'
  | 'notes'
  | 'sample-papers'
  | 'suggestions'
  | 'progress'
  | 'bookmarks'
  | 'admin';

interface AuthContextType {
  role: Role;
  isAdmin: boolean;
  currentStudent: StudentProfile | null;
  allStudents: StudentProfile[];
  units: Unit[];
  publishedUnits: Unit[];
  lectures: Lecture[];
  publishedLectures: Lecture[];
  resources: EducationalResource[];
  publishedResources: EducationalResource[];
  samplePapers: CbseSamplePaper[];
  publishedSamplePapers: CbseSamplePaper[];
  suggestions: StudentSuggestionMessage[];
  quizzes: Quiz[];
  announcements: Announcement[];
  studentProgress: LectureProgress[];
  studentBookmarks: BookmarkItem[];
  activePdfResource: EducationalResource | CbseSamplePaper | null;
  isSearchOpen: boolean;
  selectedUnitId: string | null;
  selectedLectureId: string | null;
  currentView: AppView;

  // Navigation handlers
  navigateTo: (view: AppView) => void;
  openLecture: (unitId: string, lectureId: string) => void;
  openUnit: (unitId: string) => void;
  openPdfViewer: (resource: EducationalResource | CbseSamplePaper) => void;
  closePdfViewer: () => void;
  toggleSearch: (open?: boolean) => void;

  // Actions
  loginAsAdmin: (password: string) => boolean;
  exitAdmin: () => void;
  switchRole: (newRole: Role) => void;
  registerStudent: (data: { fullName: string; rollNumber: string; classNumber: string; school: string; email?: string }) => StudentProfile;
  switchStudent: (studentId: string) => void;
  saveProgress: (lectureId: string, watchedSeconds: number, totalDuration: number, markCompleted?: boolean) => void;
  toggleBookmarkItem: (targetId: string, type: 'LECTURE' | 'RESOURCE', title: string, subtitle: string) => boolean;
  isItemBookmarked: (targetId: string) => boolean;
  sendSuggestion: (data: Omit<StudentSuggestionMessage, 'id' | 'createdAt' | 'isRead'>) => StudentSuggestionMessage;
  markSuggestionAsRead: (id: string, isRead?: boolean) => void;
  toggleStarSuggestion: (id: string) => void;
  replyToSuggestion: (id: string, reply: string) => void;
  deleteSuggestion: (id: string) => void;
  refreshState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_DEFAULT_PIN = 'admin123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('STUDENT');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [samplePapers, setSamplePapers] = useState<CbseSamplePaper[]>([]);
  const [suggestions, setSuggestions] = useState<StudentSuggestionMessage[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentProgress, setStudentProgress] = useState<LectureProgress[]>([]);
  const [studentBookmarks, setStudentBookmarks] = useState<BookmarkItem[]>([]);

  // Navigation & Modal state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>('unit-1');
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [activePdfResource, setActivePdfResource] = useState<EducationalResource | CbseSamplePaper | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const refreshState = useCallback(() => {
    const loadedStudents = DataService.getStudents();
    setAllStudents(loadedStudents);

    const activeId = DataService.getActiveStudentId();
    const activeStudent = loadedStudents.find((s) => s.id === activeId) || loadedStudents[0] || null;
    setCurrentStudent(activeStudent);

    setUnits(DataService.getUnits());
    setLectures(DataService.getLectures());
    setResources(DataService.getResources());
    setSamplePapers(DataService.getSamplePapers());
    setSuggestions(DataService.getSuggestions());
    setQuizzes(DataService.getQuizzes());
    setAnnouncements(DataService.getAnnouncements());

    if (activeStudent) {
      setStudentProgress(DataService.getProgressForStudent(activeStudent.id));
      setStudentBookmarks(DataService.getBookmarksForStudent(activeStudent.id));
    }
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const loginAsAdmin = (pin: string): boolean => {
    if (pin.trim() === ADMIN_DEFAULT_PIN) {
      setRole('ADMIN');
      setCurrentView('admin');
      return true;
    }
    return false;
  };

  const exitAdmin = () => {
    setRole('STUDENT');
    setCurrentView('home');
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'ADMIN') {
      setCurrentView('admin');
    } else if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  const registerStudent = (data: {
    fullName: string;
    rollNumber: string;
    classNumber: string;
    school: string;
    email?: string;
  }) => {
    const newStudent = DataService.registerStudent({
      ...data,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    });
    refreshState();
    setCurrentView('home');
    return newStudent;
  };

  const switchStudent = (studentId: string) => {
    DataService.setActiveStudentId(studentId);
    refreshState();
  };

  const saveProgress = (
    lectureId: string,
    watchedSeconds: number,
    totalDuration: number,
    markCompleted = false
  ) => {
    if (!currentStudent) return;
    DataService.updateLectureProgress(currentStudent.id, lectureId, watchedSeconds, totalDuration, markCompleted);
    refreshState();
  };

  const toggleBookmarkItem = (
    targetId: string,
    type: 'LECTURE' | 'RESOURCE',
    title: string,
    subtitle: string
  ): boolean => {
    if (!currentStudent) return false;
    const isNowBookmarked = DataService.toggleBookmark(currentStudent.id, targetId, type, title, subtitle);
    setStudentBookmarks(DataService.getBookmarksForStudent(currentStudent.id));
    return isNowBookmarked;
  };

  const isItemBookmarked = (targetId: string): boolean => {
    if (!currentStudent) return false;
    return DataService.isBookmarked(currentStudent.id, targetId);
  };

  const openLecture = (unitId: string, lectureId: string) => {
    setSelectedUnitId(unitId);
    setSelectedLectureId(lectureId);
    setCurrentView('lecture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setCurrentView('unit-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPdfViewer = (resource: EducationalResource | CbseSamplePaper) => {
    setActivePdfResource(resource);
  };

  const closePdfViewer = () => {
    setActivePdfResource(null);
  };

  const toggleSearch = (open?: boolean) => {
    setIsSearchOpen((prev) => (open !== undefined ? open : !prev));
  };

  const navigateTo = (view: AppView) => {
    if (view === 'admin' && role !== 'ADMIN') {
      // Prompt for PIN will be triggered by RoleSwitcherModal
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendSuggestion = (data: Omit<StudentSuggestionMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg = DataService.addSuggestion(data);
    setSuggestions(DataService.getSuggestions());
    return newMsg;
  };

  const markSuggestionAsRead = (id: string, isRead = true) => {
    DataService.markSuggestionAsRead(id, isRead);
    setSuggestions(DataService.getSuggestions());
  };

  const toggleStarSuggestion = (id: string) => {
    DataService.toggleStarSuggestion(id);
    setSuggestions(DataService.getSuggestions());
  };

  const replyToSuggestion = (id: string, reply: string) => {
    DataService.replyToSuggestion(id, reply);
    setSuggestions(DataService.getSuggestions());
  };

  const deleteSuggestion = (id: string) => {
    DataService.deleteSuggestion(id);
    setSuggestions(DataService.getSuggestions());
  };

  const publishedUnits = units.filter((u) => u.isPublished);
  const publishedLectures = lectures.filter((l) => l.isPublished);
  const publishedResources = resources.filter((r) => r.isPublished);
  const publishedSamplePapers = samplePapers.filter((p) => p.isPublished);

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === 'ADMIN',
        currentStudent,
        allStudents,
        units,
        publishedUnits,
        lectures,
        publishedLectures,
        resources,
        publishedResources,
        samplePapers,
        publishedSamplePapers,
        suggestions,
        quizzes,
        announcements,
        studentProgress,
        studentBookmarks,
        activePdfResource,
        isSearchOpen,
        selectedUnitId,
        selectedLectureId,
        currentView,
        navigateTo,
        openLecture,
        openUnit,
        openPdfViewer,
        closePdfViewer,
        toggleSearch,
        loginAsAdmin,
        exitAdmin,
        switchRole,
        registerStudent,
        switchStudent,
        saveProgress,
        toggleBookmarkItem,
        isItemBookmarked,
        sendSuggestion,
        markSuggestionAsRead,
        toggleStarSuggestion,
        replyToSuggestion,
        deleteSuggestion,
        refreshState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
