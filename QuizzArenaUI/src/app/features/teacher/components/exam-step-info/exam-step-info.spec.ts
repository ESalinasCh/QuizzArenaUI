import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExamStepInfo, ExamInfoData } from './exam-step-info';

const MOCK_CLASSES = [
  { id: 'cls-1', name: 'DDD Week 1' },
  { id: 'cls-2', name: 'Hexagonal Week 1' },
];

describe('ExamStepInfo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    });
  });

  it('should render class names', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('DDD Week 1');
    expect(fixture.nativeElement.textContent).toContain('Hexagonal Week 1');
  });

  it('should show title required error on empty submit', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Title is required.');
  });

  it('should show minlength error on short title', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    fixture.componentInstance.form.controls.title.setValue('ab');
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Title must be at least 3 characters.');
  });

  it('should show no-classes error when no class selected on submit', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    fixture.componentInstance.form.controls.title.setValue('Valid Title');
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Please select at least one class.');
  });

  it('should toggle class selection', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    expect(fixture.componentInstance.isClassSelected('cls-1')).toBe(false);
    fixture.componentInstance.toggleClass('cls-1');
    expect(fixture.componentInstance.isClassSelected('cls-1')).toBe(true);
    fixture.componentInstance.toggleClass('cls-1');
    expect(fixture.componentInstance.isClassSelected('cls-1')).toBe(false);
  });

  it('should emit ExamInfoData on valid submit', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    let emitted: ExamInfoData | undefined;
    fixture.componentInstance.next.subscribe((data: ExamInfoData) => (emitted = data));

    fixture.componentInstance.form.controls.title.setValue('My Exam');
    fixture.componentInstance.form.controls.description.setValue('A description');
    fixture.componentInstance.toggleClass('cls-1');
    fixture.componentInstance.submit();

    expect(emitted).toEqual({
      title: 'My Exam',
      description: 'A description',
      classIds: ['cls-1'],
    });
  });

  it('should not emit when form is invalid', () => {
    const fixture = TestBed.createComponent(ExamStepInfo);
    fixture.componentRef.setInput('classes', MOCK_CLASSES);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.next.subscribe(() => (emitted = true));

    fixture.componentInstance.submit();

    expect(emitted).toBe(false);
  });
});
