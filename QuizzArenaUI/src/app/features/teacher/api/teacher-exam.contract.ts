export type QuizStatus = 'draft' | 'published' | 'archived';
export type QuizOrigin = 'AiGenerated' | 'ManuallyCreated';

export interface ClassSourceResponse {
  id: string;
  name: string;
}

export interface QuestionResponse {
  id: string;
  content: string;
  processingJobId: string;
  status: string;
}

export interface CreateExamRequestBody {
  title: string;
  description: string;
  questionIds: string[];
}

export interface CreateQuizResponseBody {
  id: string;
  title: string;
  description: string;
  status: string;
  questions: { questionId: string; position: number; valueScore: number }[];
}

export interface CreateMatchRequestBody {
  quizId: string;
  courseId: string;
  startedAt: string;
  finishedAt: string;
  questionsAmount: number;
  timeMinutes: number;
  attemptsAmount: number;
  shuffleQuestion: boolean;
  shuffleOptions: boolean;
}

export interface UpdateMatchRequestBody {
  id: string;
  quizId: string;
  courseId: string;
  startedAt: string;
  finishedAt: string;
  questionsAmount: number;
  timeMinutes: number;
  attemptsAmount: number;
  shuffleQuestion: boolean;
  shuffleOptions: boolean;
}

export interface ExamResponse {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  questionIds: string[];
  createdAt: string;
  questions?: { questionId?: string; id?: string }[];
}

export interface QuestionsOfQuizResponseAsExams {
  questionId: string;
  position: number;
  valueScore: number;
  content: string;
  type: string;
}

export interface QuizResponseAsExams {
  id: string;
  title: string;
  description: string;
  status: QuizStatus;
  origin: QuizOrigin;
  questions: QuestionsOfQuizResponseAsExams[];
}

export interface SaveMatchResponse {
  id: string;
  quizId: string;
  courseId: string;
  status: string;
}