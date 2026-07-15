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
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  enabledFrom: string;
  enabledUntil: string;
}

export type ExamOrigin = 'ai_generated' | 'manually_created';

export interface CreateExamRequest {
  title: string;
  description: string;
  origin: ExamOrigin;
  questionIds: string[];
  classIds: string[];
  config: ExamConfig;
}

export type ExamStatus = 'draft' | 'published';

export interface Exam {
  id: string;
  title: string;
  description: string;
  status: ExamStatus;
  questionIds: string[];
  createdAt: string;
}

export type GradeStatus = 'InProgress' | 'Completed' | 'Timeout';

export interface Grade {
  id: string;
  nickname: string;
  status: GradeStatus;
  score: number;
  userId: string;
  matchId: string;
  otherAttempts: Attempt[];
}

export interface Attempt {
  id: string;
  nickname: string;
  status: GradeStatus;
  score: number;
}

export interface Match {
  id: string;
  title: string;
  courseName: string;
  questionCount: number;
  professorName: string;
  duration: number;
}
