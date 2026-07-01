import { AvailableQuizStatus } from "../models/student-quiz.model";

export type MatchAttemptDetailStatus = 'passed' | 'failed';
export type MatchAttemptSummaryStatus = MatchAttemptDetailStatus | 'in-progress';

export enum MatchStatus {
  Active = 'Active',
  Pending = 'Pending',
  Expired = 'Expired',
}

export type MatchMode = 'Solo' | 'Multiple' | 'Exam';

export interface AvailableMatchResponse {
  id: string;
  title: string;
  courseName: string;
  createdAt: string;
  questionCount: number;
  professorName: string;
  duration: number;
}

export interface MatchAttemptSummaryResponse {
  id: string;
  title: string;
  courseName: string;
  completedAt: string | null;
  score: number;
  status: MatchAttemptSummaryStatus;
  duration: number;
}

export interface MatchAttemptDetailOptionResponse {
  id: string;
  description: string;
  isCorrect: boolean;
}

export interface MatchAttemptDetailQuestionResponse {
  questionId: string;
  content: string;
  selectedOptionId: string;
  isCorrect: boolean;
  options: MatchAttemptDetailOptionResponse[];
}

export interface MatchAttemptDetailResponse {
  id: string;
  score: number;
  status: MatchAttemptDetailStatus;
  questions: MatchAttemptDetailQuestionResponse[];
}

export interface CreatePlayRequest {
  matchId: string;
}

export interface PlayQuestionOptionResponse {
  id: string;
  label: string;
}

export interface PlayQuestionResponse {
  id: string;
  statement: string;
  options: PlayQuestionOptionResponse[];
}

export interface CreatePlayResponse {
  matchId: string;
  matchAttemptId: string;
  questions: PlayQuestionResponse[];
}

export interface SubmitMatchAttemptAnswerRequest {
  questionId: string;
  selectedOptionId: string;
  answeredAt: string;
}

export interface SubmitMatchAttemptRequest {
  answers: SubmitMatchAttemptAnswerRequest[];
}

export interface SubmittedQuestionResultResponse {
  id: string;
  number: number;
  text: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
}

export interface SubmitMatchAttemptResponse {
  attemptId: string;
  scorePercentage: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  questions: SubmittedQuestionResultResponse[];
}

export interface MatchResponse {
  id: string;
  title: string;
  courseName: string;
  questionCount: number;
  professorName: string;
  duration: number;
  status: AvailableQuizStatus;
  score: number;
  completedAtLabel: string;
}

export interface MatchFilters {
  code?: string;
  status?: MatchStatus;
  mode?: MatchMode;
  courseId?: string;
  quizId?: string;
}
