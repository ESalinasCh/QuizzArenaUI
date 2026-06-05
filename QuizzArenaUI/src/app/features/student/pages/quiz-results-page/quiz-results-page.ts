import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-student-quiz-results-page',
  standalone: true,
  templateUrl: './quiz-results-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizResultsPage {}
