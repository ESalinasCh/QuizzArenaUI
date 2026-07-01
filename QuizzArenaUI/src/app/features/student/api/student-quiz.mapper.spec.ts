import { AvailableMatchResponse, CreatePlayResponse, MatchAttemptDetailResponse, MatchAttemptSummaryResponse, SubmitMatchAttemptResponse } from './student-quiz.contract';
import {
  mapAvailableMatchResponse,
  mapMatchAttemptDetailResponse,
  mapMatchAttemptSummaryResponse,
  mapQuizStartResponse,
  mapStudentDashboardResponse,
  mapSubmitMatchAttemptResponse,
} from './student-quiz.mapper';

describe('student-quiz.mapper', () => {
  describe('mapAvailableMatchResponse', () => {
    it('should map an available match response', () => {
      const response: AvailableMatchResponse = {
        id: 'quiz-1', title: 'Quiz 1', courseName: 'DDD',
        createdAt: '2026-06-20', questionCount: 5, professorName: 'Prof A', duration: 10,
      };

      const result = mapAvailableMatchResponse(response);
      expect(result.id).toBe('quiz-1');
      expect(result.title).toBe('Quiz 1');
      expect(result.questionCount).toBe(5);
      expect(result.status).toBe('available');
    });
  });

  describe('mapMatchAttemptSummaryResponse', () => {
    it('should map a passed attempt', () => {
      const response: MatchAttemptSummaryResponse = {
        id: 'a1', title: 'Attempt 1', courseName: 'DDD',
        completedAt: '2026-06-19', score: 80, status: 'passed', duration: 10,
      };

      const result = mapMatchAttemptSummaryResponse(response);
      expect(result.id).toBe('a1');
      expect(result.score).toBe(80);
      expect(result.status).toBe('passed');
      expect(result.completedAtLabel).toContain('days ago');
    });

    it('should map an in-progress attempt', () => {
      const response: MatchAttemptSummaryResponse = {
        id: 'a2', title: 'Attempt 2', courseName: 'DDD',
        completedAt: null, score: 60, status: 'failed', duration: 10,
      };

      const result = mapMatchAttemptSummaryResponse(response);
      expect(result.status).toBe('warning');
    });
  });

  describe('mapStudentDashboardResponse', () => {
    it('should map available matches and match attempts to dashboard', () => {
      const matches: AvailableMatchResponse[] = [
        { id: 'm1', title: 'Quiz 1', courseName: 'DDD', createdAt: '2026-06-20', questionCount: 5, professorName: 'Prof A', duration: 10 },
      ];
      const attempts: MatchAttemptSummaryResponse[] = [
        { id: 'a1', title: 'Attempt 1', courseName: 'DDD', completedAt: '2026-06-19', score: 80, status: 'passed', duration: 10 },
      ];

      const result = mapStudentDashboardResponse(matches, attempts);
      expect(result.availableQuizzes.length).toBe(1);
      expect(result.recentQuizzes.length).toBe(1);
    });
  });

  describe('mapQuizStartResponse', () => {
    it('should map match and play responses to quiz start', () => {
      const match: AvailableMatchResponse = {
        id: 'quiz-1', title: 'Quiz 1', courseName: 'DDD',
        createdAt: '2026-06-20', questionCount: 2, professorName: 'Prof A', duration: 10,
      };
      const play: CreatePlayResponse = {
        matchId: 'quiz-1', matchAttemptId: 'attempt-1',
        questions: [
          { id: 'q1', statement: 'Q1', options: [{ id: 'q1-a', label: 'A' }] },
        ],
      };

      const result = mapQuizStartResponse(match, play);
      expect(result.title).toBe('Quiz 1');
      expect(result.attemptId).toBe('attempt-1');
      expect(result.questions.length).toBe(1);
      expect(result.questions[0].options[0].label).toBe('A');
    });
  });

  describe('mapMatchAttemptDetailResponse', () => {
    it('should map attempt detail with metadata', () => {
      const response: MatchAttemptDetailResponse = {
        id: 'attempt-1', score: 80, status: 'passed',
        questions: [
          { questionId: 'q1', content: 'Q1', selectedOptionId: 'q1-a', isCorrect: true, options: [{ id: 'q1-a', description: 'Answer A', isCorrect: true }] },
        ],
      };
      const metadata = { title: 'Quiz 1', subtitle: 'DDD' };

      const result = mapMatchAttemptDetailResponse(response, metadata);
      expect(result.title).toBe('Quiz 1');
      expect(result.questions[0].text).toBe('Q1');
      expect(result.questions[0].isCorrect).toBe(true);
    });
  });

  describe('mapSubmitMatchAttemptResponse', () => {
    it('should map submit response with metadata', () => {
      const response: SubmitMatchAttemptResponse = {
        attemptId: 'attempt-1', scorePercentage: 80, correctCount: 4, incorrectCount: 1,
        totalQuestions: 5, questions: [],
      };
      const metadata = { title: 'Quiz 1', subtitle: 'DDD' };

      const result = mapSubmitMatchAttemptResponse(response, metadata);
      expect(result.scorePercentage).toBe(80);
      expect(result.correctCount).toBe(4);
      expect(result.message).toBe('Result submitted');
    });
  });
});
