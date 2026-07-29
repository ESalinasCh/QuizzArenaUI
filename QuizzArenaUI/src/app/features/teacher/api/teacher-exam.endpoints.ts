export const TEACHER_EXAM_ENDPOINTS = {
  questions: '/api/v1/questions',
  exams: '/api/v1/users/me/quizzes',
  createExam: '/api/v1/quizzes',
  matches: '/api/v1/matches',
  matchesforTeacher: '/api/v1/users/me/matches',
  activeExams: (matchId: string) => `/api/v1/matches/${matchId}/publish`,
  unpublishMatch: (matchId: string) => `/api/v1/matches/${matchId}/unpublish`,
} as const;

export const TEACHER_GRADES_ENDPOINTS = {
  matches: '/api/v1/users/me/matches',
  grades: (matchId: string) => `/api/v1/match-attempts/${matchId}/grades`,
  resetAttempts: (matchId: string, userId: string) => `/api/v1/matches/${matchId}/users/${userId}/match-attempts/reset`,
} as const;
