import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, of, tap, throwError } from 'rxjs';
import {
  AvailableMatchResponse,
  CompleteExamAttemptResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  MatchFilters,
  SubmitMatchAttemptRequest,
  SubmitMatchAttemptResponse,
  TrackExamAnswerResponse,
} from '../api/student-quiz.contract';
import { STUDENT_QUIZ_ENDPOINTS } from '../api/student-quiz.endpoints';
import {
  mapAttemptHistoryCardResponse,
  mapCompleteExamAttemptResponse,
  mapMatchAttemptDetailResponse,
  mapQuizStartResponse,
  mapStudentDashboardResponse,
  mapStudentMatchesResponse,
  mapSubmitMatchAttemptResponse,
  mapAvailableMatchResponse,
  mapMatchAttemptSummaryResponse,
} from '../api/student-quiz.mapper';
import {
  AttemptHistoryCard,
  StudentQuizDashboard,
  StudentQuizReview,
  StudentQuizResultSummary,
  StudentQuizStart,
  AvailableQuiz,
  StudentExamResult,
  RecentQuiz,
} from '../models/student-quiz.model';
import { buildApiUrl, buildHttpParams } from '../../../core/utils/api-url.util';
import { PagedRequest } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class StudentQuizService {
  readonly #http = inject(HttpClient);
  readonly #activeQuizStart = signal<StudentQuizStart | undefined>(undefined);
  readonly #activeExamStart = signal<StudentQuizStart | undefined>(undefined);
  readonly #completedExamResult = signal<StudentExamResult | undefined>(undefined);
  readonly #attemptMetadataCache = new Map<string, { title: string; subtitle: string }>();
  readonly #submitResultCache = new Map<string, SubmitMatchAttemptResponse>();

  getDashboard(): Observable<StudentQuizDashboard> {
    return forkJoin({
      availableMatches: this.#http.get<AvailableMatchResponse[]>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
        {
          params: {
            status: 'active',
            mode: 'Solo',
          },
        },
      ),
      matchAttempts: this.#http.get<MatchAttemptSummaryResponse[]>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts),
      ),
    }).pipe(
      map(({ availableMatches, matchAttempts }) =>
        mapStudentDashboardResponse(availableMatches, matchAttempts),
      ),
    );
  }

  getAvailableQuizzes(filters?: PagedRequest): Observable<AvailableQuiz[]> {
    const params = buildHttpParams(filters).set('status', 'active').set('mode', 'Solo');
    return this.#http
      .get<AvailableMatchResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches), { params })
      .pipe(map(availableMatches => availableMatches.map(mapAvailableMatchResponse)));
  }

  getRecentQuizzes(filters?: PagedRequest): Observable<RecentQuiz[]> {
    const params = buildHttpParams(filters);
    return this.#http
      .get<MatchAttemptSummaryResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts), { params })
      .pipe(map(matchAttempts => matchAttempts.map(mapMatchAttemptSummaryResponse)));
  }

  getMatches(filters: MatchFilters): Observable<AvailableQuiz[]> {
    const params = buildHttpParams(filters);
    return this.#http
      .get<AvailableMatchResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches), { params })
      .pipe(map(availableMatches => mapStudentMatchesResponse(availableMatches)));
  }

  getGradeHistory(filters?: PagedRequest): Observable<AttemptHistoryCard[]> {
    const params = buildHttpParams(filters).set('matchmode', 'exam');
    return this.#http
      .get<MatchAttemptSummaryResponse[]>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts),
        { params },
      )
      .pipe(map(attempts => attempts.map(mapAttemptHistoryCardResponse)));
  }


  getQuizStart(quizId: string): Observable<StudentQuizStart> {

    const quizStart = forkJoin({
      matches: this.#http.get<AvailableMatchResponse[]>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
        {
          params: { status: 'active' },
        },
      ),
      play: this.#http.post<CreatePlayResponse>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.plays),
        { matchId: quizId },
      ),
    }).pipe(
      map(({ matches, play }) => {
        const match = matches.find(item => item.id === quizId);

        if (!match) {
          throw new Error(`No match found for quiz ${quizId}`);
        }

        const mappedQuizStart = mapQuizStartResponse(match, play);
        this.#activeQuizStart.set(mappedQuizStart);
        if (mappedQuizStart.attemptId) {
          this.#attemptMetadataCache.set(mappedQuizStart.attemptId, {
            title: mappedQuizStart.title,
            subtitle: mappedQuizStart.subtitle,
          });
        }

        return mappedQuizStart;
      })
    );

    return quizStart;
  }
  getActiveQuizStart(): StudentQuizStart | undefined {
    return this.#activeQuizStart();
  }

  getExamStart(examId: string): Observable<StudentQuizStart> {
    return forkJoin({
      matches: this.#http.get<AvailableMatchResponse[]>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
        {
          params: { status: 'Active', mode: 'Exam' },
        },
      ),
      play: this.#http.post<CreatePlayResponse>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.plays),
        { matchId: examId },
      ),
    }).pipe(
      map(({ matches, play }) => {
        const match = matches.find(item => item.id === examId);

        if (!match) {
          throw new Error(`No exam found for match ${examId}`);
        }

        const mappedExamStart = mapQuizStartResponse(match, play);
        this.#activeExamStart.set(mappedExamStart);

        if (mappedExamStart.attemptId) {
          this.#attemptMetadataCache.set(mappedExamStart.attemptId, {
            title: mappedExamStart.title,
            subtitle: mappedExamStart.subtitle,
          });
        }

        return mappedExamStart;
      }),
    );
  }

  getActiveExamStart(): StudentQuizStart | undefined {
    return this.#activeExamStart();
  }

  trackExamAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionId: string,
  ): Observable<TrackExamAnswerResponse> {
    return this.#http.put<TrackExamAnswerResponse>(
      buildApiUrl(STUDENT_QUIZ_ENDPOINTS.trackExamAnswer(attemptId, questionId)),
      { selectedOptionId },
    );
  }

  completeExamAttempt(attemptId: string): Observable<StudentExamResult> {
    return forkJoin({
      response: this.#http.post<CompleteExamAttemptResponse>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.completeExamAttempt(attemptId)),
        null,
      ),
      metadata: this.#getAttemptMetadata(attemptId),
    }).pipe(
      map(({ response, metadata }) => {
        const result = mapCompleteExamAttemptResponse(response, metadata);
        this.#completedExamResult.set(result);

        return result;
      }),
    );
  }

  getCompletedExamResult(): StudentExamResult | undefined {
    return this.#completedExamResult();
  }

  getMatchAttemptDetail(attemptId: string): Observable<StudentQuizReview> {
    return forkJoin({
      response: this.#http.get<MatchAttemptDetailResponse>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttemptDetail(attemptId)),
      ),
      metadata: this.#getAttemptMetadata(attemptId),
    }).pipe(
      map(({ response, metadata }) => mapMatchAttemptDetailResponse(response, metadata)),
    );
  }

  getMatchAttemptResultSummary(attemptId: string): Observable<StudentQuizResultSummary> {
    const cachedSubmitResult = this.#submitResultCache.get(attemptId);

    if (!cachedSubmitResult) {
      return throwError(
        () => new Error(`No submit result found for attempt ${attemptId}`),
      );
    }

    return this.#getAttemptMetadata(attemptId).pipe(
      map(metadata => mapSubmitMatchAttemptResponse(cachedSubmitResult, metadata)),
    );
  }

  submitMatchAttempt(
    attemptId: string,
    request: SubmitMatchAttemptRequest,
  ): Observable<SubmitMatchAttemptResponse> {
    return this.#http
      .post<SubmitMatchAttemptResponse>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.submitMatchAttempt(attemptId)),
        request,
      )
      .pipe(tap(response => this.#submitResultCache.set(response.attemptId, response)));
  }

  #getAttemptMetadata(attemptId: string): Observable<{ title: string; subtitle: string }> {
    const cachedMetadata = this.#attemptMetadataCache.get(attemptId);

    if (cachedMetadata) {
      return of(cachedMetadata);
    }

    return this.#http
      .get<MatchAttemptSummaryResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts))
      .pipe(
        map(attempts => {
          const attempt = attempts.find(item => item.id === attemptId);

          if (!attempt) {
            throw new Error(`No quiz metadata found for attempt ${attemptId}`);
          }

          return this.#mapAttemptSummaryToMetadata(attempt);
        }),
      );
  }

  #mapAttemptSummaryToMetadata(attempt: MatchAttemptSummaryResponse): {
    title: string;
    subtitle: string;
  } {
    return {
      title: attempt.title,
      subtitle: attempt.courseName,
    };
  }
}
