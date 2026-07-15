import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QuestionBankService } from './question-bank.service';

describe('QuestionBankService', () => {
  let service: QuestionBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuestionBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
