import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildApiUrl, buildHttpParams } from '../../../core/utils/api-url.util';
import { PagedRequest } from '../../../core/models/pagination.model';
import { TeacherClassSource } from '../models/class-source.model';

const MOCK_CLASS_SOURCES: TeacherClassSource[] = [
  {
    id: 'classsource-uuid-1',
    name: 'Clase Project I - Semana 1',
    status: 'Completed',
    sourceType: 'Video',
    createdAt: '2026-06-01T10:00:00Z',
    processingJobsIds: [
      'aaaaaaaa-0000-0000-0000-000000000001'
    ]
  },
  {
    id: 'classsource-uuid-2',
    name: 'Clase Project I - Semana 2',
    status: 'Processing',
    sourceType: 'Document',
    createdAt: '2026-06-08T10:00:00Z',
    processingJobsIds: [
      'aaaaaaaa-0000-0000-0000-000000000002'
    ]
  },
  {
    id: 'classsource-uuid-3',
    name: 'Clase Project I - Semana 3',
    status: 'Processing',
    sourceType: 'Video',
    createdAt: '2026-06-15T10:00:00Z',
    processingJobsIds: []
  }
];

@Injectable({ providedIn: 'root' })
export class ClassSourcesService {
  readonly #http = inject(HttpClient);

  getClassSources(filters?: PagedRequest): Observable<TeacherClassSource[]> {
    const params = buildHttpParams(filters);
    return this.#http.get<TeacherClassSource[]>(buildApiUrl('/api/v1/users/me/class-sources'), { params }).pipe(
      catchError(() => {
        console.warn('API /api/v1/users/me/class-sources failed, falling back to mock data');
        return of(MOCK_CLASS_SOURCES);
      })
    );
  }
}
