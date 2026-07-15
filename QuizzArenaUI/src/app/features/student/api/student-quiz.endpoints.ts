export const STUDENT_QUIZ_ENDPOINTS = {
  availableMatches: '/api/v1/users/me/matches',
  matchAttempts: '/api/v1/users/me/match-attempts',
  matchAttemptDetail: (attemptId: string) => `/api/v1/match-attempts/${attemptId}`,
  plays: '/api/v1/plays',
  trackExamAnswer: (attemptId: string, questionId: string) =>
    `/api/v1/match-attempts/${attemptId}/questions/${questionId}/answer`,
  completeExamAttempt: (attemptId: string) => `/api/v1/match-attempts/${attemptId}/complete`,
  submitMatchAttempt: (attemptId: string) => `/api/v1/match-attempts/${attemptId}/submit`,
} as const;
