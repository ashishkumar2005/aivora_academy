import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../../types';
import { useAuth } from '../../lib/authContext';
import { DataService } from '../../lib/storage';

interface QuizCardProps {
  quiz: Quiz;
  lectureId?: string;
  onCompleted?: (score: number, total: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, lectureId, onCompleted }) => {
  const { currentStudent } = useAuth();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);

  const questions = quiz.questions || [];
  const currentQ: QuizQuestion | undefined = questions[currentQuestionIdx];

  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!confirm('You have not answered all questions yet. Are you sure you want to submit?')) {
        return;
      }
    }
    const score = calculateScore();
    const total = questions.length;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    if (currentStudent) {
      DataService.recordQuizAttempt({
        quizId: quiz.id,
        studentId: currentStudent.id,
        lectureId: lectureId,
        score,
        totalQuestions: total,
        percentage,
        userAnswers: selectedAnswers,
      });
    }

    setIsSubmitted(true);
    if (onCompleted) onCompleted(score, total);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500 text-sm">
        No quiz questions available for this lecture yet.
      </div>
    );
  }

  const score = calculateScore();
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Quiz Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{quiz.title}</h3>
            <p className="text-xs text-slate-400">
              {questions.length} Questions · CBSE Class 10 Pattern · Instant Feedback
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-white">Score: {score} / {total} ({percentage}%)</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-mono">
            Answered {Object.keys(selectedAnswers).length} of {questions.length}
          </span>
        )}
      </div>

      {/* Main Quiz Content */}
      <div className="p-5 sm:p-6">
        {!isSubmitted ? (
          <div>
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <div className="flex items-center gap-1">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-6 h-6 rounded text-xs font-mono transition-colors cursor-pointer ${
                      currentQuestionIdx === idx
                        ? 'bg-indigo-600 text-white'
                        : selectedAnswers[questions[idx].id]
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question */}
            {currentQ && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-slate-900 leading-snug">
                  {currentQ.question}
                </h4>

                {/* Option Choices */}
                <div className="space-y-2.5">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const optionText = currentQ[`option${optKey}` as keyof QuizQuestion] as string;
                    const isSelected = selectedAnswers[currentQ.id] === optKey;

                    return (
                      <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, optKey)}
                        className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 cursor-pointer text-sm ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-medium shadow-xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs shrink-0 font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {optKey}
                        </span>
                        <span className="flex-1 leading-snug">{optionText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                    disabled={currentQuestionIdx === 0}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer px-3 py-1.5 rounded-md"
                  >
                    Previous
                  </button>

                  {currentQuestionIdx < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIdx((p) => Math.min(questions.length - 1, p + 1))}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results View with Explanations */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {percentage >= 75 ? '🎉 Outstanding Work!' : 'Good Effort! Keep Reviewing'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  You scored <strong className="text-slate-900">{score}</strong> out of <strong className="text-slate-900">{total}</strong> questions correctly ({percentage}%).
                </p>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            </div>

            {/* Answer Breakdown with Explanations */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Answers & CBSE Explanations
              </h5>

              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border text-xs space-y-2.5 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1 flex-1">
                        <p className="font-semibold text-slate-900 text-sm">
                          Q{idx + 1}. {q.question}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span>
                            Your Answer:{' '}
                            <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                              {userAnswer ? `Option ${userAnswer}` : 'Unanswered'}
                            </strong>
                          </span>
                          {!isCorrect && (
                            <span>
                              Correct Answer:{' '}
                              <strong className="text-emerald-700">Option {q.correctAnswer}</strong>
                            </span>
                          )}
                        </div>
                        {q.explanation && (
                          <div className="mt-2 p-2.5 bg-white rounded border border-slate-200/80 text-slate-700 text-xs leading-relaxed">
                            <strong className="text-slate-900">Explanation: </strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
