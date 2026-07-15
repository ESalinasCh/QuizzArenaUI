import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QuizManagementService } from './quiz-management.service';

describe('QuizManagementService', () => {
  let service: QuizManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuizManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

