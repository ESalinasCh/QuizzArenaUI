import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Exam } from '../../models/exam.model';
import { TeacherExamBankPage } from './exam-bank-page';

const MOCK_EXAMS: Exam[] = [
  { id: 'exam-draft-1', title: 'DDD Fundamentals', description: 'Core DDD', status: 'draft', questionIds: ['q1', 'q2'], createdAt: '2026-06-20T10:00:00.000Z' },
  { id: 'exam-draft-2', title: 'Hexagonal Architecture', description: 'Ports and adapters', status: 'draft', questionIds: ['q3'], createdAt: '2026-06-22T10:00:00.000Z' },
  { id: 'exam-pub-1', title: 'DDD Week 1', description: 'Published exam', status: 'published', questionIds: ['q4'], createdAt: '2026-06-15T09:00:00.000Z' },
];

describe('TeacherExamBankPage', () => {
  let mockExamService: Partial<TeacherExamService>;

  beforeEach(() => {
    mockExamService = {
      getExams: vi.fn().mockReturnValue(of(MOCK_EXAMS)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should show only draft exams', () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const drafts = fixture.componentInstance.draftExams();
    expect(drafts.length).toBe(2);
    expect(drafts.every(e => e.status === 'draft')).toBe(true);
  });

  it('should navigate to /teacher/exams/create on createExam', async () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.createExam();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/create']);
  });

  it('should navigate to publish with exam id on publishExam', () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.publishExam(MOCK_EXAMS[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/publish', 'exam-draft-1']);
  });
});
