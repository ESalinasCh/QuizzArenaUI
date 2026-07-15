import { TestBed } from '@angular/core/testing';
import { TeacherQuestionBankPage } from './question-bank-page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('TeacherQuestionBankPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherQuestionBankPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TeacherQuestionBankPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
