import { TestBed } from '@angular/core/testing';
import { TeacherContentService } from './teacher-content.service';

describe('TeacherContentService', () => {
  let service: TeacherContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherContentService);
  });

  it('should return mapped subjects', () => {
    service.getSubjects().subscribe(subjects => {
      expect(subjects.length).toBe(3);
      expect(subjects[0].name).toBe('Project I');
      expect(subjects[1].name).toBe('Arquitectura Hexagonal');
    });
  });

  it('should upload content and return RecentContent', () => {
    const mockFile = new File(['test'], 'test.mp3');
    service.uploadContent({
      file: mockFile,
      className: 'Test Class',
      subjectId: 'course-project-1',
      review: { enabled: false },
    }).subscribe(content => {
      expect(content.title).toBe('Test Class');
      expect(content.status).toBe('in-progress');
    });
  });
});
