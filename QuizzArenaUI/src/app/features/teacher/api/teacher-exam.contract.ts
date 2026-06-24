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
  shuffle: boolean;
  enabledFrom: string;
  enabledUntil: string;
}

export interface CreateExamRequestBody {
  title: string;
  description: string;
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
