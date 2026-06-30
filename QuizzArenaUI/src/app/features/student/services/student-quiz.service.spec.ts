import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AvailableMatchResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  SubmitMatchAttemptRequest,
  SubmitMatchAttemptResponse,
} from '../api/student-quiz.contract';
import { STUDENT_QUIZ_ENDPOINTS } from '../api/student-quiz.endpoints';
import { StudentQuizService } from './student-quiz.service';

describe('StudentQuizService', () => {
  let service: StudentQuizService;
  let httpTesting: HttpTestingController;
  const apiBaseUrl = 'http://localhost:8080';
  const activeMatchesUrl = `${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.availableMatches}?status=active`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(StudentQuizService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getDashboard', () => {
    const availableMatchesMock: AvailableMatchResponse[] = [
      { id: 'm1', title: 'Quiz 1', courseName: 'DDD', createdAt: '2026-06-20', questionCount: 5, professorName: 'Prof A', duration: 10 },
    ];
    const matchAttemptsMock: MatchAttemptSummaryResponse[] = [
      { id: 'a1', title: 'Attempt 1', courseName: 'DDD', completedAt: '2026-06-19', score: 80, status: 'passed', duration: 10 },
    ];

    it('should fetch available matches and match attempts and map the dashboard', () => {
      service.getDashboard().subscribe(dashboard => {
        expect(dashboard.availableQuizzes.length).toBe(1);
        expect(dashboard.availableQuizzes[0].title).toBe('Quiz 1');
        expect(dashboard.recentQuizzes.length).toBe(1);
        expect(dashboard.recentQuizzes[0].title).toBe('Attempt 1');
      });

      const matchReq = httpTesting.expectOne(activeMatchesUrl);
      expect(matchReq.request.method).toBe('GET');
      matchReq.flush(availableMatchesMock);

      const attemptReq = httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.matchAttempts}`);
      expect(attemptReq.request.method).toBe('GET');
      attemptReq.flush(matchAttemptsMock);
    });
  });

  describe('getQuizStart', () => {
    const match: AvailableMatchResponse = {
      id: 'quiz-1', title: 'Quiz 1', courseName: 'DDD', createdAt: '2026-06-20',
      questionCount: 2, professorName: 'Prof A', duration: 10,
    };
    const playResponse: CreatePlayResponse = {
      matchId: 'quiz-1', matchAttemptId: 'attempt-1',
      questions: [
        { id: 'q1', statement: 'Question 1', options: [{ id: 'q1-a', label: 'A' }, { id: 'q1-b', label: 'B' }] },
        { id: 'q2', statement: 'Question 2', options: [{ id: 'q2-a', label: 'A' }, { id: 'q2-b', label: 'B' }] },
      ],
    };

    it('should fetch match and create play', () => {
      service.getQuizStart('quiz-1').subscribe(quizStart => {
        expect(quizStart.title).toBe('Quiz 1');
        expect(quizStart.attemptId).toBe('attempt-1');
        expect(quizStart.questions.length).toBe(2);
      });

      const matchReq = httpTesting.expectOne(activeMatchesUrl);
      matchReq.flush([match]);

      const playReq = httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.plays}`);
      expect(playReq.request.method).toBe('POST');
      expect(playReq.request.body).toEqual({ matchId: 'quiz-1' });
      playReq.flush(playResponse);
    });

    it('should create a new play for each quiz start request', () => {
      service.getQuizStart('quiz-1').subscribe();
      service.getQuizStart('quiz-1').subscribe();

      const matchReqs = httpTesting.match(activeMatchesUrl);
      expect(matchReqs.length).toBe(2);
      matchReqs.forEach(req => req.flush([match]));

      const playReqs = httpTesting.match(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.plays}`);
      expect(playReqs.length).toBe(2);
      playReqs.forEach(req => {
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ matchId: 'quiz-1' });
        req.flush(playResponse);
      });
    });

    it('should throw when match not found', () => {
      service.getQuizStart('unknown').subscribe({
        error: err => expect(err.message).toContain('No match found for quiz unknown'),
      });

      const matchReq = httpTesting.expectOne(activeMatchesUrl);
      matchReq.flush([match]);

      httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.plays}`).flush(playResponse);
    });
  });

  describe('getMatchAttemptDetail', () => {
    it('should fetch attempt detail and combine with metadata', () => {
      const attemptMock: MatchAttemptDetailResponse = {
        id: 'attempt-1', score: 80, status: 'passed',
        questions: [{ questionId: 'q1', content: 'Q1', selectedOptionId: 'q1-a', isCorrect: true, options: [] }],
      };

      service.getMatchAttemptDetail('attempt-1').subscribe(review => {
        expect(review.title).toBe('Quiz 1');
        expect(review.score).toBe(80);
      });

      const detailReq = httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.matchAttemptDetail('attempt-1')}`);
      expect(detailReq.request.method).toBe('GET');
      detailReq.flush(attemptMock);

      // service falls back to fetching metadata from match-attempts
      const metaReq = httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.matchAttempts}`);
      metaReq.flush([{ id: 'attempt-1', title: 'Quiz 1', courseName: 'DDD', completedAt: '2026-06-19', score: 80, status: 'passed', duration: 10 }]);
    });
  });

  describe('submitMatchAttempt', () => {
    it('should POST answers and cache the response', () => {
      const request: SubmitMatchAttemptRequest = {
        answers: [
          {
            questionId: 'q1',
            selectedOptionId: 'q1-a',
            answeredAt: '2026-06-30T00:00:00.000Z',
          },
        ],
      };
      const response: SubmitMatchAttemptResponse = { attemptId: 'attempt-1', scorePercentage: 100, correctCount: 1, incorrectCount: 0, totalQuestions: 1, questions: [] };

      service.submitMatchAttempt('attempt-1', request).subscribe(res => {
        expect(res.scorePercentage).toBe(100);
      });

      const req = httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.submitMatchAttempt('attempt-1')}`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });
  });

  describe('getMatchAttemptResultSummary', () => {
    it('should return cached submit result when available', () => {
      const request: SubmitMatchAttemptRequest = { answers: [] };
      const response: SubmitMatchAttemptResponse = { attemptId: 'attempt-1', scorePercentage: 80, correctCount: 4, incorrectCount: 1, totalQuestions: 5, questions: [] };

      service.submitMatchAttempt('attempt-1', request).subscribe();
      httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.submitMatchAttempt('attempt-1')}`).flush(response);

      service.getMatchAttemptResultSummary('attempt-1').subscribe(summary => {
        expect(summary.scorePercentage).toBe(80);
      });

      httpTesting.expectOne(`${apiBaseUrl}${STUDENT_QUIZ_ENDPOINTS.matchAttempts}`)
        .flush([{ id: 'attempt-1', title: 'Quiz 1', courseName: 'DDD', completedAt: null, score: 80, status: 'passed', duration: 10 }]);
    });

    it('should throw when no cached result', () => {
      service.getMatchAttemptResultSummary('unknown').subscribe({
        error: err => expect(err.message).toContain('No submit result found for attempt unknown'),
      });
    });
  });
});
