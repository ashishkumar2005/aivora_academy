import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Star,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  Reply,
  Video,
  HelpCircle,
  FileQuestion,
  Lightbulb,
  Clock,
  User,
  Sparkles,
  Send,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { SuggestionCategory, StudentSuggestionMessage } from '../../types';

export const AdminSuggestions: React.FC = () => {
  const {
    suggestions,
    units,
    markSuggestionAsRead,
    toggleStarSuggestion,
    replyToSuggestion,
    deleteSuggestion,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);

  // Replying state
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Counts
  const totalCount = suggestions.length;
  const unreadCount = suggestions.filter((s) => !s.isRead).length;
  const lectureReqCount = suggestions.filter((s) => s.category === 'LECTURE_REQUEST').length;
  const doubtsCount = suggestions.filter(
    (s) => s.category === 'DOUBT_QUERY' || s.category === 'CBSE_PAPER_QUERY'
  ).length;

  // Filter logic
  const filteredSuggestions = suggestions.filter((msg) => {
    // Unread filter
    if (onlyUnread && msg.isRead) return false;
    // Starred filter
    if (onlyStarred && !msg.isStarred) return false;
    // Category filter
    if (selectedCategory !== 'all' && msg.category !== selectedCategory) return false;
    // Unit filter
    if (selectedUnit !== 'all') {
      if (!msg.unitTitle || !msg.unitTitle.toLowerCase().includes(selectedUnit.toLowerCase())) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.studentName.toLowerCase().includes(q);
      const matchRoll = msg.rollNumber?.toLowerCase().includes(q);
      const matchSub = msg.subject.toLowerCase().includes(q);
      const matchMsg = msg.message.toLowerCase().includes(q);
      const matchUnit = msg.unitTitle?.toLowerCase().includes(q);
      return matchName || matchRoll || matchSub || matchMsg || matchUnit;
    }
    return true;
  });

  const handleStartReply = (msg: StudentSuggestionMessage) => {
    setReplyingId(msg.id);
    setReplyText(msg.adminReply || '');
  };

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    replyToSuggestion(id, replyText.trim());
    setReplyingId(null);
    setReplyText('');
  };

  const getCategoryMeta = (cat: SuggestionCategory) => {
    switch (cat) {
      case 'LECTURE_REQUEST':
        return {
          label: 'Lecture Request',
          icon: Video,
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'DOUBT_QUERY':
        return {
          label: 'Syllabus Doubt',
          icon: HelpCircle,
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'CBSE_PAPER_QUERY':
        return {
          label: 'CBSE SQP Query',
          icon: FileQuestion,
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'CURRICULUM_SUGGESTION':
        return {
          label: 'Curriculum Suggestion',
          icon: Lightbulb,
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'APP_FEEDBACK':
        return {
          label: 'Feedback',
          icon: MessageSquare,
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      default:
        return {
          label: 'General Message',
          icon: MessageSquare,
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Student Communications
            </span>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Student Suggestions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review suggestions and feedback submitted by Class 10 students. Star, mark read, or send admin replies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                suggestions.filter((s) => !s.isRead).forEach((s) => markSuggestionAsRead(s.id, true));
              }}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setOnlyUnread(false);
            setOnlyStarred(false);
            setSelectedCategory('all');
          }}
          className={`bg-white rounded-xl p-4 border shadow-xs cursor-pointer transition-all ${
            !onlyUnread && !onlyStarred && selectedCategory === 'all'
              ? 'border-indigo-500 ring-2 ring-indigo-100'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Messages</span>
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">From all registered students</p>
        </div>

        <div
          onClick={() => {
            setOnlyUnread(!onlyUnread);
            setOnlyStarred(false);
          }}
          className={`bg-white rounded-xl p-4 border shadow-xs cursor-pointer transition-all ${
            onlyUnread
              ? 'border-rose-500 ring-2 ring-rose-100'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Unread</span>
            <EyeOff className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-1 font-mono">{unreadCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting teacher review</p>
        </div>

        <div
          onClick={() => {
            setSelectedCategory(selectedCategory === 'LECTURE_REQUEST' ? 'all' : 'LECTURE_REQUEST');
          }}
          className={`bg-white rounded-xl p-4 border shadow-xs cursor-pointer transition-all ${
            selectedCategory === 'LECTURE_REQUEST'
              ? 'border-indigo-500 ring-2 ring-indigo-100'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Lecture Requests</span>
            <Video className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1 font-mono">{lectureReqCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Students requesting video lectures</p>
        </div>

        <div
          onClick={() => {
            setSelectedCategory(selectedCategory === 'DOUBT_QUERY' ? 'all' : 'DOUBT_QUERY');
          }}
          className={`bg-white rounded-xl p-4 border shadow-xs cursor-pointer transition-all ${
            selectedCategory === 'DOUBT_QUERY'
              ? 'border-amber-500 ring-2 ring-amber-100'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Syllabus Doubts</span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">{doubtsCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Questions & SQP doubts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, topic or message..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Unit Filter Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 pr-8 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="all">All Units (1 - 7)</option>
                {units.map((u) => (
                  <option key={u.id} value={`Unit ${u.unitNumber}`}>
                    Unit {u.unitNumber}: {u.title.substring(0, 22)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Starred toggle */}
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                onlyStarred
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyStarred ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Starred</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Category:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'LECTURE_REQUEST', label: '🎥 Lecture Requests' },
            { id: 'DOUBT_QUERY', label: '❓ Doubts' },
            { id: 'CBSE_PAPER_QUERY', label: '📄 CBSE SQP' },
            { id: 'CURRICULUM_SUGGESTION', label: '💡 Suggestions' },
            { id: 'APP_FEEDBACK', label: '💬 Feedback' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Messages Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              {searchQuery || selectedCategory !== 'all' || selectedUnit !== 'all' || onlyUnread || onlyStarred
                ? 'No suggestions or lecture requests match your active filters. Try clearing the filters.'
                : 'No student suggestions or inquiries submitted yet. When students submit requests, they will show up here.'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedUnit !== 'all' || onlyUnread || onlyStarred) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedUnit('all');
                  setOnlyUnread(false);
                  setOnlyStarred(false);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredSuggestions.map((msg) => {
            const meta = getCategoryMeta(msg.category);
            const Icon = meta.icon;

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs ${
                  !msg.isRead
                    ? 'border-indigo-300 ring-1 ring-indigo-100'
                    : 'border-slate-200'
                } p-5 sm:p-6 space-y-4`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  {/* Student Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {msg.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{msg.studentName}</span>
                        {msg.rollNumber && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">
                            Roll #{msg.rollNumber}
                          </span>
                        )}
                        {!msg.isRead && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(msg.createdAt)}</span>
                        {msg.studentEmail && (
                          <>
                            <span>·</span>
                            <span>{msg.studentEmail}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Badges */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Category Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${meta.badgeClass}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{meta.label}</span>
                    </span>

                    {/* Star Toggle */}
                    <button
                      onClick={() => toggleStarSuggestion(msg.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title={msg.isStarred ? 'Unstar message' : 'Star message'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          msg.isStarred ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>

                    {/* Mark Read/Unread */}
                    <button
                      onClick={() => markSuggestionAsRead(msg.id, !msg.isRead)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        msg.isRead
                          ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          : 'text-indigo-600 hover:bg-indigo-50 font-semibold'
                      }`}
                      title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {/* Delete Message */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete message from ${msg.studentName}?`)) {
                          deleteSuggestion(msg.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Target Unit Badge if present */}
                {msg.unitTitle && (
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200">
                    <Layers className="w-3 h-3 text-indigo-600" />
                    <span className="font-semibold">{msg.unitTitle}</span>
                  </div>
                )}

                {/* Subject & Message Content */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {msg.subject}
                  </h3>
                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>

                {/* Admin Reply Section */}
                {msg.adminReply ? (
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-900 flex items-center gap-1">
                        <Reply className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Teacher / Admin Reply:</span>
                      </span>
                      {msg.repliedAt && (
                        <span className="text-[10px] text-indigo-600 font-mono">
                          {formatDate(msg.repliedAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed whitespace-pre-wrap">
                      {msg.adminReply}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleStartReply(msg)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                      >
                        Edit Reply
                      </button>
                    </div>
                  </div>
                ) : replyingId === msg.id ? (
                  <div className="p-4 bg-slate-50 border border-indigo-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                        <Reply className="w-3.5 h-3.5" />
                        <span>Write Reply to {msg.studentName}</span>
                      </span>
                      <button
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText('');
                        }}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response here (e.g., 'Video lecture on this topic will be uploaded tomorrow' or answer their doubt)..."
                      rows={3}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(msg.id)}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-2xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Reply to Student</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {!msg.isRead ? 'Click mark read or reply to resolve.' : 'Reviewed.'}
                    </span>
                    <button
                      onClick={() => handleStartReply(msg)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply to Student</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
