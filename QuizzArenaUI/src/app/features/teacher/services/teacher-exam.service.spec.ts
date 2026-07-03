import { TestBed } from '@angular/core/testing';
import { TeacherExamService } from './teacher-exam.service';

describe('TeacherExamService', () => {
  let service: TeacherExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherExamService);
  });

  it('should return mapped classes with id and name', () => {
    service.getClasses().subscribe(classes => {
      expect(classes.length).toBeGreaterThan(0);
      classes.forEach(c => {
        expect(c.id).toBeTruthy();
        expect(c.name).toBeTruthy();
      });
    });
  });

  it('should return mapped questions', () => {
    service.getQuestions(['aaaaaaaa-0000-0000-0000-000000000001']).subscribe(questions => {
      expect(Array.isArray(questions)).toBe(true);
    });
  });

  it('should return mapped exams including drafts and published', () => {
    service.getExams().subscribe(exams => {
      expect(exams.length).toBe(4);
      expect(exams.some(e => e.status === 'draft')).toBe(true);
      expect(exams.some(e => e.status === 'published')).toBe(true);
    });
  });

  it('should create a published exam with correct fields', () => {
    service.createExam({
      title: 'Test Exam',
      description: 'Test desc',
      origin: 'manually_created',
      questionIds: ['q1', 'q2'],
      classIds: ['aaaaaaaa-0000-0000-0000-000000000001'],
      config: {
        durationMinutes: 30,
        maxRetries: 2,
        shuffleQuestions: false,
        shuffleOptions: false,
        enabledFrom: '2026-07-01',
        enabledUntil: '2026-07-31',
      },
    }).subscribe(exam => {
      expect(exam.title).toBe('Test Exam');
      expect(exam.status).toBe('published');
      expect(exam.questionIds).toEqual(['q1', 'q2']);
    });
  });

  it('should save a draft exam with correct fields', () => {
    service.saveDraftExam('Draft Title', 'Draft desc', ['q3']).subscribe(exam => {
      expect(exam.title).toBe('Draft Title');
      expect(exam.status).toBe('draft');
      expect(exam.questionIds).toEqual(['q3']);
    });
  });
});
