import { TestBed } from '@angular/core/testing';

import { QuizManagement } from './quiz-management';

describe('QuizManagement', () => {
  let service: QuizManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
