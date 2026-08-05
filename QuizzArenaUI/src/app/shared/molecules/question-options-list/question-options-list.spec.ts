import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { QuestionOptionsList } from './question-options-list';

describe('QuestionOptionsList', () => {
  let fixture: ComponentFixture<QuestionOptionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionOptionsList],
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionOptionsList);
  });

  it('should render nothing when there are no options', () => {
    fixture.componentRef.setInput('options', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.rounded-lg')).toBeFalsy();
  });

  it('should render each option and highlight the correct one', () => {
    fixture.componentRef.setInput('options', [
      { id: 'opt-1', description: 'Paris', isCorrect: true, position: 0 },
      { id: 'opt-2', description: 'Madrid', isCorrect: false, position: 1 },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Paris');
    expect(fixture.nativeElement.textContent).toContain('Madrid');

    const spans: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('span'));
    const correctSpan = spans.find(s => s.textContent?.trim() === 'Paris');
    const wrongSpan = spans.find(s => s.textContent?.trim() === 'Madrid');
    expect(correctSpan?.className).toContain('text-green-700');
    expect(wrongSpan?.className).not.toContain('text-green-700');
  });

  it('should keep labeling options with letters beyond Z', () => {
    expect(fixture.componentInstance.getOptionLetter(0)).toBe('A');
    expect(fixture.componentInstance.getOptionLetter(25)).toBe('Z');
    expect(fixture.componentInstance.getOptionLetter(26)).toBe('AA');
    expect(fixture.componentInstance.getOptionLetter(27)).toBe('AB');
  });
});
