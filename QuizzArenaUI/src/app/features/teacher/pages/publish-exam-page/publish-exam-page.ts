import { Component, DestroyRef, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { PublishQuizAsMatchForm } from '../../components/publish-quiz-as-match-form/publish-quiz-as-match-form';
import { CreateMatchRequestBody } from '../../api/teacher-exam.contract';
import { TeacherContentService } from '../../services/teacher-content.service';

@Component({
  selector: 'qz-teacher-publish-exam-page',
  imports: [PublishQuizAsMatchForm],
  templateUrl: './publish-exam-page.html',
})
export class TeacherPublishExamPage {
  readonly quizId = input<string>();
  readonly #router = inject(Router);
  readonly #location = inject(Location);
  readonly #examService = inject(TeacherExamService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #teacherContentService = inject(TeacherContentService);

  protected readonly backAriaLabel = $localize`:Publish exam page back button aria label:Back`;

  readonly coursesResource = rxResource({
    stream: () => this.#teacherContentService.getCourses(),
  });

  goBack(): void {
    if (window.history.length > 1) {
      this.#location.back();
    } else {
      void this.#router.navigate(['/teacher/exams/bank']);
    }
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
