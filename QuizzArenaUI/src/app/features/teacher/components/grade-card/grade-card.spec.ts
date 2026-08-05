import { TestBed } from '@angular/core/testing';
import { GradeCard } from './grade-card';
import { Grade } from '../../models/exam.model';

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

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    expect(buttons.some((button) => button.textContent?.includes('other attempts'))).toBe(false);
  });

  it('should emit the grade id when view attempt is clicked', () => {
    const fixture = TestBed.createComponent(GradeCard);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('grade', buildGrade(false));
    fixture.detectChanges();
    let emittedId: string | undefined;
    component.viewResults.subscribe((id) => (emittedId = id));

    const viewButton = fixture.nativeElement.querySelector('qz-button button') as HTMLButtonElement;
    viewButton.click();

    expect(emittedId).toBe('grade-1');
  });

  it('should emit the attempt id when view attempt is clicked on another attempt', () => {
    const fixture = TestBed.createComponent(GradeCard);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('grade', {
      ...buildGrade(),
      otherAttempts: [{ id: 'attempt-1', nickname: 'Bob', status: 'Completed', score: 80 }],
    } as Grade);
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    let emittedId: string | undefined;
    component.viewResults.subscribe((id) => (emittedId = id));

    const viewButtons = Array.from(
      fixture.nativeElement.querySelectorAll('qz-button button') as NodeListOf<HTMLButtonElement>,
    );
    viewButtons[viewButtons.length - 1].click();

    expect(emittedId).toBe('attempt-1');
  });

  it('should not render the view attempt button for an in progress grade', () => {
    const fixture = TestBed.createComponent(GradeCard);
    fixture.componentRef.setInput('grade', { ...buildGrade(false), status: 'InProgress' } as Grade);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('qz-button').length).toBe(0);
  });

  it('should emit the grade id when the attempts toggle is clicked', () => {
    const fixture = TestBed.createComponent(GradeCard);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('grade', buildGrade());
    fixture.detectChanges();
    let emittedId: string | undefined;
    component.toggleAttempts.subscribe((id) => {
      emittedId = id;
    });

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    const toggleButton = buttons.find((button) => button.textContent?.includes('other attempts'));

    toggleButton?.click();
    expect(emittedId).toBe('grade-1');
  });

  it('should open the menu and emit resetAttempts when reset is clicked', () => {
    const fixture = TestBed.createComponent(GradeCard);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('grade', buildGrade());
    fixture.detectChanges();

    expect(component.menuOpen()).toBe(false);
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    const menuButton = buttons.find((button) => button.textContent?.trim() === '⋮');
    menuButton?.click();
    fixture.detectChanges();

    expect(component.menuOpen()).toBe(true);
    const buttonsAfterOpen = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );

    const resetButton = buttonsAfterOpen.find(
      (button) => button.textContent?.trim() === 'Reset attempts',
    );

    let emittedId: string | undefined;
    component.resetAttempts.subscribe((id) => (emittedId = id));
    resetButton?.click();

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
  });
});
