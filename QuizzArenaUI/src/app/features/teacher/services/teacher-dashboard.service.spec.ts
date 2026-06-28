import { TestBed } from '@angular/core/testing';
import { TeacherDashboardService } from './teacher-dashboard.service';

describe('TeacherDashboardService', () => {
  let service: TeacherDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherDashboardService);
  });

  it('should return dashboard with quiz count, published count, and recent content', () => {
    service.getDashboard().subscribe(dashboard => {
      expect(dashboard.quizCount).toBe(8);
      expect(dashboard.publishedCount).toBe(8);
      expect(dashboard.recentContent.length).toBeGreaterThan(0);
      expect(dashboard.recentContent[0].title).toBe('Clase Project I - Semana 1');
    });
  });

  it('should map content status correctly', () => {
    service.getDashboard().subscribe(dashboard => {
      const processed = dashboard.recentContent.find(c => c.title.includes('Project'));
      const processing = dashboard.recentContent.find(c => c.title.includes('Hexagonal'));
      expect(processed?.status).toBe('processed');
      expect(processing?.status).toBe('in-progress');
    });
  });
});
