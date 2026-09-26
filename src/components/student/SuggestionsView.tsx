import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import suggestionBoxImg from '../../assets/images/ai_suggestion_box_1790406653830.jpg';

export const SuggestionsView: React.FC = () => {
  const { currentStudent, suggestions, sendSuggestion } = useAuth();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter messages sent by this student
  const myMessages = suggestions.filter(
    (s) =>
      s.studentName.toLowerCase() === (currentStudent?.fullName || 'Student').toLowerCase() ||
      (currentStudent?.rollNumber && s.rollNumber === currentStudent.rollNumber)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return;
    }

    sendSuggestion({
      studentName: currentStudent?.fullName || 'Student',
      studentEmail: currentStudent?.email || undefined,
      rollNumber: currentStudent?.rollNumber || undefined,
      category: 'CURRICULUM_SUGGESTION',
      subject: subject.trim(),
      message: message.trim(),
    });

    setIsSubmitted(true);
    setSubject('');
    setMessage('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-200">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Direct Admin Communication</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Suggestions
          </h1>

          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Have a suggestion, feedback, or ideas for the course? Write directly to the administration. Every suggestion is reviewed in the Admin Portal.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-indigo-500/5 rounded-full pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Suggestion Form Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          {/* Box Header with Illustration Image */}
          <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative group">
            <img
              src={suggestionBoxImg}
              alt="AIVORA AI Suggestion Box"
              className="w-full h-44 object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Student Suggestion Box
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Share Your Ideas & Feedback
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Submit a Suggestion</h2>
              <p className="text-xs text-slate-500">Delivered directly to the Admin Portal inbox</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Monitored</span>
            </span>
          </div>

          {isSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-950">Thank you! Your suggestion has been submitted.</p>
                <p className="text-emerald-800 mt-0.5">
                  The Admin will review your message in the Admin Portal. Check your suggestion history on the right for updates.
                </p>
              </div>
            </div>
          )}

          {/* Form with ONLY Subject and Message fields */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Subject field only */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is your suggestion about? (e.g. Add more practice questions for Unit 3)"
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Message field only */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your suggestion or feedback in detail here..."
                className="w-full p-3.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Submitting as: <strong className="text-slate-700">{currentStudent?.fullName || 'Student'}</strong>
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Suggestion</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: History & Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Notice Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>How Suggestions Work</span>
            </div>
            <h3 className="text-lg font-bold">Your voice shapes the academy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every suggestion you send reaches the teacher and course administrators directly in their Admin Portal.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Delivered instantly to Admin inbox</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Reviewed by course administrators</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Admin replies appear below your suggestion</span>
              </li>
            </ul>
          </div>

          {/* Student's Past Suggestions History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Your Suggestions History</span>
              <span className="text-xs text-indigo-600 font-mono font-medium">
                {myMessages.length} {myMessages.length === 1 ? 'Entry' : 'Entries'}
              </span>
            </h3>

            {myMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No suggestions submitted yet</p>
                <p className="text-[11px] text-slate-400">Your sent suggestions will appear here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {myMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-2 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Suggestion
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{msg.subject}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    {/* Admin Reply Card if present */}
                    {msg.adminReply ? (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Admin Reply:</span>
                        </span>
                        <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                          {msg.adminReply}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>Submitted · Under Admin Review</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
