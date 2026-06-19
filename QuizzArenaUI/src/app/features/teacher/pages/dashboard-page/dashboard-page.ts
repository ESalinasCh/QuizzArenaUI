import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'qz-teacher-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherDashboardPage {}
