import { mapClassSourceResponse, mapExamResponse, mapQuestionResponse } from './teacher-exam.mapper';
import { ClassSourceResponse, ExamResponse, QuestionResponse } from './teacher-exam.contract';

describe('teacher-exam.mapper', () => {
  describe('mapClassSourceResponse', () => {
    it('should map id and name', () => {
      const response: ClassSourceResponse = { id: 'cls-1', name: 'DDD Week 1' };
      const result = mapClassSourceResponse(response);
      expect(result.id).toBe('cls-1');
      expect(result.name).toBe('DDD Week 1');
    });
  });

  describe('mapQuestionResponse', () => {
    it('should map all question fields', () => {
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
    });
  });

  describe('mapExamResponse', () => {
    it('should map published status', () => {
      const response: ExamResponse = {
        id: 'exam-1', title: 'Exam 1', description: '', status: 'published',
        questionIds: ['q1'], createdAt: '2026-06-25',
      };
      const result = mapExamResponse(response);
      expect(result.status).toBe('published');
      expect(result.id).toBe('exam-1');
      expect(result.questionIds).toEqual(['q1']);
    });

    it('should map non-published status to draft', () => {
      const response: ExamResponse = {
        id: 'exam-2', title: 'Exam 2', description: '', status: 'draft',
        questionIds: [], createdAt: '2026-06-25',
      };
      const result = mapExamResponse(response);
      expect(result.status).toBe('draft');
    });
  });
});
