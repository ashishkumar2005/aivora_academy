import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { Quiz, QuizQuestion } from '../../types';
import { DataService } from '../../lib/storage';

export const AdminQuizzes: React.FC = () => {
  const { units, lectures, quizzes, refreshState } = useAuth();
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quiz Form fields
  const [targetUnitId, setTargetUnitId] = useState<string>(units[0]?.id || 'unit-1');
  const [targetLectureId, setTargetLectureId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10);
  const [isPublished, setIsPublished] = useState(true);

  // Questions inside this quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}-1`,
      question: 'What is the formula for calculating Precision?',
      optionA: 'TP / (TP + FN)',
      optionB: 'TP / (TP + FP)',
      optionC: '(TP + TN) / Total',
      optionD: 'TN / (TN + FP)',
      correctAnswer: 'B',
      explanation: 'Precision measures correctness among positive predictions: TP / (TP + FP).',
    },
  ]);

  const handleOpenCreate = () => {
    setEditingQuiz(null);
    setTargetUnitId(units[0]?.id || 'unit-1');
    setTargetLectureId(lectures[0]?.id || '');
    setTitle('');
    setDescription('');
    setTimeLimitMinutes(10);
    setIsPublished(true);
    setQuestions([
      {
        id: `q-${Date.now()}-1`,
        question: 'Which metric should be prioritized in high-stakes medical cancer detection?',
        optionA: 'Precision',
        optionB: 'Recall',
        optionC: 'Accuracy alone',
        optionD: 'Specificity only',
        correctAnswer: 'B',
        explanation: 'In medical diagnosis, missing a sick patient (False Negative) is fatal; therefore Recall must be prioritized.',
      },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Quiz) => {
    setEditingQuiz(q);
    setTargetUnitId(q.unitId);
    setTargetLectureId(q.lectureId || '');
    setTitle(q.title);
    setDescription(q.description);
    setTimeLimitMinutes(q.timeLimitMinutes || 10);
    setIsPublished(q.isPublished);
    setQuestions(q.questions || []);
    setIsModalOpen(true);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${questions.length + 1}`,
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length === 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const handleSave = (publishState: boolean) => {
    if (!title.trim()) {
      alert('Please enter a Quiz Title.');
      return;
    }

    const newQuiz: Quiz = {
      id: editingQuiz ? editingQuiz.id : `quiz-${Date.now()}`,
      unitId: targetUnitId,
      lectureId: targetLectureId || undefined,
      title: title.trim(),
      description: description.trim(),
      timeLimitMinutes: Number(timeLimitMinutes),
      isPublished: publishState,
      questions,
    };

    DataService.upsertQuiz(newQuiz);
    refreshState();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this quiz?')) {
      DataService.deleteQuiz(id);
      refreshState();
    }
  };

  const handleTogglePublish = (q: Quiz) => {
    DataService.upsertQuiz({ ...q, isPublished: !q.isPublished });
    refreshState();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quizzes & Assessment Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure CBSE Class 10 multiple-choice questions, correct answers, and automated board explanations.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Quiz</span>
        </button>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Quiz Title</th>
                <th className="py-3 px-4">Target Unit / Lecture</th>
                <th className="py-3 px-4">Questions Count</th>
                <th className="py-3 px-4">Time Limit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quizzes.map((quiz) => {
                const parentUnit = units.find((u) => u.id === quiz.unitId);
                const parentLecture = lectures.find((l) => l.id === quiz.lectureId);

                return (
                  <tr key={quiz.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 text-sm">{quiz.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{quiz.description}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold block">Unit {parentUnit?.unitNumber}</span>
                      <span className="text-[11px] text-slate-400">
                        {parentLecture ? `Lecture ${parentLecture.lectureNumber}: ${parentLecture.title}` : 'Unit Assessment'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {quiz.questions?.length || 0} Questions
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {quiz.timeLimitMinutes} min
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(quiz)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                          quiz.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {quiz.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{quiz.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(quiz)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                        title="Edit Quiz"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingQuiz ? 'Edit Quiz Assessment' : 'Create New Assessment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Unit
                  </label>
                  <select
                    value={targetUnitId}
                    onChange={(e) => setTargetUnitId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.unitNumber}: {u.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Lecture
                  </label>
                  <select
                    value={targetLectureId}
                    onChange={(e) => setTargetLectureId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">Unit Assessment</option>
                    {lectures.map((l) => (
                      <option key={l.id} value={l.id}>
                        Lecture {l.lectureNumber}: {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quiz Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quick Check: Precision & Recall Mastery"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Instructions for students..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg leading-relaxed"
                />
              </div>

              {/* Questions Builder Section */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">
                          Question {qIdx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-slate-400 hover:text-rose-600 text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                        placeholder="Enter the question text..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <div key={opt} className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {opt}
                            </span>
                            <input
                              type="text"
                              value={q[`option${opt}` as keyof QuizQuestion] as string}
                              onChange={(e) =>
                                handleQuestionChange(qIdx, `option${opt}` as keyof QuizQuestion, e.target.value)
                              }
                              placeholder={`Option ${opt}`}
                              className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Correct Answer:
                          </label>
                          <select
                            value={q.correctAnswer}
                            onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white font-bold text-emerald-700"
                          >
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            CBSE Explanation:
                          </label>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                            placeholder="Why this answer is correct..."
                            className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
              >
                Publish Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
