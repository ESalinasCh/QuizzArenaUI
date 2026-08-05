import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchOfQuizItem } from './match-of-quiz-item';
import { Match } from '../../models/exam.model';
import { LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

const MOCK_ACTIVE_MATCH: Match = {
  id: 'm1',
  title: 'M1',
  courseName: 'Course 101',
  questionCount: 5,
  professorName: 'Prof',
  duration: 45,
  status: 'Active',
  startedAt: '2026-01-01T00:00:00Z',
  finishedAt: '2026-01-01T01:00:00Z',
};

const MOCK_PENDING_MATCH: Match = {
  id: 'm2',
  title: 'M2',
  courseName: 'Course 102',
  questionCount: 10,
  professorName: 'Prof 2',
  duration: 60,
  status: 'Pending',
};

describe('MatchOfQuizItem', () => {
  let component: MatchOfQuizItem;
  let fixture: ComponentFixture<MatchOfQuizItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchOfQuizItem],
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'en' }],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchOfQuizItem);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    fixture.componentRef.setInput('match', MOCK_ACTIVE_MATCH);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render course name and duration', () => {
    fixture.detectChanges();
    const content: string = fixture.nativeElement.textContent;
    expect(content).toContain('Course 101');
    expect(content).toContain('45');
  });

  it('should emit unpublishMatch when status is Active and unpublish button is clicked', () => {
    const spy = vi.spyOn(component.unpublishMatch, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;
    button?.click();

    expect(spy).toHaveBeenCalledWith(MOCK_ACTIVE_MATCH);
  });

  it('should emit publishMatch when status is Pending and publish button is clicked', () => {
    fixture.componentRef.setInput('match', MOCK_PENDING_MATCH);
    fixture.detectChanges();

    const spy = vi.spyOn(component.publishMatch, 'emit');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;
    button?.click();

    expect(spy).toHaveBeenCalledWith(MOCK_PENDING_MATCH);
  });
});
