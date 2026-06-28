import { TeacherContentResponse, TeacherQuizStatsResponse, CourseResponse } from './teacher-content.contract';
import { mapTeacherDashboardResponse, mapTeacherContentResponse, mapCourseResponse } from './teacher-content.mapper';

describe('teacher-content.mapper', () => {
  describe('mapTeacherDashboardResponse', () => {
    it('should map stats and contents to dashboard', () => {
      const stats: TeacherQuizStatsResponse = { quizCount: 5, publishedCount: 3 };
      const contents: TeacherContentResponse[] = [
        { id: '1', title: 'Content 1', courseId: 'c1', status: 'processed', questionCount: 10, processingMinutesRemaining: null, createdAt: '2026-06-01' },
      ];

      const result = mapTeacherDashboardResponse(stats, contents);
      expect(result.quizCount).toBe(5);
      expect(result.publishedCount).toBe(3);
      expect(result.recentContent.length).toBe(1);
      expect(result.recentContent[0].title).toBe('Content 1');
    });
  });

  describe('mapTeacherContentResponse', () => {
    it('should map processed content', () => {
      const response: TeacherContentResponse = {
        id: '1', title: 'Content 1', courseId: 'c1', status: 'processed',
        questionCount: 10, processingMinutesRemaining: null, createdAt: '2026-06-01',
      };

      const result = mapTeacherContentResponse(response);
      expect(result.status).toBe('processed');
      expect(result.info).toContain('preg.');
    });

    it('should map processing content', () => {
      const response: TeacherContentResponse = {
        id: '2', title: 'Content 2', courseId: 'c2', status: 'processing',
        questionCount: null, processingMinutesRemaining: 5, createdAt: '2026-06-02',
      };

      const result = mapTeacherContentResponse(response);
      expect(result.status).toBe('in-progress');
      expect(result.info).toContain('min');
    });
  });

  describe('mapCourseResponse', () => {
    it('should map course response to subject', () => {
      const response: CourseResponse = { id: 'c1', name: 'Project I' };

      const result = mapCourseResponse(response);
      expect(result.id).toBe('c1');
      expect(result.name).toBe('Project I');
    });
  });
});
