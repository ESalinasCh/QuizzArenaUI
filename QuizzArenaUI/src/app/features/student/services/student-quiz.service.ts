import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AvailableMatchResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  SubmitMatchAttemptRequest,
  SubmitMatchAttemptResponse,
} from '../api/student-quiz.contract';
import { STUDENT_QUIZ_ENDPOINTS } from '../api/student-quiz.endpoints';
import {
  mapMatchAttemptDetailResponse,
  mapQuizStartResponse,
  mapStudentDashboardResponse,
  mapSubmitMatchAttemptResponse,
} from '../api/student-quiz.mapper';
import {
  StudentQuizDashboard,
  StudentQuizReview,
  StudentQuizResultSummary,
  StudentQuizStart,
} from '../models/student-quiz.model';

@Injectable({ providedIn: 'root' })
export class StudentQuizService {
  readonly #http = inject(HttpClient);
  readonly #apiBaseUrl = environment.apiBaseUrl;
  readonly #quizStartCache = new Map<string, Observable<StudentQuizStart>>();
  readonly #attemptMetadataCache = new Map<string, { title: string; subtitle: string }>();
  readonly #submitResultCache = new Map<string, SubmitMatchAttemptResponse>();

  getDashboard(): Observable<StudentQuizDashboard> {
    return forkJoin({
      availableMatches: this.#http.get<AvailableMatchResponse[]>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
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

  getQuizStart(quizId: string): Observable<StudentQuizStart> {
    const cachedQuizStart = this.#quizStartCache.get(quizId);

    if (cachedQuizStart) {
      return cachedQuizStart;
    }

    const quizStart = forkJoin({
      matches: this.#http.get<AvailableMatchResponse[]>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.availableMatches),
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

        if (mappedQuizStart.attemptId) {
          this.#attemptMetadataCache.set(mappedQuizStart.attemptId, {
            title: mappedQuizStart.title,
            subtitle: mappedQuizStart.subtitle,
          });
        }

        return mappedQuizStart;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.#quizStartCache.set(quizId, quizStart);

    return quizStart;
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

    if (cachedSubmitResult) {
      return this.#getAttemptMetadata(attemptId).pipe(
        map(metadata => mapSubmitMatchAttemptResponse(cachedSubmitResult, metadata)),
      );
    }

    return forkJoin({
      response: this.#http.get<MatchAttemptDetailResponse>(
        this.#buildUrl(STUDENT_QUIZ_ENDPOINTS.matchAttemptDetail(attemptId)),
      ),
      metadata: this.#getAttemptMetadata(attemptId),
    }).pipe(
      map(({ response, metadata }) =>
        mapSubmitMatchAttemptResponse(this.#mapDetailToSubmitSummary(response), metadata),
      ),
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

  #mapDetailToSubmitSummary(response: MatchAttemptDetailResponse): SubmitMatchAttemptResponse {
    const correctCount = response.questions.filter(question => question.isCorrect).length;
    const totalQuestions = response.questions.length;

    return {
      attemptId: response.id,
      scorePercentage: response.score,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      totalQuestions,
      questions: response.questions.map((question, index) => ({
        id: question.questionId,
        number: index + 1,
        text: question.content,
        selectedOptionId: question.selectedOptionId,
        correctOptionId: question.options.find(option => option.isCorrect)?.id ?? '',
        isCorrect: question.isCorrect,
      })),
    };
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
