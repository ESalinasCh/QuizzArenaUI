import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TeacherDashboard } from '../models/teacher-dashboard.model';

@Injectable({ providedIn: 'root' })
export class TeacherDashboardService {
  getDashboard(): Observable<TeacherDashboard> {
    // TODO: replace with real HTTP call
    return of({
      quizCount: 8,
      publishedCount: 8,
      recentContent: [
        {
          id: '1',
          title: 'Clase Project I - Semana 1',
          status: 'processed',
          info: '12 preg.',
        },
        {
          id: '2',
          title: 'Clase Project I - Semana 2',
          status: 'processed',
          info: '10 preg.',
        },
        {
          id: '3',
          title: 'Clase Hexagonal - Semana 3',
          status: 'in-progress',
          info: '5 min',
        },
        {
          id: '4',
          title: 'Clase Hexagonal - Semana 2',
          status: 'in-progress',
          info: '1 min',
        },
      ],
    });
  }
}
