import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Question } from '../models/question';
import { QUESTIONS_RESPONSE_MOCK } from '../mocks/questions.mock';

export interface QuestionFilters {
    status?: 'Draft' | 'Verified' | 'Disapproved';
    processingJobsIds?: string[];
    page?: number;
    pageSize?: number;
}

@Service()
export class QuizManagementService {
    readonly #http = inject(HttpClient);
    readonly #api = environment.apiBaseUrl;

    getQuestions(
        filters?: QuestionFilters,
    ): Observable<Question[]> {
        let params = new HttpParams();
        const pageSize = 5;
        params = params
            .set("Page", (filters?.page || 0).toString())
            .set("PageSize", (filters?.pageSize || pageSize).toString())
            .set("ProcessingJobIds", filters?.processingJobsIds?.join(';') || "")
            .set("Status", filters?.status || 'Verified');
        return this.#http.get<Question[]>(`${this.#api}/api/v1/questions`, { params });
    }

    // getQuestionsMock(): Observable<Question[]> {
    //     return of(QUESTIONS_RESPONSE_MOCK);
    // }

    addQuestion(question: Partial<Question>): Observable<void> {
        return of(void 0);
    }

    updateQuestion(id: string, question: Partial<Question>): Observable<void> {
        return of(void 0);
    }

    deleteQuestion(id: string): Observable<void> {
        return of(void 0);
    }
}

