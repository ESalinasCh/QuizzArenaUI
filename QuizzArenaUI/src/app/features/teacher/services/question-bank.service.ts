import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Question } from '../models/question';

export interface QuestionFilters {
    status?: 'Draft' | 'Verified' | 'Disapproved';
    processingJobsIds?: string[];
    page?: number;
    pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class QuestionBankService {
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

    addQuestion(question: Partial<Question>): Observable<void> {
        return of(void 0);
    }

    updateQuestion(id: string, question: Partial<Question>): Observable<any> {
        const body: any = {
            questionId: question.id || id
        };
        if (question.content !== undefined) body.content = question.content;
        if (question.justification !== undefined) body.justification = question.justification;
        if (question.status !== undefined) body.status = question.status;
        if (question.type !== undefined) body.type = question.type;
        if (question.options !== undefined) {
            body.options = question.options.map(opt => {
                const optBody: any = {
                    optionId: opt.optionId || opt.id
                };
                if (opt.description !== undefined) optBody.description = opt.description;
                if (opt.isCorrect !== undefined) optBody.isCorrect = opt.isCorrect;
                if (opt.position !== undefined) optBody.position = opt.position;
                return optBody;
            });
        }
        return this.#http.patch<any>(`${this.#api}/api/v1/questions`, body);
    }

    deleteQuestion(id: string): Observable<void> {
        return of(void 0);
    }
}
