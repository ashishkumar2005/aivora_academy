export type Role = 'ADMIN' | 'STUDENT';

export interface StudentProfile {
  id: string;
  fullName: string;
  rollNumber: string;
  classNumber: string; // "10", "9", "8", etc.
  school: string;
  email?: string;
  avatarUrl?: string;
  registeredAt: string;
  lastActive: string;
  courseProgress: number; // 0 - 100
  learningStreakDays: number;
}

export interface ClassLevel {
  id: string;
  name: string; // e.g. "Class 10"
  numericLevel: number; // 10
  isActive: boolean;
}

export interface Subject {
  id: string;
  classId: string;
  code: string; // e.g. "417"
  name: string; // "Artificial Intelligence"
  icon: string;
  description: string;
}

export interface Course {
  id: string;
  subjectId: string;
  title: string;
  classNumber: string;
  academicYear: string;
  description: string;
  thumbnail: string;
}

export interface Unit {
  id: string;
  courseId: string;
  unitNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  displayOrder: number;
  isPublished: boolean;
  estimatedHours: number;
}

export interface Lecture {
  id: string;
  unitId: string;
  lectureNumber: number;
  title: string;
  description: string;
  videoStreamId: string; // Cloudflare Stream ID or Mux Playback ID or sample stream URL or direct uploaded video URL
  videoProvider: 'cloudflare_stream' | 'mux' | 'direct_stream' | 'youtube' | 'uploaded';
  videoUrl?: string; // Direct file URL or blob URL if uploaded
  durationSeconds: number; // e.g. 1320 (22 min)
  thumbnail: string;
  learningObjectives: string[];
  keyConcepts: string[];
  importantPoints: string[];
  formulas?: { label: string; formula: string; explanation: string }[];
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export type ResourceType = 'PDF' | 'PPT' | 'DOC' | 'WORKSHEET' | 'IMAGE';

export interface CbseSamplePaper {
  id: string;
  title: string;
  academicYear: string; // e.g. "2024-25"
  paperType: 'OFFICIAL_SQP' | 'MARKING_SCHEME' | 'MODEL_PAPER' | 'PREVIOUS_YEAR' | 'BLUEPRINT';
  subjectCode: string; // "417"
  maxMarks: number;
  timeAllowed: string;
  description: string;
  pdfUrl?: string;
  textContentMarkdown?: string;
  fileSize: string;
  pageCount: number;
  isPublished: boolean;
  uploadedAt: string;
}

export interface EducationalResource {
  id: string;
  unitId: string;
  lectureId?: string; // Optional if unit-wide
  title: string;
  description: string;
  resourceType: ResourceType;
  fileSize: string; // e.g. "2.4 MB"
  pageCount?: number;
  downloadUrl: string;
  textContentMarkdown?: string; // Content rendered in simulated PDF viewer
  displayOrder: number;
  isPublished: boolean;
  uploadedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Quiz {
  id: string;
  unitId: string;
  lectureId?: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  isPublished: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  lectureId?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  attemptedAt: string;
}

export interface LectureProgress {
  id: string;
  studentId: string;
  lectureId: string;
  lastWatchedSeconds: number;
  maxWatchedSeconds: number;
  totalDurationSeconds: number;
  percentageWatched: number;
  isCompleted: boolean;
  lastUpdated: string;
}

export interface BookmarkItem {
  id: string;
  studentId: string;
  targetId: string; // lectureId or resourceId
  type: 'LECTURE' | 'RESOURCE';
  title: string;
  subtitle: string;
  savedAt: string;
}

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  level: 'STARTER' | 'EXPLORER' | 'BUILDER' | 'ANALYST' | 'CREATOR';
  criteria: string;
}

export interface StudentBadge {
  badgeId: string;
  studentId: string;
  earnedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'LECTURE' | 'QUIZ' | 'NOTES' | 'GENERAL';
  isPinned: boolean;
  publishedAt: string;
  targetUnitId?: string;
}

export type SuggestionCategory =
  | 'LECTURE_REQUEST'
  | 'DOUBT_QUERY'
  | 'CBSE_PAPER_QUERY'
  | 'CURRICULUM_SUGGESTION'
  | 'APP_FEEDBACK'
  | 'OTHER';

export interface StudentSuggestionMessage {
  id: string;
  studentName: string;
  studentEmail?: string;
  rollNumber?: string;
  category: SuggestionCategory;
  unitTitle?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isStarred?: boolean;
  adminReply?: string;
  repliedAt?: string;
}
