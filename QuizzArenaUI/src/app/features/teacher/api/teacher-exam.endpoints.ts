export const TEACHER_EXAM_ENDPOINTS = {
  questions: '/api/v1/questions',
  exams: '/api/v1/quizzes',
  matches: '/api/v1/matches',
} as const;

export const TEACHER_GRADES_ENDPOINTS = {
  matches: '/api/v1/users/me/matches',
  grades: (matchId: string) => `/api/v1/match-attempts/${matchId}/grades`,
  resetAttempts: (id: string) => `/api/v1/match-attempts/${id}/reset`,
} as const;
