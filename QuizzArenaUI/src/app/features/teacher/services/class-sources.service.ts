import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ClassSourceItem {
  id: string;
  name: string;
  status: string;
  sourceType: string;
  createdAt: string;
  processingJobIds: string[];
}

const MOCK_CLASS_SOURCES: ClassSourceItem[] = [
  {
    id: 'classsource-uuid-1',
    name: 'Clase Project I - Semana 1',
    status: 'Processed',
    sourceType: 'Video',
    createdAt: '2026-06-01T10:00:00Z',
    processingJobIds: [
      'aaaaaaaa-0000-0000-0000-000000000001',
      'aaaaaaaa-0000-0000-0000-000000000001',
      'aaaaaaaa-0000-0000-0000-000000000001'
    ]
  },
  {
    id: 'classsource-uuid-2',
    name: 'Clase Project I - Semana 2',
    status: 'Processed',
    sourceType: 'Document',
    createdAt: '2026-06-08T10:00:00Z',
    processingJobIds: [
      'aaaaaaaa-0000-0000-0000-000000000002'
    ]
  },
  {
    id: 'classsource-uuid-3',
    name: 'Clase Project I - Semana 3',
    status: 'Processing',
    sourceType: 'Video',
    createdAt: '2026-06-15T10:00:00Z',
    processingJobIds: []
  }
];

@Injectable({ providedIn: 'root' })
export class ClassSourcesService {
  readonly #http = inject(HttpClient);
  readonly #api = environment.apiBaseUrl;

  getClassSources(): Observable<ClassSourceItem[]> {
    return this.#http.get<ClassSourceItem[]>(`${this.#api}/api/v1/class-sources`).pipe(
      catchError(() => {
        console.warn('API /api/v1/class-sources failed, falling back to mock data');
        return of(MOCK_CLASS_SOURCES);
      })
    );
  }
}
