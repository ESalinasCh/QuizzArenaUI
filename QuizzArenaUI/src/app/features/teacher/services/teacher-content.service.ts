import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContentUploadRequest, Subject } from '../models/content-upload.model';

@Injectable({ providedIn: 'root' })
export class TeacherContentService {
  getSubjects(): Observable<Subject[]> {
    // TODO: replace with real HTTP call
    return of([
      { id: '1', name: 'Project I' },
      { id: '2', name: 'Arquitectura Hexagonal' },
      { id: '3', name: 'Domain Driven Design' },
    ]);
  }

  uploadContent(request: ContentUploadRequest): Observable<void> {
    // TODO: replace with real HTTP call
    console.log('uploadContent', request);
    return of(undefined);
  }
}
