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
  mapStudentDashboardResponse,
  mapStudentMatchesResponse,
  mapSubmitMatchAttemptResponse,
  mapAvailableMatchResponse,
  mapMatchAttemptSummaryResponse,
  mapMatchSessionInfoResponse,
  mapQuizStartFromSessionInfoResponse,
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
  StudentMatchSessionInfo,
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
        {
          params: {
            matchmode: 'Solo',
          },
        }
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
      .pipe(
        tap(matchAttempts => matchAttempts.forEach(attempt => this.#cacheAttemptSummaryMetadata(attempt))),
        map(matchAttempts => matchAttempts.map(mapMatchAttemptSummaryResponse)),
      );
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


  getQuizStart(quizId: string): Observable<StudentMatchSessionInfo> {
    return this.#getQuizMatch(quizId).pipe(map(mapMatchSessionInfoResponse));
  }

  startQuizPlay(quiz: StudentMatchSessionInfo): Observable<StudentQuizStart> {
    return this.#createPlay(quiz.id).pipe(
      map(play => {
        const mappedQuizStart = mapQuizStartFromSessionInfoResponse(quiz, play);
        this.#activeQuizStart.set(mappedQuizStart);
        this.#cacheAttemptMetadata(mappedQuizStart);

        return mappedQuizStart;
      }),
    );
  }

  getActiveQuizStart(): StudentQuizStart | undefined {
    return this.#activeQuizStart();
  }

  getExamStart(examId: string): Observable<StudentMatchSessionInfo> {
    return this.#getExamMatch(examId).pipe(map(mapMatchSessionInfoResponse));
  }

  startExamPlay(exam: StudentMatchSessionInfo): Observable<StudentQuizStart> {
    return this.#createPlay(exam.id).pipe(
      map(play => {
        const mappedExamStart = mapQuizStartFromSessionInfoResponse(exam, play);
        this.#activeExamStart.set(mappedExamStart);
        this.#cacheAttemptMetadata(mappedExamStart);

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
    selectedOptionIds: string[],
  ): Observable<TrackExamAnswerResponse> {
    return this.#http.put<TrackExamAnswerResponse>(
      buildApiUrl(STUDENT_QUIZ_ENDPOINTS.trackExamAnswer(attemptId, questionId)),
      { selectedOptionIds },
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
      matchAttempt: this.#http.get<MatchAttemptDetailResponse>(
        buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttemptDetail(attemptId)),
      ),
      metadata: this.#getAttemptMetadata(attemptId),
    }).pipe(
      map(({ matchAttempt, metadata }) => ({
        title: metadata.title,
        subtitle: metadata.subtitle,
        matchAttempt,
      })),
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
      .get<MatchAttemptSummaryResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts), {
        params: buildHttpParams({
          page: 1,
          pageSize: 100,
          matchmode: 'exam',
        }),
      })
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

  #getQuizMatch(quizId: string): Observable<AvailableMatchResponse> {
    return this.#http
      .get<AvailableMatchResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches), {
        params: buildHttpParams({
          page: 1,
          pageSize: 100,
          status: 'active',
          mode: 'Solo',
        }),
      })
      .pipe(map(matches => this.#findMatch(matches, quizId, `No match found for quiz ${quizId}`)));
  }

  #getExamMatch(examId: string): Observable<AvailableMatchResponse> {
    return this.#http
      .get<AvailableMatchResponse[]>(buildApiUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches), {
        params: buildHttpParams({
          page: 1,
          pageSize: 100,
          status: 'Active',
          mode: 'Exam',
        }),
      })
      .pipe(map(matches => this.#findMatch(matches, examId, `No exam found for match ${examId}`)));
  }

  #createPlay(matchId: string): Observable<CreatePlayResponse> {
    return this.#http.post<CreatePlayResponse>(
      buildApiUrl(STUDENT_QUIZ_ENDPOINTS.plays),
      { matchId },
    );
  }

  #findMatch(
    matches: AvailableMatchResponse[],
    matchId: string,
    errorMessage: string,
  ): AvailableMatchResponse {
    const match = matches.find(item => item.id === matchId);

    if (!match) {
      throw new Error(errorMessage);
    }

    return match;
  }

  #cacheAttemptMetadata(quizStart: StudentQuizStart): void {
    if (!quizStart.attemptId) {
      return;
    }

    this.#attemptMetadataCache.set(quizStart.attemptId, {
      title: quizStart.title,
      subtitle: quizStart.subtitle,
    });
  }

  #cacheAttemptSummaryMetadata(attempt: MatchAttemptSummaryResponse): void {
    this.#attemptMetadataCache.set(attempt.id, this.#mapAttemptSummaryToMetadata(attempt));
  }
}
