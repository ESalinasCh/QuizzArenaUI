import { Component, DestroyRef, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { PublishQuizAsMatchForm } from '../../components/publish-quiz-as-match-form/publish-quiz-as-match-form';
import { CreateMatchRequestBody } from '../../api/teacher-exam.contract';

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


  protected readonly backAriaLabel = $localize`:Publish exam page back button aria label:Back`;

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
    const id = this.quizId();
    if (!id) return;
    examToPublish.quizId = id;

    this.#examService
      .publishExam(examToPublish)
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => void this.goBack());
  }
}
