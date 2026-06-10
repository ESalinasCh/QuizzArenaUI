export const STUDENT_QUIZ_ENDPOINTS = {
  availableMatches: '/api/v1/users/me/matches',
  matchAttempts: '/api/v1/users/me/match-attempts',
  matchAttemptDetail: (attemptId: string) => `/api/v1/match-attempts/${attemptId}`,
  plays: '/api/v1/plays',
  submitMatchAttempt: (attemptId: string) => `/api/v1/match-attempts/${attemptId}/submit`,
} as const;
