import { Grade, Match } from '../models/exam.model';
import { GradeResponse, MatchResponse } from './teacher-grades.contract';

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

export function mapMatchResponse({ id, title, courseName, questionCount, professorName, duration }: MatchResponse): Match {
  return {
    id,
    title,
    courseName,
    questionCount,
    professorName,
    duration,
  };
}
