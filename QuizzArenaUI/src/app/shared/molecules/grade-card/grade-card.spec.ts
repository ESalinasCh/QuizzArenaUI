import { TestBed } from '@angular/core/testing';
import { GradeCard } from './grade-card';
import { Grade } from '../../../features/teacher/models/exam.model';

describe('GradeCard', () => {
  const buildGrade = (withAttempts = true): Grade => ({
    id: 'grade-1',
    nickname: 'Alice',
    status: 'Completed',
    score: 95,
    userId: 'user-1',
    matchId: 'match-1',
    otherAttempts: withAttempts
      ? [{ id: 'attempt-1', nickname: 'Bob', status: 'InProgress', score: 80 }]
      : [],
  });

  it('should render the nickname, status and score', () => {
    const fixture = TestBed.createComponent(GradeCard);
    fixture.componentRef.setInput('grade', buildGrade(false));
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Alice');
    expect(text).toContain('95');
    expect(text).toContain('Score');
    expect(fixture.nativeElement.querySelectorAll('qz-grade-status-label').length).toBe(1);
  });

  it('should not show the attempts button when there are no other attempts', () => {
    const fixture = TestBed.createComponent(GradeCard);
    fixture.componentRef.setInput('grade', buildGrade(false));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('should emit the grade id when the attempts toggle is clicked', () => {
    const fixture = TestBed.createComponent(GradeCard);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('grade', buildGrade());
    fixture.detectChanges();
    let emittedId: string | undefined;
    component.toggleAttempts.subscribe(id => {
      emittedId = id;
    });
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(emittedId).toBe('grade-1');
  });

  it('should render the other attempts section when expanded is true', () => {
    const fixture = TestBed.createComponent(GradeCard);
    fixture.componentRef.setInput('grade', buildGrade());
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Other attempts');
    expect(text).toContain('Bob');
    expect(text).toContain('80');
    expect(fixture.nativeElement.querySelectorAll('.rounded-lg').length).toBe(1);
  });
});
