import { AttemptReview, Grade, Match } from '../models/exam.model';
import { AttemptDetailResponse, GradeResponse, MatchResponse } from './teacher-grades.contract';

export function mapGradeResponse({ id, nickname, status, score, userId, matchId, otherAttempts }: GradeResponse): Grade {
  return {
    id,
    nickname,
    status,
    score,
    userId,
    matchId,
    otherAttempts: otherAttempts.map(({ id, nickname, status, score }) => ({
      id,
      nickname,
      status,
      score,
    })),
  };
}

export function mapAttemptDetailResponse({ id, score, questions }: AttemptDetailResponse): AttemptReview {
  return {
    id,
    score,
    questions: questions.map(({ questionId, content, options, selectedOptionIds, isCorrect }, index) => {
      const optionDescriptionById = new Map(
        options.map(option => [option.id, option.description]),
      );

      const selectedAnswerLabel = formatSelectedAnswerLabel(
        selectedOptionIds
          .map(optionId => optionDescriptionById.get(optionId))
          .filter((description): description is string => Boolean(description)),
      );

      return {
        id: questionId,
        number: index + 1,
        text: content,
        isCorrect,
        selectedAnswerLabel,
      };
    }),
  };
}

function formatSelectedAnswerLabel(selectedLabels: string[]): string {
  if (!selectedLabels.length) {
    return $localize`:Teacher attempt review unanswered fallback:No answer`;
  }

  return selectedLabels.join(', ');
}

export function mapMatchResponse({ id, title, courseName, questionCount, professorName, duration, quizId, startedAt, finishedAt, status, attemptsAmount }: MatchResponse): Match {
  return {
    id,
    title,
    courseName,
    questionCount,
    professorName,
    duration,
    quizId,
    startedAt,
    finishedAt,
    status,
    attemptsAmount,
  };
}
