import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherContentService } from './teacher-content.service';
import { buildApiUrl } from '../../../core/utils/api-url.util';
import { TEACHER_CONTENT_ENDPOINTS } from '../api/teacher-content.endpoints';
import { CourseResponse } from '../api/teacher-content.contract';
import { ContentUploadRequest } from '../models/content-upload.model';

describe('TeacherContentService', () => {
  let service: TeacherContentService;
  let httpMock: HttpTestingController;

  const uploadUrl = buildApiUrl(TEACHER_CONTENT_ENDPOINTS.uploadContent);
  const coursesUrl = buildApiUrl(TEACHER_CONTENT_ENDPOINTS.courses);

  function buildRequest(overrides: Partial<ContentUploadRequest> = {}): ContentUploadRequest {
    return {
      file: new File(['test'], 'test.mp3'),
      className: 'Test Class',
      subjectId: 'course-project-1',
      review: { enabled: false },
      ...overrides,
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TeacherContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getSubjects', () => {
    const coursesResponse: CourseResponse[] = [
      { id: 'course-project-1', name: 'Project I' },
      { id: 'course-hexagonal', name: 'Arquitectura Hexagonal' },
    ];

    it('should GET the courses endpoint and map to subjects with id and name', () => {
      let subjects: { id: string; name: string }[] | undefined;
      service.getSubjects().subscribe(result => (subjects = result));

      const req = httpMock.expectOne(coursesUrl);
      expect(req.request.method).toBe('GET');
      req.flush(coursesResponse);

      expect(subjects).toEqual([
        { id: 'course-project-1', name: 'Project I' },
        { id: 'course-hexagonal', name: 'Arquitectura Hexagonal' },
      ]);
    });

    it('should propagate an error when the request fails', () => {
      let error: unknown;
      service.getSubjects().subscribe({
        next: () => expect.unreachable('getSubjects should not emit on failure'),
        error: err => (error = err),
      });

      httpMock
        .expectOne(coursesUrl)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(error).toMatchObject({ status: 500 });
    });
  });

  describe('uploadContent', () => {
    it('should POST to the class-sources endpoint with the file and metadata', () => {
      const file = new File(['test'], 'lecture.mp3');

      service.uploadContent(buildRequest({ file })).subscribe();

      const req = httpMock.expectOne(uploadUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.get('Name')).toBe('Test Class');
      expect(req.request.body.get('CourseId')).toBe('course-project-1');
      expect(req.request.body.get('File')).toBe(file);

      req.flush(uploadResponse());
    });

    it('should map a processing response to in-progress with remaining minutes', () => {
      service.uploadContent(buildRequest()).subscribe(content => {
        expect(content.id).toBe('content-1');
        expect(content.title).toBe('Test Class');
        expect(content.status).toBe('in-progress');
        expect(content.info).toBe('5 min');
      });

      httpMock.expectOne(uploadUrl).flush(uploadResponse({ status: 'processing' }));
    });

    it('should map a processed response to processed status', () => {
      service.uploadContent(buildRequest()).subscribe(content => {
        expect(content.status).toBe('processed');
        expect(content.info).toBe('0 preg.');
      });

      httpMock.expectOne(uploadUrl).flush(uploadResponse({ status: 'processed' }));
    });

    it('should propagate an error when the upload fails', () => {
      let error: unknown;
      service.uploadContent(buildRequest()).subscribe({
        next: () => expect.unreachable('upload should not emit on failure'),
        error: err => (error = err),
      });

      httpMock
        .expectOne(uploadUrl)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(error).toMatchObject({ status: 500 });
    });

    // Backend does not support review settings yet, so they must not be sent.
    it('should not send review settings even when review is enabled', () => {
      service
        .uploadContent(
          buildRequest({
            review: {
              enabled: true,
              settings: { questionCount: 10, showCorrectAnswers: true, shuffleQuestions: false },
            },
          }),
        )
        .subscribe();

      const req = httpMock.expectOne(uploadUrl);
      expect([...(req.request.body as FormData).keys()]).toEqual(['Name', 'File', 'CourseId']);

      req.flush(uploadResponse());
    });
  });
});

function uploadResponse(overrides: Record<string, unknown> = {}) {
  return {
    id: 'content-1',
    title: 'Test Class',
    courseId: 'course-project-1',
    status: 'processing',
    createdAt: '2026-07-13T00:00:00Z',
    ...overrides,
  };
}
