import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  Eye,
  BarChart2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { StudentProfile } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminStudents: React.FC = () => {
  const { allStudents, publishedLectures } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const filteredStudents = allStudents.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.school.toLowerCase().includes(q)
    );
  });

  const getStudentActivity = (student: StudentProfile) => {
    const progressList = DataService.getProgressForStudent(student.id);
    const quizAttempts = DataService.getAttemptsForStudent(student.id);
    return { progressList, quizAttempts };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Registered Students Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor student enrollment, school affiliations, course progress percentages, and last learning activities.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or roll #..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">School</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Course Progress</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">View Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                        {std.avatarUrl ? (
                          <img src={std.avatarUrl} alt={std.fullName} className="w-full h-full object-cover" />
                        ) : (
                          std.fullName[0]
                        )}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{std.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                    #{std.rollNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    Class {std.classNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {std.school}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(std.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${std.courseProgress}%` }}
                          className="h-full bg-indigo-600 rounded-full"
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{std.courseProgress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(std.lastActive).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(std)}
                      className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Progress Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudent.fullName}</h3>
                <p className="text-xs text-slate-300">
                  Roll #{selectedStudent.rollNumber} · Class {selectedStudent.classNumber} · {selectedStudent.school}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Progress Summary Card */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-900 uppercase">
                    Overall Curriculum Progress
                  </span>
                  <p className="text-2xl font-extrabold text-indigo-700 font-mono mt-0.5">
                    {selectedStudent.courseProgress}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-indigo-900 uppercase">
                    Learning Streak
                  </span>
                  <p className="text-lg font-bold text-amber-600 font-mono mt-0.5">
                    🔥 {selectedStudent.learningStreakDays} Days
                  </p>
                </div>
              </div>

              {/* Watched Lectures Log */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Lectures Watched History</h4>
                {(() => {
                  const { progressList } = getStudentActivity(selectedStudent);
                  if (progressList.length === 0) {
                    return <p className="text-slate-400">No lectures watched yet.</p>;
                  }
                  return (
                    <div className="space-y-1.5">
                      {progressList.map((p) => {
                        const lec = publishedLectures.find((l) => l.id === p.lectureId);
                        return (
                          <div
                            key={p.id}
                            className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-slate-800">
                              {lec ? `Lecture ${lec.lectureNumber}: ${lec.title}` : p.lectureId}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-mono ${
                                p.isCompleted ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {p.isCompleted ? 'Completed' : `${p.percentageWatched}%`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Quiz Attempts */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Quiz Performance</h4>
                {(() => {
                  const { quizAttempts } = getStudentActivity(selectedStudent);
                  if (quizAttempts.length === 0) {
                    return <p className="text-slate-400">No quizzes taken yet.</p>;
                  }
                  return (
                    <div className="space-y-1.5">
                      {quizAttempts.map((att) => (
                        <div
                          key={att.id}
                          className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-medium text-slate-800 block">
                              Quiz ID: {att.quizId}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(att.attemptedAt).toLocaleString()}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {att.score} / {att.totalQuestions} ({Math.round(att.percentage)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
