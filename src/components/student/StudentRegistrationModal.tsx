import React, { useState } from 'react';
import { Sparkles, Shield, User, Hash, School, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerStudent } = useAuth();
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classNumber, setClassNumber] = useState('10');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !rollNumber.trim() || !school.trim()) {
      setError('Please fill in your Full Name, Roll Number, and School.');
      return;
    }
    setError('');

    registerStudent({
      fullName: fullName.trim(),
      rollNumber: rollNumber.trim(),
      classNumber: classNumber.trim(),
      school: school.trim(),
      email: email.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Brand Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/60 border border-indigo-400/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Welcome to AI Learning Hub
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-xs mx-auto">
            Your AI learning journey starts here.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-[11px] font-medium border border-indigo-400/20">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Class 10 CBSE Curriculum (Code 417)</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Kumar"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 24"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class <span className="text-rose-500">*</span>
              </label>
              <select
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors bg-white font-medium text-slate-800"
              >
                <option value="10">Class 10 (Current Syllabus)</option>
                <option value="9">Class 9 (Foundations)</option>
                <option value="8">Class 8</option>
                <option value="7">Class 7</option>
                <option value="6">Class 6</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              School Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. ABC Public School"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Student Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@school.edu.in"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Architecture Note on Strong Auth */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-[11px] text-slate-500">
            <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p>
              <strong>Architecture Note:</strong> Name + Roll Number serves as quick entry. The backend schema is fully configured for Supabase OTP/Password authentication.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              Start Learning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
