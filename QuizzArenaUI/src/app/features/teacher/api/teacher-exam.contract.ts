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
}
