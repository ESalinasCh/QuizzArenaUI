import {
  AvailableMatchResponse,
  CompleteExamAttemptResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  QuestionType,
  SubmitMatchAttemptResponse,
} from './student-quiz.contract';
import {
  AttemptHistoryCard,
  AvailableQuiz,
  RecentQuiz,
  RecentQuizStatus,
  StudentQuizDashboard,
  StudentExamResult,
  StudentMatchSessionInfo,
  StudentQuizReview,
  StudentQuizResultSummary,
  StudentQuizStart,
} from '../models/student-quiz.model';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const NEW_MATCH_THRESHOLD_DAYS = 2;
const GRADE_HISTORY_PASSING_SCORE = 50;
const DEFAULT_QUESTION_TYPE: QuestionType = 'SingleChoice';

export function mapStudentDashboardResponse(
  availableMatches: AvailableMatchResponse[],
  matchAttempts: MatchAttemptSummaryResponse[],
): StudentQuizDashboard {
  return {
    availableQuizzes: availableMatches.map(mapAvailableMatchResponse),
    recentQuizzes: matchAttempts.map(mapMatchAttemptSummaryResponse),
  };
}

export function mapAvailableMatchResponse({
  id,
  title,
  questionCount,
  createdAt,
  mode,
  duration,
  attemptsAmount,
  attemptsUsed,
  hasActiveAttempt,
}: AvailableMatchResponse): AvailableQuiz {
  return {
    id,
    title,
    questionCount,
    status: getAvailableMatchStatus(createdAt),
    mode,
    duration,
    attemptsAmount,
    attemptsUsed,
    hasActiveAttempt,
  };
}

export function mapMatchSessionInfoResponse({
  id,
  title,
  courseName,
  professorName,
  questionCount,
  duration,
}: AvailableMatchResponse): StudentMatchSessionInfo {
  return {
    id,
    title,
    subtitle: courseName,
    professorName,
    questionCount,
    timeLimitMinutes: duration,
  };
}

export function mapMatchAttemptSummaryResponse({ id, title, score, completedAt, status }: MatchAttemptSummaryResponse): RecentQuiz {
  return {
    id,
    title,
    score,
    completedAtLabel: completedAt
      ? formatRelativeDate(completedAt)
      : $localize`:Recent quiz in progress label:Completed`,
    status: mapRecentQuizStatus(status),
  };
}

export function mapAttemptHistoryCardResponse(
  { id, title, courseName, startedAt, duration, score }: MatchAttemptSummaryResponse,
): AttemptHistoryCard {
  return {
    id,
    title,
    subtitle: courseName,
    completedAtLabel: formatDisplayDate(startedAt),
    durationLabel: $localize`:Attempt history duration label:${duration}:duration: min`,
    scoreLabel: `${score}%`,
    statusLabel: mapAttemptHistoryStatusLabel(score),
    statusVariant: mapAttemptHistoryStatusVariant(score),
  };
}

export function mapQuizStartResponse(
  { id, title, courseName, professorName, questionCount, duration }: AvailableMatchResponse,
  { matchId, matchAttemptId: attemptId, questions, totalQuestions, answeredQuestions }: CreatePlayResponse,
): StudentQuizStart {
  return {
    id,
    matchId,
    attemptId,
    title,
    subtitle: courseName,
    professorName,
    questionCount,
    timeLimitMinutes: duration,
    answeredQuestions,
    totalQuestions,
    questions: questions.map(({ id, statement, questionType, options }) => ({
      id,
      statement,
      questionType: questionType ?? DEFAULT_QUESTION_TYPE,
      options: options.map(({ id, label }) => ({ id, label })),
    })),
  };
}

export function mapQuizStartFromSessionInfoResponse(
  { id, title, subtitle, professorName, questionCount, timeLimitMinutes }: StudentMatchSessionInfo,
  { matchId, matchAttemptId: attemptId, questions, totalQuestions, answeredQuestions }: CreatePlayResponse,
): StudentQuizStart {
  return {
    id,
    matchId,
    attemptId,
    title,
    subtitle,
    professorName,
    questionCount,
    timeLimitMinutes,
    answeredQuestions,
    totalQuestions,
    questions: questions.map(({ id, statement, questionType, options }) => ({
      id,
      statement,
      questionType: questionType ?? DEFAULT_QUESTION_TYPE,
      options: options.map(({ id, label }) => ({ id, label })),
    })),
  };
}
export function mapMatchAttemptDetailResponse(
  matchAttempt: MatchAttemptDetailResponse,
  { title, subtitle }: Pick<StudentQuizReview, 'title' | 'subtitle'>,
): StudentQuizReview {
  return {
    title,
    subtitle,
    matchAttempt,
  };
}

export function mapSubmitMatchAttemptResponse(
  { attemptId, scorePercentage, correctCount, incorrectCount, totalQuestions }: SubmitMatchAttemptResponse,
  { title, subtitle }: Pick<StudentQuizResultSummary, 'title' | 'subtitle'>,
): StudentQuizResultSummary {
  return {
    attemptId,
    title,
    subtitle,
    scorePercentage,
    correctCount,
    incorrectCount,
    totalQuestions,
    message: $localize`:Student quiz result default message:Result submitted`,
  };
}

export function mapCompleteExamAttemptResponse(
  { attemptId, answeredQuestions, totalQuestions, answers }: CompleteExamAttemptResponse,
  { title, subtitle }: Pick<StudentExamResult, 'title' | 'subtitle'>,
): StudentExamResult {
  return {
    attemptId,
    title,
    subtitle,
    answeredQuestions,
    totalQuestions,
    answers: answers.map(({ id, number, text, selectedOptionIds }) => ({
      id,
      number,
      text,
      selectedOptionIds,
    })),
  };
}

export function mapStudentMatchesResponse(
  availableExams: AvailableMatchResponse[],
): AvailableQuiz[] {
  return availableExams.map(mapAvailableMatchResponse);
}

function mapRecentQuizStatus(status: MatchAttemptSummaryResponse['status']): RecentQuizStatus {
  return status === 'completed' ? 'passed' : 'warning';
}

function mapAttemptHistoryStatusLabel(score: number): string {
  return score > GRADE_HISTORY_PASSING_SCORE
    ? $localize`:Attempt history passed status label:Passed`
    : $localize`:Attempt history failed status label:Failed`;
}

function mapAttemptHistoryStatusVariant(score: number): AttemptHistoryCard['statusVariant'] {
  return score > GRADE_HISTORY_PASSING_SCORE ? 'success' : 'danger';
}

function getAvailableMatchStatus(createdAt: string): AvailableQuiz['status'] {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInDays = diffInMs / MILLISECONDS_PER_DAY;

  return diffInDays <= NEW_MATCH_THRESHOLD_DAYS ? 'new' : 'available';
}

function formatDisplayDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatRelativeDate(value: string): string {
  const completedAt = new Date(value);
  const now = new Date();
  const diffInMs = now.getTime() - completedAt.getTime();
  const diffInDays = Math.max(1, Math.round(diffInMs / MILLISECONDS_PER_DAY));

  return $localize`:Recent quiz completed relative date:${diffInDays}:days: days ago`;
}
