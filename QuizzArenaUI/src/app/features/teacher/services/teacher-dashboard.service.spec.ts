import { TestBed } from '@angular/core/testing';
import { TeacherDashboardService } from './teacher-dashboard.service';

describe('TeacherDashboardService', () => {
  let service: TeacherDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherDashboardService);
  });

  it('should return dashboard with numeric counts and recent content', () => {
    service.getDashboard().subscribe(dashboard => {
      expect(typeof dashboard.quizCount).toBe('number');
      expect(typeof dashboard.publishedCount).toBe('number');
      expect(dashboard.recentContent.length).toBeGreaterThan(0);
      dashboard.recentContent.forEach(c => expect(c.title).toBeTruthy());
    });
  });

  it('should map content status to processed or in-progress', () => {
    service.getDashboard().subscribe(dashboard => {
      const validStatuses = ['processed', 'in-progress'];
      dashboard.recentContent.forEach(c => {
        expect(validStatuses).toContain(c.status);
      });
    });
  });
});
