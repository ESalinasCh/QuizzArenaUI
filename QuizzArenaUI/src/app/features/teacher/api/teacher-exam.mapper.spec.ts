import {
  mapClassSourceResponse,
  mapCreateQuizResponse,
  mapExamResponse,
  mapQuestionResponse,
} from './teacher-exam.mapper';
import {
  ClassSourceResponse,
  CreateQuizResponseBody,
  ExamResponse,
  QuestionResponse,
} from './teacher-exam.contract';

describe('teacher-exam.mapper', () => {
  describe('mapClassSourceResponse', () => {
    it('maps id and name', () => {
      const response: ClassSourceResponse = { id: 'cls-1', name: 'DDD Week 1' };
      expect(mapClassSourceResponse(response)).toEqual({ id: 'cls-1', name: 'DDD Week 1' });
    });
  });

  describe('mapQuestionResponse', () => {
    it('maps id, content as text and processingJobId as sourceId', () => {
      const response: QuestionResponse = {
        id: 'q1',
        content: 'What is DDD?',
        processingJobId: 'aaaaaaaa-0000-0000-0000-000000000001',
        status: 'verified',
      };
      const result = mapQuestionResponse(response);
      expect(result.id).toBe('q1');
      expect(result.text).toBe('What is DDD?');
      expect(result.sourceId).toBe('aaaaaaaa-0000-0000-0000-000000000001');
      expect(result.options).toEqual([]);
      expect(result.sourceName).toBe('');
    });
  });

  describe('mapExamResponse', () => {
    const base: ExamResponse = {
      id: 'exam-1',
      title: 'Exam 1',
      description: 'Some description',
      status: 'draft',
      questionIds: [],
      createdAt: '2026-06-25',
    };

    it('maps scalar fields directly', () => {
      const result = mapExamResponse({ ...base, questionIds: ['q1'] });
      expect(result.id).toBe('exam-1');
      expect(result.title).toBe('Exam 1');
      expect(result.description).toBe('Some description');
      expect(result.createdAt).toBe('2026-06-25');
    });

    it('maps "published" status to "published"', () => {
      const result = mapExamResponse({ ...base, status: 'published' });
      expect(result.status).toBe('published');
    });

    it('maps any non-published status to "draft"', () => {
      expect(mapExamResponse({ ...base, status: 'draft' }).status).toBe('draft');
      expect(mapExamResponse({ ...base, status: 'archived' }).status).toBe('draft');
    });

    it('uses questionIds when present', () => {
      const result = mapExamResponse({ ...base, questionIds: ['q1', 'q2'] });
      expect(result.questionIds).toEqual(['q1', 'q2']);
    });

    it('falls back to questions[].questionId when questionIds is empty', () => {
      const result = mapExamResponse({
        ...base,
        questionIds: [],
        questions: [{ questionId: 'qA' }, { questionId: 'qB' }],
      });
      expect(result.questionIds).toEqual(['qA', 'qB']);
    });

    it('falls back to questions[].id when questionId is absent', () => {
      const result = mapExamResponse({
        ...base,
        questionIds: [],
        questions: [{ id: 'qX' }],
      });
      expect(result.questionIds).toEqual(['qX']);
    });

    it('returns empty array when both questionIds and questions are absent', () => {
      const result = mapExamResponse({ ...base, questionIds: [] });
      expect(result.questionIds).toEqual([]);
    });
  });

  describe('mapCreateQuizResponse', () => {
    const base: CreateQuizResponseBody = {
      id: 'quiz-1',
      title: 'Quiz Title',
      description: 'Quiz Desc',
      status: 'draft',
      questions: [
        { questionId: 'q-1', position: 1, valueScore: 1 },
        { questionId: 'q-2', position: 2, valueScore: 1 },
      ],
    };

    it('maps scalar fields', () => {
      const result = mapCreateQuizResponse(base);
      expect(result.id).toBe('quiz-1');
      expect(result.title).toBe('Quiz Title');
      expect(result.description).toBe('Quiz Desc');
    });

    it('extracts questionIds from questions array', () => {
      expect(mapCreateQuizResponse(base).questionIds).toEqual(['q-1', 'q-2']);
    });

    it('returns empty questionIds when questions is empty', () => {
      expect(mapCreateQuizResponse({ ...base, questions: [] as { questionId: string; position: number; valueScore: number }[] }).questionIds).toEqual([]);
    });

    it('maps "published" status correctly', () => {
      expect(mapCreateQuizResponse({ ...base, status: 'published' }).status).toBe('published');
    });

    it('maps non-published status to "draft"', () => {
      expect(mapCreateQuizResponse({ ...base, status: 'draft' }).status).toBe('draft');
    });

    it('sets createdAt to a current ISO string', () => {
      const before = new Date().toISOString();
      const result = mapCreateQuizResponse(base);
      const after = new Date().toISOString();
      expect(result.createdAt >= before).toBe(true);
      expect(result.createdAt <= after).toBe(true);
    });
  });
});
