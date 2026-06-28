export interface ClassSourceResponse {
  id: string;
  name: string;
}

export interface QuestionResponse {
  id: string;
  text: string;
  options: string[];
  sourceId: string;
  sourceName: string;
}

export interface ExamConfigBody {
  durationMinutes: number;
  maxRetries: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  enabledFrom: string;
  enabledUntil: string;
}

export type ExamOriginBody = 'ai_generated' | 'manually_created';

export interface CreateExamRequestBody {
  title: string;
  description: string;
  origin: ExamOriginBody;
  questionIds: string[];
  config: ExamConfigBody;
}

export interface ExamResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  questionIds: string[];
  createdAt: string;
}
