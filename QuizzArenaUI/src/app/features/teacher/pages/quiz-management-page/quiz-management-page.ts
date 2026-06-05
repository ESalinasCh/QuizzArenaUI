import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-teacher-quiz-management-page',
  standalone: true,
  templateUrl: './quiz-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherQuizManagementPage {}
