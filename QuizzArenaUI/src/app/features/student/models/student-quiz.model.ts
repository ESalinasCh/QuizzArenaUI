import { MatchStatus } from "../api/student-quiz.contract";

export type AvailableQuizStatus = 'available' | 'new';
export type RecentQuizStatus = 'passed' | 'warning';

export interface AvailableQuiz {
  id: string;
  title: string;
  questionCount: number;
  status: AvailableQuizStatus;
}

export interface RecentQuiz {
  id: string;
  title: string;
  score: number;
  completedAtLabel: string;
  status: RecentQuizStatus;
}

export interface Match {
  id: string;
  title: string;
  courseName: string;
  questionCount: number;
  professorName: string;
  duration: number;
  status: AvailableQuizStatus;
}

export interface StudentQuizDashboard {
  availableQuizzes: AvailableQuiz[];
  recentQuizzes: RecentQuiz[];
}

export interface AttemptHistoryCard {
  id: string;
  title: string;
  subtitle: string;
  completedAtLabel: string;
  durationLabel: string;
  scoreLabel: string;
  statusLabel: string;
  statusVariant: 'success' | 'warning' | 'danger';
}

export interface QuizQuestionOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  statement: string;
  options: QuizQuestionOption[];
}

export interface StudentQuizStart {
  id: string;
  matchId?: string;
  attemptId?: string;
  title: string;
  subtitle: string;
  professorName: string;
  questionCount: number;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface StudentQuizReviewQuestion {
  id: string;
  number: number;
  text: string;
  selectedAnswerLabel: string;
  isCorrect: boolean;
}

export interface StudentQuizReview {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  questions: StudentQuizReviewQuestion[];
}

export interface StudentQuizResultSummary {
  attemptId: string;
  title: string;
  subtitle: string;
  scorePercentage: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  message: string;
}

export interface FilterStatusOption {
  label: string;
  value: MatchStatus;
}
