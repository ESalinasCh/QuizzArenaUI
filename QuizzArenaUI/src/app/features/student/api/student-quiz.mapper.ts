import {
  AvailableMatchResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  SubmitMatchAttemptResponse,
} from './student-quiz.contract';
import {
  AvailableQuiz,
  RecentQuiz,
  RecentQuizStatus,
  StudentQuizDashboard,
  StudentQuizReview,
  StudentQuizResultSummary,
  StudentQuizStart,
} from '../models/student-quiz.model';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const NEW_MATCH_THRESHOLD_DAYS = 2;

export function mapStudentDashboardResponse(
  availableMatches: AvailableMatchResponse[],
  matchAttempts: MatchAttemptSummaryResponse[],
): StudentQuizDashboard {
  return {
    availableQuizzes: availableMatches.map(mapAvailableMatchResponse),
    recentQuizzes: matchAttempts.map(mapMatchAttemptSummaryResponse),
  };
}

export function mapAvailableMatchResponse(response: AvailableMatchResponse): AvailableQuiz {
  return {
    id: response.id,
    title: response.title,
    questionCount: response.questionCount,
    status: getAvailableMatchStatus(response.createdAt),
  };
}

export function mapMatchAttemptSummaryResponse(response: MatchAttemptSummaryResponse): RecentQuiz {
  return {
    id: response.id,
    title: response.title,
    score: response.score,
    completedAtLabel: response.completedAt
      ? formatRelativeDate(response.completedAt)
      : $localize`:Recent quiz in progress label:in progress`,
    status: mapRecentQuizStatus(response.status),
  };
}

export function mapQuizStartResponse(
  match: AvailableMatchResponse,
  play: CreatePlayResponse,
): StudentQuizStart {
  return {
    id: match.id,
    matchId: play.matchId,
    attemptId: play.matchAttemptId,
    title: match.title,
    subtitle: match.courseName,
    professorName: match.professorName,
    questionCount: match.questionCount,
    timeLimitMinutes: match.duration,
    questions: play.questions.map(question => ({
      id: question.id,
      statement: question.statement,
      options: question.options.map(option => ({
        id: option.id,
        label: option.label,
      })),
    })),
  };
}

export function mapMatchAttemptDetailResponse(
  response: MatchAttemptDetailResponse,
  metadata: Pick<StudentQuizReview, 'title' | 'subtitle'>,
): StudentQuizReview {
  return {
    id: response.id,
    title: metadata.title,
    subtitle: metadata.subtitle,
    score: response.score,
    questions: response.questions.map((question, index) => {
      const selectedOption = question.options.find(option => option.id === question.selectedOptionId);

      return {
        id: question.questionId,
        number: index + 1,
        text: question.content,
        selectedAnswerLabel:
          selectedOption?.description ?? $localize`:Student quiz unanswered fallback:No answer`,
        isCorrect: question.isCorrect,
      };
    }),
  };
}

export function mapSubmitMatchAttemptResponse(
  response: SubmitMatchAttemptResponse,
  metadata: Pick<StudentQuizResultSummary, 'title' | 'subtitle'>,
): StudentQuizResultSummary {
  return {
    attemptId: response.attemptId,
    title: metadata.title,
    subtitle: metadata.subtitle,
    scorePercentage: response.scorePercentage,
    correctCount: response.correctCount,
    incorrectCount: response.incorrectCount,
    totalQuestions: response.totalQuestions,
    message: $localize`:Student quiz result default message:Result submitted`,
  };
}

export function mapStudentMatchesResponse(
  availableExams: AvailableMatchResponse[]
): AvailableQuiz[] {
  return availableExams.map(mapAvailableMatchResponse);
}

function mapRecentQuizStatus(status: MatchAttemptSummaryResponse['status']): RecentQuizStatus {
  return status === 'passed' ? 'passed' : 'warning';
}

function getAvailableMatchStatus(createdAt: string): AvailableQuiz['status'] {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInDays = diffInMs / MILLISECONDS_PER_DAY;

  return diffInDays <= NEW_MATCH_THRESHOLD_DAYS ? 'new' : 'available';
}

function formatRelativeDate(value: string): string {
  const completedAt = new Date(value);
  const now = new Date();
  const diffInMs = now.getTime() - completedAt.getTime();
  const diffInDays = Math.max(1, Math.round(diffInMs / MILLISECONDS_PER_DAY));

  return $localize`:Recent quiz completed relative date:${diffInDays}:days: days ago`;
}
