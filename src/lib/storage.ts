import {
  Unit,
  Lecture,
  EducationalResource,
  Quiz,
  Announcement,
  StudentProfile,
  LectureProgress,
  QuizAttempt,
  BookmarkItem,
  ClassLevel,
  Subject,
  Course,
  Badge,
  CbseSamplePaper,
  StudentSuggestionMessage,
} from '../types';
import {
  INITIAL_UNITS,
  INITIAL_LECTURES,
  INITIAL_RESOURCES,
  INITIAL_QUIZZES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_STUDENTS,
  INITIAL_PROGRESS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_BOOKMARKS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_COURSES,
  INITIAL_BADGES,
  INITIAL_CBSE_SAMPLE_PAPERS,
  INITIAL_SUGGESTIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  UNITS: 'ai_hub_units_v2',
  LECTURES: 'ai_hub_lectures_v6',
  RESOURCES: 'ai_hub_resources_v2',
  QUIZZES: 'ai_hub_quizzes_v2',
  ANNOUNCEMENTS: 'ai_hub_announcements_v5',
  STUDENTS: 'ai_hub_students_v2',
  PROGRESS: 'ai_hub_progress_v6',
  QUIZ_ATTEMPTS: 'ai_hub_quiz_attempts_v6',
  BOOKMARKS: 'ai_hub_bookmarks_v6',
  CLASSES: 'ai_hub_classes_v2',
  SUBJECTS: 'ai_hub_subjects_v2',
  COURSES: 'ai_hub_courses_v2',
  BADGES: 'ai_hub_badges_v2',
  SAMPLE_PAPERS: 'ai_hub_sample_papers_clean_v1',
  SUGGESTIONS: 'ai_hub_suggestions_v6',
  ACTIVE_STUDENT_ID: 'ai_hub_active_student_id_v2',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Data Store State and Methods
export class DataService {
  // --- Units ---
  static getUnits(): Unit[] {
    return getStoredItem<Unit[]>(STORAGE_KEYS.UNITS, INITIAL_UNITS);
  }

  static saveUnits(units: Unit[]): void {
    setStoredItem(STORAGE_KEYS.UNITS, units);
  }

  static getPublishedUnits(): Unit[] {
    return this.getUnits().filter((u) => u.isPublished);
  }

  static upsertUnit(unit: Unit): void {
    const units = this.getUnits();
    const idx = units.findIndex((u) => u.id === unit.id);
    if (idx >= 0) {
      units[idx] = unit;
    } else {
      units.push(unit);
    }
    this.saveUnits(units);
  }

  static deleteUnit(unitId: string): void {
    const units = this.getUnits().filter((u) => u.id !== unitId);
    this.saveUnits(units);
  }

  // --- Lectures ---
  static getLectures(): Lecture[] {
    return getStoredItem<Lecture[]>(STORAGE_KEYS.LECTURES, INITIAL_LECTURES);
  }

  static saveLectures(lectures: Lecture[]): void {
    setStoredItem(STORAGE_KEYS.LECTURES, lectures);
  }

  static getPublishedLectures(unitId?: string): Lecture[] {
    const all = this.getLectures().filter((l) => l.isPublished);
    return unitId ? all.filter((l) => l.unitId === unitId) : all;
  }

  static getLectureById(lectureId: string): Lecture | undefined {
    return this.getLectures().find((l) => l.id === lectureId);
  }

  static upsertLecture(lecture: Lecture): void {
    const lectures = this.getLectures();
    const idx = lectures.findIndex((l) => l.id === lecture.id);
    if (idx >= 0) {
      lectures[idx] = lecture;
    } else {
      lectures.push(lecture);
    }
    this.saveLectures(lectures);
  }

  static deleteLecture(lectureId: string): void {
    const lectures = this.getLectures().filter((l) => l.id !== lectureId);
    this.saveLectures(lectures);
  }

  // --- Resources ---
  static getResources(): EducationalResource[] {
    return getStoredItem<EducationalResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  }

  static saveResources(resources: EducationalResource[]): void {
    setStoredItem(STORAGE_KEYS.RESOURCES, resources);
  }

  static getPublishedResources(unitId?: string, lectureId?: string): EducationalResource[] {
    let all = this.getResources().filter((r) => r.isPublished);
    if (unitId) all = all.filter((r) => r.unitId === unitId);
    if (lectureId) all = all.filter((r) => r.lectureId === lectureId);
    return all;
  }

  static upsertResource(resource: EducationalResource): void {
    const list = this.getResources();
    const idx = list.findIndex((r) => r.id === resource.id);
    if (idx >= 0) {
      list[idx] = resource;
    } else {
      list.push(resource);
    }
    this.saveResources(list);
  }

  static deleteResource(resourceId: string): void {
    const list = this.getResources().filter((r) => r.id !== resourceId);
    this.saveResources(list);
  }

  // --- Quizzes ---
  static getQuizzes(): Quiz[] {
    return getStoredItem<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  }

  static saveQuizzes(quizzes: Quiz[]): void {
    setStoredItem(STORAGE_KEYS.QUIZZES, quizzes);
  }

  static getQuizForLecture(lectureId: string): Quiz | undefined {
    return this.getQuizzes().find((q) => q.lectureId === lectureId && q.isPublished);
  }

  static upsertQuiz(quiz: Quiz): void {
    const list = this.getQuizzes();
    const idx = list.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) {
      list[idx] = quiz;
    } else {
      list.push(quiz);
    }
    this.saveQuizzes(list);
  }

  static deleteQuiz(quizId: string): void {
    const list = this.getQuizzes().filter((q) => q.id !== quizId);
    this.saveQuizzes(list);
  }

  // --- Announcements ---
  static getAnnouncements(): Announcement[] {
    return getStoredItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static saveAnnouncements(announcements: Announcement[]): void {
    setStoredItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  static upsertAnnouncement(announcement: Announcement): void {
    const list = this.getAnnouncements();
    const idx = list.findIndex((a) => a.id === announcement.id);
    if (idx >= 0) {
      list[idx] = announcement;
    } else {
      list.unshift(announcement);
    }
    this.saveAnnouncements(list);
  }

  static deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter((a) => a.id !== id);
    this.saveAnnouncements(list);
  }

  // --- CBSE Sample Papers ---
  static getSamplePapers(): CbseSamplePaper[] {
    try {
      if (localStorage.getItem('ai_hub_sample_papers_v2')) {
        localStorage.removeItem('ai_hub_sample_papers_v2');
      }
    } catch {
      // ignore
    }
    return getStoredItem<CbseSamplePaper[]>(STORAGE_KEYS.SAMPLE_PAPERS, INITIAL_CBSE_SAMPLE_PAPERS);
  }

  static saveSamplePapers(papers: CbseSamplePaper[]): void {
    setStoredItem(STORAGE_KEYS.SAMPLE_PAPERS, papers);
  }

  static getPublishedSamplePapers(): CbseSamplePaper[] {
    return this.getSamplePapers().filter((p) => p.isPublished);
  }

  static upsertSamplePaper(paper: CbseSamplePaper): void {
    const list = this.getSamplePapers();
    const idx = list.findIndex((p) => p.id === paper.id);
    if (idx >= 0) {
      list[idx] = paper;
    } else {
      list.unshift(paper);
    }
    this.saveSamplePapers(list);
  }

  static deleteSamplePaper(id: string): void {
    const list = this.getSamplePapers().filter((p) => p.id !== id);
    this.saveSamplePapers(list);
  }

  // --- Student Suggestions & Messages ---
  static getSuggestions(): StudentSuggestionMessage[] {
    return getStoredItem<StudentSuggestionMessage[]>(STORAGE_KEYS.SUGGESTIONS, INITIAL_SUGGESTIONS);
  }

  static saveSuggestions(suggestions: StudentSuggestionMessage[]): void {
    setStoredItem(STORAGE_KEYS.SUGGESTIONS, suggestions);
  }

  static addSuggestion(
    suggestion: Omit<StudentSuggestionMessage, 'id' | 'createdAt' | 'isRead'>
  ): StudentSuggestionMessage {
    const list = this.getSuggestions();
    const newMsg: StudentSuggestionMessage = {
      ...suggestion,
      id: `sug-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    list.unshift(newMsg);
    this.saveSuggestions(list);
    return newMsg;
  }

  static markSuggestionAsRead(id: string, isRead = true): void {
    const list = this.getSuggestions();
    const target = list.find((m) => m.id === id);
    if (target) {
      target.isRead = isRead;
      this.saveSuggestions(list);
    }
  }

  static toggleStarSuggestion(id: string): void {
    const list = this.getSuggestions();
    const target = list.find((m) => m.id === id);
    if (target) {
      target.isStarred = !target.isStarred;
      this.saveSuggestions(list);
    }
  }

  static replyToSuggestion(id: string, reply: string): void {
    const list = this.getSuggestions();
    const target = list.find((m) => m.id === id);
    if (target) {
      target.adminReply = reply;
      target.repliedAt = new Date().toISOString();
      target.isRead = true;
      this.saveSuggestions(list);
    }
  }

  static deleteSuggestion(id: string): void {
    const list = this.getSuggestions().filter((m) => m.id !== id);
    this.saveSuggestions(list);
  }

  // --- Students ---
  static getStudents(): StudentProfile[] {
    return getStoredItem<StudentProfile[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  static saveStudents(students: StudentProfile[]): void {
    setStoredItem(STORAGE_KEYS.STUDENTS, students);
  }

  static getStudentById(id: string): StudentProfile | undefined {
    return this.getStudents().find((s) => s.id === id);
  }

  static registerStudent(profile: Omit<StudentProfile, 'id' | 'registeredAt' | 'lastActive' | 'courseProgress' | 'learningStreakDays'>): StudentProfile {
    const newStudent: StudentProfile = {
      ...profile,
      id: `std_${Date.now()}`,
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      courseProgress: 0,
      learningStreakDays: 1,
    };
    const list = this.getStudents();
    list.unshift(newStudent);
    this.saveStudents(list);
    this.setActiveStudentId(newStudent.id);
    return newStudent;
  }

  static updateStudent(student: StudentProfile): void {
    const list = this.getStudents();
    const idx = list.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
      this.saveStudents(list);
    }
  }

  static getActiveStudentId(): string {
    return getStoredItem<string>(STORAGE_KEYS.ACTIVE_STUDENT_ID, 'std-rahul');
  }

  static setActiveStudentId(id: string): void {
    setStoredItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
  }

  // --- Lecture Progress ---
  static getAllProgress(): LectureProgress[] {
    return getStoredItem<LectureProgress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
  }

  static saveAllProgress(progress: LectureProgress[]): void {
    setStoredItem(STORAGE_KEYS.PROGRESS, progress);
  }

  static getProgressForStudent(studentId: string): LectureProgress[] {
    return this.getAllProgress().filter((p) => p.studentId === studentId);
  }

  static getLectureProgress(studentId: string, lectureId: string): LectureProgress | undefined {
    return this.getAllProgress().find((p) => p.studentId === studentId && p.lectureId === lectureId);
  }

  static updateLectureProgress(
    studentId: string,
    lectureId: string,
    watchedSeconds: number,
    totalDurationSeconds: number,
    markCompleted = false
  ): LectureProgress {
    const all = this.getAllProgress();
    const existingIdx = all.findIndex((p) => p.studentId === studentId && p.lectureId === lectureId);

    const prevMax = existingIdx >= 0 ? all[existingIdx].maxWatchedSeconds : 0;
    const newMax = Math.max(prevMax, watchedSeconds);
    const duration = totalDurationSeconds > 0 ? totalDurationSeconds : 1;
    const percentage = Math.min(100, Math.round((newMax / duration) * 100));
    const isCompleted = markCompleted || percentage >= 85 || (existingIdx >= 0 && all[existingIdx].isCompleted);

    const record: LectureProgress = {
      id: existingIdx >= 0 ? all[existingIdx].id : `prog_${Date.now()}`,
      studentId,
      lectureId,
      lastWatchedSeconds: Math.round(watchedSeconds),
      maxWatchedSeconds: Math.round(newMax),
      totalDurationSeconds: Math.round(duration),
      percentageWatched: percentage,
      isCompleted,
      lastUpdated: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      all[existingIdx] = record;
    } else {
      all.push(record);
    }
    this.saveAllProgress(all);

    // Recompute total student course progress
    this.recalculateStudentProgress(studentId);

    return record;
  }

  static recalculateStudentProgress(studentId: string): number {
    const student = this.getStudentById(studentId);
    if (!student) return 0;

    const publishedLectures = this.getPublishedLectures();
    if (publishedLectures.length === 0) return 0;

    const studentProg = this.getProgressForStudent(studentId);
    const completedCount = studentProg.filter((p) => p.isCompleted).length;
    const overallPercent = Math.min(100, Math.round((completedCount / publishedLectures.length) * 100));

    student.courseProgress = overallPercent;
    student.lastActive = new Date().toISOString();
    this.updateStudent(student);

    return overallPercent;
  }

  // --- Quiz Attempts ---
  static getQuizAttempts(): QuizAttempt[] {
    return getStoredItem<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, INITIAL_QUIZ_ATTEMPTS);
  }

  static saveQuizAttempts(attempts: QuizAttempt[]): void {
    setStoredItem(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);
  }

  static getAttemptsForStudent(studentId: string): QuizAttempt[] {
    return this.getQuizAttempts().filter((a) => a.studentId === studentId);
  }

  static recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'attemptedAt'>): QuizAttempt {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `att_${Date.now()}`,
      attemptedAt: new Date().toISOString(),
    };
    const list = this.getQuizAttempts();
    list.unshift(newAttempt);
    this.saveQuizAttempts(list);
    return newAttempt;
  }

  // --- Bookmarks ---
  static getBookmarks(): BookmarkItem[] {
    return getStoredItem<BookmarkItem[]>(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
  }

  static saveBookmarks(bookmarks: BookmarkItem[]): void {
    setStoredItem(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }

  static getBookmarksForStudent(studentId: string): BookmarkItem[] {
    return this.getBookmarks().filter((b) => b.studentId === studentId);
  }

  static isBookmarked(studentId: string, targetId: string): boolean {
    return this.getBookmarks().some((b) => b.studentId === studentId && b.targetId === targetId);
  }

  static toggleBookmark(studentId: string, targetId: string, type: 'LECTURE' | 'RESOURCE', title: string, subtitle: string): boolean {
    const list = this.getBookmarks();
    const idx = list.findIndex((b) => b.studentId === studentId && b.targetId === targetId);
    if (idx >= 0) {
      list.splice(idx, 1);
      this.saveBookmarks(list);
      return false;
    } else {
      list.unshift({
        id: `bm_${Date.now()}`,
        studentId,
        targetId,
        type,
        title,
        subtitle,
        savedAt: new Date().toISOString(),
      });
      this.saveBookmarks(list);
      return true;
    }
  }

  // --- Classes & Subjects ---
  static getClasses(): ClassLevel[] {
    return getStoredItem<ClassLevel[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  }

  static getSubjects(): Subject[] {
    return getStoredItem<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  }

  static getCourses(): Course[] {
    return getStoredItem<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }

  static getBadges(): Badge[] {
    return getStoredItem<Badge[]>(STORAGE_KEYS.BADGES, INITIAL_BADGES);
  }

  // Reset demo data to factory defaults
  static resetToDefault(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }
}
