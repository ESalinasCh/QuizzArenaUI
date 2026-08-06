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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
