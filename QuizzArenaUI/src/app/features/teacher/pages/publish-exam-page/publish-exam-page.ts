import { Component, DestroyRef, inject, input } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, filter, map, of, switchMap } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { PublishQuizAsMatchForm } from '../../components/publish-quiz-as-match-form/publish-quiz-as-match-form';
import { CreateMatchRequestBody, UpdateMatchRequestBody } from '../../api/teacher-exam.contract';
import { TeacherContentService } from '../../services/teacher-content.service';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';
import { PublishMode } from '../../models/publish-match-form.model';

@Component({
  selector: 'qz-teacher-publish-exam-page',
  imports: [PublishQuizAsMatchForm],
  templateUrl: './publish-exam-page.html',
})
export class TeacherPublishExamPage {
  readonly quizId = input<string>('');
  readonly matchId = input<string>('');
  readonly mode = input<PublishMode>('publish');
  readonly #navigationHistoryService = inject(NavigationHistoryService);
  readonly #examService = inject(TeacherExamService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #teacherContentService = inject(TeacherContentService);

  protected readonly backAriaLabel = $localize`:Publish exam page back button aria label:Back`;

  readonly coursesResource = rxResource({
    stream: () => this.#teacherContentService.getCourses(),
  });

  readonly editMatchResource = rxResource({
    stream: () => {
      if (this.mode() !== 'edit' || !this.matchId()) return of(null);
      return this.#examService.getMatches({ quizId: this.quizId() })
        .pipe(
          map(matches => matches.find(match => match.id === this.matchId())),
          filter(match => match !== undefined),
        );
    }
  });

  goBack(): void {
    this.#navigationHistoryService.back('/teacher/exams/bank');
  }

  handleSaveMatchRequest(
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

  handleUpdateMatchRequest(
    matchToUpdate: UpdateMatchRequestBody
  ): void {
    this.#examService
      .updateMatch(matchToUpdate)
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => void this.goBack());
  }
}
