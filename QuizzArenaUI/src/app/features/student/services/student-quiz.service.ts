import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  MatchAttemptSummaryResponse,
  SubmitMatchAttemptRequest,
  SubmitMatchAttemptResponse,
} from '../api/student-quiz.contract';
import {
  mapMatchAttemptDetailResponse,
  mapQuizStartResponse,
  mapStudentDashboardResponse,
  mapSubmitMatchAttemptResponse,
} from '../api/student-quiz.mapper';
import {
  STUDENT_AVAILABLE_MATCHES_RESPONSE_MOCK,
  STUDENT_MATCH_ATTEMPTS_RESPONSE_MOCK,
  STUDENT_MATCH_ATTEMPT_DETAIL_RESPONSE_MOCKS,
  STUDENT_PLAY_RESPONSE_MOCKS,
  STUDENT_SUBMIT_MATCH_ATTEMPT_RESPONSE_MOCKS,
} from '../mocks/student-quiz.mock';
import {
  StudentQuizDashboard,
  StudentQuizReview,
  StudentQuizResultSummary,
  StudentQuizStart,
} from '../models/student-quiz.model';

@Injectable({ providedIn: 'root' })
export class StudentQuizService {
  getDashboard(): Observable<StudentQuizDashboard> {
    return of({
      availableMatches: STUDENT_AVAILABLE_MATCHES_RESPONSE_MOCK,
      matchAttempts: STUDENT_MATCH_ATTEMPTS_RESPONSE_MOCK,
    }).pipe(
      map(({ availableMatches, matchAttempts }) =>
        mapStudentDashboardResponse(availableMatches, matchAttempts),
      ),
    );
  }

  getQuizStart(quizId: string): Observable<StudentQuizStart> {
    const fallbackQuizId = 'project-1-review';
    const match =
      STUDENT_AVAILABLE_MATCHES_RESPONSE_MOCK.find(source => source.id === quizId) ??
      STUDENT_AVAILABLE_MATCHES_RESPONSE_MOCK[0];
    const play =
      STUDENT_PLAY_RESPONSE_MOCKS[quizId] ??
      STUDENT_PLAY_RESPONSE_MOCKS[fallbackQuizId];

    return of({ match, play }).pipe(
      map(({ match, play }) => mapQuizStartResponse(match, play)),
    );
  }

  getMatchAttemptDetail(attemptId: string): Observable<StudentQuizReview> {
    const fallbackAttemptId = 'attempt-project-1-week-7';

    return of(
      STUDENT_MATCH_ATTEMPT_DETAIL_RESPONSE_MOCKS[attemptId] ??
        STUDENT_MATCH_ATTEMPT_DETAIL_RESPONSE_MOCKS[fallbackAttemptId],
    ).pipe(
      map(response =>
        mapMatchAttemptDetailResponse(response, this.getAttemptMetadata(attemptId)),
      ),
    );
  }

  getMatchAttemptResultSummary(attemptId: string): Observable<StudentQuizResultSummary> {
    const fallbackAttemptId = 'attempt-project-1-review';

    return of(
      STUDENT_SUBMIT_MATCH_ATTEMPT_RESPONSE_MOCKS[attemptId] ??
        STUDENT_SUBMIT_MATCH_ATTEMPT_RESPONSE_MOCKS[fallbackAttemptId],
    ).pipe(
      map(response =>
        mapSubmitMatchAttemptResponse(response, this.getAttemptMetadata(attemptId)),
      ),
    );
  }

  submitMatchAttempt(
    attemptId: string,
    request: SubmitMatchAttemptRequest,
  ): Observable<SubmitMatchAttemptResponse> {
    void request;

    const fallbackAttemptId = 'attempt-project-1-review';

    return of(
      STUDENT_SUBMIT_MATCH_ATTEMPT_RESPONSE_MOCKS[attemptId] ??
        STUDENT_SUBMIT_MATCH_ATTEMPT_RESPONSE_MOCKS[fallbackAttemptId],
    );
  }

  private getAttemptMetadata(attemptId: string): { title: string; subtitle: string } {
    const attempt = STUDENT_MATCH_ATTEMPTS_RESPONSE_MOCK.find(item => item.id === attemptId);

    if (attempt) {
      return this.mapAttemptSummaryToMetadata(attempt);
    }

    const play = Object.values(STUDENT_PLAY_RESPONSE_MOCKS).find(item => item.attemptId === attemptId);
    const match = STUDENT_AVAILABLE_MATCHES_RESPONSE_MOCK.find(item => item.id === play?.matchId);

    if (!match) {
      throw new Error(`No quiz metadata found for attempt ${attemptId}`);
    }

    return {
      title: match.title,
      subtitle: match.courseName,
    };
  }

  private mapAttemptSummaryToMetadata(attempt: MatchAttemptSummaryResponse): {
    title: string;
    subtitle: string;
  } {
    return {
      title: attempt.title,
      subtitle: attempt.courseName,
    };
  }
}
