import { Service } from '@angular/core';
import { QUESTIONS_RESPONSE_MOCK } from '../mocks/questions.mock';
import { of } from 'rxjs';

@Service()
export class QuizManagementService {
    getQuestions() {
        return of(QUESTIONS_RESPONSE_MOCK)
    }
}
