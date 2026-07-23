import { AvailableQuizStatus } from "../models/student-quiz.model";

export type MatchAttemptDetailStatus = 'passed' | 'failed';
export type MatchAttemptSummaryStatus = MatchAttemptDetailStatus | 'in-progress';

export type MatchStatus = 'Active' | 'Pending' | 'Expired';

export type MatchMode = 'Solo' | 'Multiple' | 'Exam';
export type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'TrueFalse';

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
  startedAt: string;
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
  questionType?: QuestionType;
  selectedOptionIds: string[];
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
  questionType?: QuestionType;
  options: PlayQuestionOptionResponse[];
}

export interface CreatePlayResponse {
  matchId: string;
  matchAttemptId: string;
  questions: PlayQuestionResponse[];
}

export interface SubmitMatchAttemptAnswerRequest {
  questionId: string;
  selectedOptionIds: string[];
  answeredAt: string;
}

export interface SubmitMatchAttemptRequest {
  answers: SubmitMatchAttemptAnswerRequest[];
}

export interface TrackExamAnswerRequest {
  selectedOptionIds: string[];
}

export interface TrackExamAnswerResponse {
  answeredQuestions: number;
  totalQuestions: number;
}

export interface CompletedExamAnswerResponse {
  id: string;
  number: number;
  text: string;
  selectedOptionIds: string[];
}

export interface CompleteExamAttemptResponse {
  attemptId: string;
  answeredQuestions: number;
  totalQuestions: number;
  answers: CompletedExamAnswerResponse[];
}

export interface SubmittedQuestionResultResponse {
  id: string;
  number: number;
  text: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
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
}

export interface MatchFilters {
  code?: string;
  status: MatchStatus;
  mode?: MatchMode;
  courseId?: string;
  quizId?: string;
}
