import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadContentResponse } from '../api/teacher-content.contract';
import { mapCourseResponse, mapTeacherContentResponse } from '../api/teacher-content.mapper';
import { TEACHER_COURSES_RESPONSE_MOCK } from '../mocks/teacher-content.mock';
import { ContentUploadRequest, Subject } from '../models/content-upload.model';
import { RecentContent } from '../models/teacher-dashboard.model';
import { HttpClient } from '@angular/common/http';
import { buildApiUrl } from '../../../core/utils/api-url.util';
import { TEACHER_CONTENT_ENDPOINTS } from '../api/teacher-content.endpoints';

@Injectable({ providedIn: 'root' })
export class TeacherContentService {
  readonly #http = inject(HttpClient);

  getSubjects(): Observable<Subject[]> {
    return of(TEACHER_COURSES_RESPONSE_MOCK).pipe(
      map(courses => courses.map(mapCourseResponse)),
    );
  }

  uploadContent(request: ContentUploadRequest): Observable<RecentContent> {
    return this.#http
      .post<UploadContentResponse>(buildApiUrl(TEACHER_CONTENT_ENDPOINTS.uploadContent), {
        Name: request.className,
        File: request.file,
        CourseId: request.subjectId,
      })
      .pipe(
        map(uploaded =>
          mapTeacherContentResponse({
            ...uploaded,
            questionCount: null,
            processingMinutesRemaining: 5,
          }),
        ),
      );
  }
}
