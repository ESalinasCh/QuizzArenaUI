import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { QuestionBankService } from './question-bank.service';
import { environment } from '../../../../environments/environment';
import { Question } from '../models/question';

describe('QuestionBankService', () => {
  let service: QuestionBankService;
  let httpTesting: HttpTestingController;
  const questionsUrl = `${environment.apiBaseUrl}/api/v1/questions`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(QuestionBankService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch verified questions with default pagination', () => {
    const questions: Question[] = [{ ...new Question(), id: 'question-1', content: 'Question 1' }];

    service.getQuestions().subscribe(result => {
      expect(result).toEqual(questions);
    });

    const req = httpTesting.expectOne(request => request.url === questionsUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('Page')).toBe('0');
    expect(req.request.params.get('PageSize')).toBe('5');
    expect(req.request.params.has('ProcessingJobIds')).toBe(false);
    expect(req.request.params.has('QuestionIds')).toBe(false);
    expect(req.request.params.get('Status')).toBe('Verified');

    req.flush(questions);
  });

  it('should fetch questions with provided filters', () => {
    service.getQuestions({
      page: 2,
      pageSize: 10,
      processingJobsIds: ['job-1', 'job-2'],
      status: 'Draft',
    }).subscribe(result => {
      expect(result).toEqual([]);
    });

    const req = httpTesting.expectOne(request => request.url === questionsUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('Page')).toBe('2');
    expect(req.request.params.get('PageSize')).toBe('10');
    expect(req.request.params.getAll('ProcessingJobIds')).toEqual(['job-1', 'job-2']);
    expect(req.request.params.get('Status')).toBe('Draft');

    req.flush([]);
  });

  it('should send each questionIds entry as a repeated QuestionIds param', () => {
    service.getQuestions({ questionIds: ['q-1', 'q-2'] }).subscribe();

    const req = httpTesting.expectOne(request => request.url === questionsUrl);

    expect(req.request.params.getAll('QuestionIds')).toEqual(['q-1', 'q-2']);
    req.flush([]);
  });

  it('should complete addQuestion without calling the API', () => {
    service.addQuestion().subscribe(result => {
      expect(result).toBeUndefined();
    });
  });

  it('should patch only changed question fields', () => {
    service.updateQuestion('fallback-id', {
      id: 'question-1',
      content: 'Updated content',
      justification: 'Updated justification',
      status: 'Verified',
      type: 'MultipleChoice',
      options: [
        {
          optionId: 'option-1',
          description: 'Option 1',
          isCorrect: true,
          position: 1,
        },
      ],
    }).subscribe();

    const req = httpTesting.expectOne(questionsUrl);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      questionId: 'question-1',
      content: 'Updated content',
      justification: 'Updated justification',
      status: 'Verified',
      type: 'MultipleChoice',
      options: [
        {
          optionId: 'option-1',
          description: 'Option 1',
          isCorrect: true,
          position: 1,
        },
      ],
    });

    req.flush({});
  });

  it('should use fallback question id and option id when updating a full question', () => {
    const question = new Question();
    question.content = 'Updated content';
    question.options = [
      {
        id: 'option-1',
        description: 'Option 1',
        isCorrect: false,
        position: 1,
        questionId: 'question-1',
      },
    ];

    service.updateQuestion('question-1', question).subscribe();

    const req = httpTesting.expectOne(questionsUrl);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      questionId: 'question-1',
      content: 'Updated content',
      justification: '',
      status: 'Draft',
      type: 'SingleChoice',
      options: [
        {
          optionId: 'option-1',
          description: 'Option 1',
          isCorrect: false,
          position: 1,
        },
      ],
    });

    req.flush({});
  });

  it('should delete a question by id', () => {
    service.deleteQuestion('question-1').subscribe();

    const req = httpTesting.expectOne(`${questionsUrl}/question-1`);

    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
