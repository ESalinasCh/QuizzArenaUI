import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseResponse, UploadContentResponse } from '../api/teacher-content.contract';
import { mapCourseResponse, mapTeacherContentResponse } from '../api/teacher-content.mapper';
import { ContentUploadRequest, Course } from '../models/content-upload.model';
import { RecentContent } from '../models/teacher-dashboard.model';
import { HttpClient } from '@angular/common/http';
import { buildApiUrl } from '../../../core/utils/api-url.util';
import { TEACHER_CONTENT_ENDPOINTS } from '../api/teacher-content.endpoints';

@Injectable({ providedIn: 'root' })
export class TeacherContentService {
  readonly #http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.#http.get<CourseResponse[]>(buildApiUrl(TEACHER_CONTENT_ENDPOINTS.courses))
      .pipe(map(courses => courses.map(mapCourseResponse)),
      );
  }

  uploadContent(request: ContentUploadRequest): Observable<RecentContent> {
    const formData = new FormData();
    formData.append('Name', request.className);
    formData.append('File', request.file);
    formData.append('CourseId', request.subjectId);

    return this.#http
      .post<UploadContentResponse>(buildApiUrl(TEACHER_CONTENT_ENDPOINTS.uploadContent), formData)
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
