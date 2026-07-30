import { Component, DestroyRef, inject, input } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { PublishQuizAsMatchForm } from '../../components/publish-quiz-as-match-form/publish-quiz-as-match-form';
import { CreateMatchRequestBody } from '../../api/teacher-exam.contract';
import { TeacherContentService } from '../../services/teacher-content.service';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';

@Component({
  selector: 'qz-teacher-publish-exam-page',
  imports: [PublishQuizAsMatchForm],
  templateUrl: './publish-exam-page.html',
})
export class TeacherPublishExamPage {
  readonly quizId = input<string>();
  readonly #navigationHistoryService = inject(NavigationHistoryService);
  readonly #examService = inject(TeacherExamService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #teacherContentService = inject(TeacherContentService);

  protected readonly backAriaLabel = $localize`:Publish exam page back button aria label:Back`;

  readonly coursesResource = rxResource({
    stream: () => this.#teacherContentService.getCourses(),
  });

  goBack(): void {
    this.#navigationHistoryService.back('/teacher/exams/bank');
  }

  handleMatchRequest(
    examToPublish: CreateMatchRequestBody
  ): void {
    this.#examService
      .saveMatch(examToPublish)
      .pipe(
        switchMap(resp => this.#examService.activateMatchAsActiveExam(resp.id)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => void this.goBack());
  }
}
