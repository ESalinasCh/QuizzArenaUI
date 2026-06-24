export interface ClassSource {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  sourceId: string;
  sourceName: string;
}

export interface ExamConfig {
  durationMinutes: number;
  maxRetries: number;
  shuffle: boolean;
  enabledFrom: string;
  enabledUntil: string;
}

export interface CreateExamRequest {
  title: string;
  description: string;
  questionIds: string[];
  config: ExamConfig;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  questionIds: string[];
  createdAt: string;
}
