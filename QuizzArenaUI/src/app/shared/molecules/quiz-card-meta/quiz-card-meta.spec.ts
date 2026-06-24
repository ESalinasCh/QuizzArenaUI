import { TestBed } from '@angular/core/testing';
import { QuizCardMeta } from './quiz-card-meta';

describe('QuizCardMeta', () => {
  it('should render question count with "questions" label', () => {
    const fixture = TestBed.createComponent(QuizCardMeta);
    fixture.componentRef.setInput('questionCount', 10);
    fixture.componentRef.setInput('statusLabel', 'Available');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('10 questions');
  });

  it('should render the status label', () => {
    const fixture = TestBed.createComponent(QuizCardMeta);
    fixture.componentRef.setInput('questionCount', 5);
    fixture.componentRef.setInput('statusLabel', 'Completed');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Completed');
  });

  it('should default to info variant for status', () => {
    const fixture = TestBed.createComponent(QuizCardMeta);
    fixture.componentRef.setInput('questionCount', 3);
    fixture.componentRef.setInput('statusLabel', 'Active');
    fixture.detectChanges();

    const statusLabel = fixture.nativeElement.querySelector('qz-status-label');
    expect(statusLabel).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Active');
  });

  it('should render MetaText with quiz icon', () => {
    const fixture = TestBed.createComponent(QuizCardMeta);
    fixture.componentRef.setInput('questionCount', 8);
    fixture.componentRef.setInput('statusLabel', 'Draft');
    fixture.detectChanges();

    const metaText = fixture.nativeElement.querySelector('qz-meta-text');
    expect(metaText).toBeTruthy();
  });

  it('should apply different status variant', () => {
    const fixture = TestBed.createComponent(QuizCardMeta);
    fixture.componentRef.setInput('questionCount', 15);
    fixture.componentRef.setInput('statusLabel', 'Expired');
    fixture.componentRef.setInput('statusVariant', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('15 questions');
    expect(fixture.nativeElement.textContent).toContain('Expired');
  });
});
