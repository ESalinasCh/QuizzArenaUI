import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapTeacherDashboardResponse } from '../api/teacher-content.mapper';
import {
  TEACHER_CONTENTS_RESPONSE_MOCK,
  TEACHER_QUIZ_STATS_RESPONSE_MOCK,
} from '../mocks/teacher-content.mock';
import { TeacherDashboard } from '../models/teacher-dashboard.model';

@Injectable({ providedIn: 'root' })
export class TeacherDashboardService {
  getDashboard(): Observable<TeacherDashboard> {
    return of({
      stats: TEACHER_QUIZ_STATS_RESPONSE_MOCK,
      contents: TEACHER_CONTENTS_RESPONSE_MOCK,
    }).pipe(map(({ stats, contents }) => mapTeacherDashboardResponse(stats, contents)));
  }
}
