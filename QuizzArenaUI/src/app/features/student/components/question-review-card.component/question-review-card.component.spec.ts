import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionReviewCardComponent } from './question-review-card.component';

describe('QuestionReviewCardComponent', () => {
  let component: QuestionReviewCardComponent;
  let fixture: ComponentFixture<QuestionReviewCardComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionReviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionReviewCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('question', {
      id: 'q1',
      content: 'Question',
      selectedOptionIds: [],
      isCorrect: null,
      justification: null,
      options: [],
    });

    fixture.componentRef.setInput('questionNumber', 1);
    fixture.componentRef.setInput('totalQuestions', 10);

    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
