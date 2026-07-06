import { Service } from '@angular/core';
import { QUIZZES_RESPONSE_MOCK } from '../mocks/quizzes.mock';
import { of } from 'rxjs';

@Service()
export class QuizManagementService {
    getQuestions() {
        return of(QUIZZES_RESPONSE_MOCK)
    }
}
