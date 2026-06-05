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

export interface StudentQuizDashboard {
  availableQuizzes: AvailableQuiz[];
  recentQuizzes: RecentQuiz[];
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
  title: string;
  subtitle: string;
  professorName: string;
  questionCount: number;
  timeLimitSeconds: number;
  questions: QuizQuestion[];
}
