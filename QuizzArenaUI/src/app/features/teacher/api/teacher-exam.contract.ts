<<<<<<< HEAD
﻿export interface ClassSourceResponse {
=======
export interface ClassSourceResponse {
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
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
export type ExamOriginBody = 'ai_generated' | 'manually_created';

export interface CreateExamRequestBody {
  title: string;
  description: string;
  origin: ExamOriginBody;
=======
export interface CreateExamRequestBody {
  title: string;
  description: string;
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
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
