import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherExamService } from './teacher-exam.service';

describe('TeacherExamService', () => {
  let service: TeacherExamService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TeacherExamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should return mapped classes with id and name', () => {
    service.getClasses().subscribe(classes => {
      expect(classes.length).toBeGreaterThan(0);
      classes.forEach(c => {
        expect(c.id).toBeTruthy();
        expect(c.name).toBeTruthy();
      });
    });
    httpMock.expectNone(() => true);
  });

  it('should return mapped exams including drafts and published', () => {
    service.getExams().subscribe(exams => {
      expect(exams.length).toBeGreaterThan(0);
      expect(exams.some(e => e.status === 'draft')).toBe(true);
      expect(exams.some(e => e.status === 'published')).toBe(true);
    });
    httpMock.expectNone(() => true);
  });

  it('should call GET /questions with correct params and return mapped questions', () => {
    const mockResponse = [
      { id: 'q1', content: 'What is DDD?', processingJobId: 'aaaaaaaa-0000-0000-0000-000000000001', status: 'Verified' },
    ];

    service.getQuestions(['aaaaaaaa-0000-0000-0000-000000000001']).subscribe(questions => {
      expect(questions.length).toBe(1);
      expect(questions[0].id).toBe('q1');
      expect(questions[0].sourceId).toBe('aaaaaaaa-0000-0000-0000-000000000001');
    });

    const req = httpMock.expectOne(r => r.url.includes('/questions'));
    expect(req.request.params.get('status')).toBe('Verified');
    expect(req.request.params.getAll('processingJobIds')).toContain('aaaaaaaa-0000-0000-0000-000000000001');
    req.flush(mockResponse);
  });

  it('should call POST /quizzes and POST /matches on createExam', () => {
    const quizResponse = { id: 'quiz-1', title: 'Test Exam', description: '', status: 'draft', questions: [{ questionId: 'q1', position: 1, valueScore: 10 }] };

    service.createExam({
      title: 'Test Exam',
      description: 'Test desc',
      origin: 'manually_created',
      questionIds: ['q1'],
      classIds: ['course-1'],
      config: { durationMinutes: 30, maxRetries: 2, shuffleQuestions: false, shuffleOptions: false, enabledFrom: '2026-07-01', enabledUntil: '2026-07-31' },
    }).subscribe(exam => {
      expect(exam.title).toBe('Test Exam');
    });

    httpMock.expectOne(r => r.url.includes('/quizzes')).flush(quizResponse);
    httpMock.expectOne(r => r.url.includes('/matches')).flush({});
  });

  it('should call POST /quizzes on saveDraftExam and return mapped exam', () => {
    const quizResponse = { id: 'draft-1', title: 'Draft Title', description: '', status: 'draft', questions: [] };

    service.saveDraftExam('Draft Title', 'Draft desc', ['q3']).subscribe(exam => {
      expect(exam.title).toBe('Draft Title');
      expect(exam.status).toBe('draft');
    });

    const req = httpMock.expectOne(r => r.url.includes('/quizzes'));
    expect(req.request.body).toEqual({ title: 'Draft Title', description: 'Draft desc', questionIds: ['q3'] });
    req.flush(quizResponse);
  });

  it('should call POST /matches on publishExam with correct body', () => {
    const config = { durationMinutes: 60, maxRetries: 1, shuffleQuestions: true, shuffleOptions: false, enabledFrom: '2026-07-01', enabledUntil: '2026-07-31' };

    service.publishExam('quiz-1', 'course-1', config).subscribe(result => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(r => r.url.includes('/matches'));
    expect(req.request.body).toEqual({
      quizId: 'quiz-1',
      courseId: 'course-1',
      startedAt: '2026-07-01',
      finishedAt: '2026-07-31',
      timeMinutes: 60,
      attemptsAmount: 1,
      shuffleQuestion: true,
      shuffleOptions: false,
    });
    req.flush({});
  });
});
