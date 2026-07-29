import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchOfQuizItem } from './match-of-quiz-item';
import { Match } from '../../models/exam.model';
import { LOCALE_ID } from '@angular/core';

const MOCK_MATCH: Match = {
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

describe('MatchOfQuizItem', () => {
  let component: MatchOfQuizItem;
  let fixture: ComponentFixture<MatchOfQuizItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchOfQuizItem],
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchOfQuizItem);
    fixture.componentRef.setInput('match', MOCK_MATCH);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render course name and duration', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Course 101');
    expect(content).toContain('45');
  });

  it('should emit unpublishMatch when unpublish button is clicked', () => {
    const spy = vi.spyOn(component.unpublishMatch, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(spy).toHaveBeenCalledWith(MOCK_MATCH);
  });
});
