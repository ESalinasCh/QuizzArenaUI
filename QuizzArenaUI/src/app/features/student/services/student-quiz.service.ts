import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AvailableMatchResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  MatchFilters,
  SubmitMatchAttemptRequest,
  SubmitMatchAttemptResponse,
} from '../api/student-quiz.contract';
import { STUDENT_QUIZ_ENDPOINTS } from '../api/student-quiz.endpoints';
import {
  mapAttemptHistoryCardResponse,
  mapMatchAttemptDetailResponse,
  mapQuizStartResponse,
  mapStudentDashboardResponse,
  mapStudentMatchesResponse,
  mapSubmitMatchAttemptResponse,
} from '../api/student-quiz.mapper';
import {
  AttemptHistoryCard,
  StudentQuizDashboard,
  StudentQuizReview,
  StudentQuizResultSummary,
  StudentQuizStart,
  AvailableQuiz,
} from '../models/student-quiz.model';

@Injectable({ providedIn: 'root' })
export class StudentQuizService {
  readonly #http = inject(HttpClient);
  readonly #apiBaseUrl = environment.apiBaseUrl;
  readonly #activeQuizStart = signal<StudentQuizStart | undefined>(undefined);
  readonly #attemptMetadataCache = new Map<string, { title: string; subtitle: string }>();
  readonly #submitResultCache = new Map<string, SubmitMatchAttemptResponse>();

  getDashboard(): Observable<StudentQuizDashboard> {
    return forkJoin({
      availableMatches: this.#http.get<AvailableMatchResponse[]>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
        {
          params: { status: 'active' },
        },
      ),
      matchAttempts: this.#http.get<MatchAttemptSummaryResponse[]>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts),
      ),
    }).pipe(
      map(({ availableMatches, matchAttempts }) =>
        mapStudentDashboardResponse(availableMatches, matchAttempts),
      ),
    );
  }

  getMatches(filters: MatchFilters): Observable<AvailableQuiz[]> {
    return this.#http
      .get<AvailableMatchResponse[]>(this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches), {
        params: { ...filters },
      })
      .pipe(map(availableMatches => mapStudentMatchesResponse(availableMatches)));
  }

  getGradeHistory(): Observable<AttemptHistoryCard[]> {
    return this.#http
      .get<MatchAttemptSummaryResponse[]>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts),
        {
          params: { matchmode: 'exam' },
        },
      )
      .pipe(map(attempts => attempts.map(mapAttemptHistoryCardResponse)));
  }


  getQuizStart(quizId: string): Observable<StudentQuizStart> {

    const quizStart = forkJoin({
      matches: this.#http.get<AvailableMatchResponse[]>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
        {
          params: { status: 'active' },
        },
      ),
      play: this.#http.post<CreatePlayResponse>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.plays),
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
  getMatchAttemptDetail(attemptId: string): Observable<StudentQuizReview> {
    return forkJoin({
      response: this.#http.get<MatchAttemptDetailResponse>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.matchAttemptDetail(attemptId)),
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
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.submitMatchAttempt(attemptId)),
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
      .get<MatchAttemptSummaryResponse[]>(this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.matchAttempts))
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

  #buildUrl(endpoint: string): string {
    return `${this.#apiBaseUrl}${endpoint}`;
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
