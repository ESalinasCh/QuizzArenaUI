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
<<<<<<< HEAD
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
=======
  shuffle: boolean;
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  enabledFrom: string;
  enabledUntil: string;
}

<<<<<<< HEAD
export type ExamOrigin = 'ai_generated' | 'manually_created';

export interface CreateExamRequest {
  title: string;
  description: string;
  origin: ExamOrigin;
=======
export interface CreateExamRequest {
  title: string;
  description: string;
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
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
