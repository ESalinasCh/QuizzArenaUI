import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadContentResponse } from '../api/teacher-content.contract';
import { mapCourseResponse, mapTeacherContentResponse } from '../api/teacher-content.mapper';
import {
  buildUploadContentResponseMock,
  TEACHER_COURSES_RESPONSE_MOCK,
} from '../mocks/teacher-content.mock';
import { ContentUploadRequest, Subject } from '../models/content-upload.model';
import { RecentContent } from '../models/teacher-dashboard.model';

@Injectable({ providedIn: 'root' })
export class TeacherContentService {
  getSubjects(): Observable<Subject[]> {
    return of(TEACHER_COURSES_RESPONSE_MOCK).pipe(
      map(courses => courses.map(mapCourseResponse)),
    );
  }

  uploadContent(request: ContentUploadRequest): Observable<RecentContent> {
    const response: UploadContentResponse = buildUploadContentResponseMock(
      request.className,
      request.subjectId,
    );

    return of(response).pipe(
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
