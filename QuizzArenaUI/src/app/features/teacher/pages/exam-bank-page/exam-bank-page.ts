import { Component, computed, debounced, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatchFilters, QuizAsExamRequest, TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { ExamBankItem } from '../../components/exam-bank-item/exam-bank-item';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { map, switchMap, take, tap } from 'rxjs';
import { MatchesForQuizPipe } from "../../pipes/matches-for-quiz.pipe";
import { Match } from '../../models/exam.model';
@Component({
  selector: 'qz-teacher-exam-bank-page',
  imports: [Button, Icon, ItemContainer, ExamBankItem, MatchesForQuizPipe],
  templateUrl: './exam-bank-page.html',
})
export class TeacherExamBankPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  readonly searchQuery = signal('');
  readonly debouncedSearchQuery = debounced(this.searchQuery, 300);
  readonly pageSizeForQuizAsExams = signal(DEFAULT_PAGE_SIZE);
  readonly pageForQuizAsExams = signal(1);
  readonly pageSizeForMatches = signal(100);
  readonly pageForMatches = signal(1);

  protected readonly createExamAriaLabel = $localize`:Exam bank create exam button aria label:Create exam`;

  // #accumulatedQuizzes: QuizResponseAsExams[] = [];
  // readonly quizzesAsExamsResource = rxResource<QuizResponseAsExams[], QuizAsExamRequest>({
  //   defaultValue: [],
  //   params: () => ({
  //     search: this.debouncedSearchQuery.value() ?? '',
  //     pageSize: this.pageSizeForQuizAsExams(),
  //     page: this.pageForQuizAsExams(),
  //   }),
  //   stream: ({ params }) =>
  //     this.#examService.getQuizzesAsExams(params).pipe(
  //       map((quizzesResponse: QuizResponseAsExams[]) => {
  //         this.hasMoreQuizzesAsExams.set(quizzesResponse.length === params.pageSize);
  //         if (params.page === 1) {
  //           this.#accumulatedQuizzes = quizzesResponse;
  //           return quizzesResponse;
  //         } else {
  //           this.#accumulatedQuizzes.push(...quizzesResponse);
  //           return this.#accumulatedQuizzes;
  //         }
  //       }),
  //     ),
  // });
  // readonly hasMoreQuizzesAsExams = signal(false);
  // loadMoreQuizzesAsExams(): void {
  //   this.pageForQuizAsExams.update(pag => pag + 1);
  // }

  readonly quizzesAsExams = signal<QuizResponseAsExams[]>([]);
  readonly quizzesAsExamsResource = rxResource<void, QuizAsExamRequest>({
    params: () => ({
      search: this.debouncedSearchQuery.value() ?? '',
      pageSize: this.pageSizeForQuizAsExams(),
      page: this.pageForQuizAsExams(),
    }),
    stream: ({ params }) =>
      this.#examService.getQuizzesAsExams(params).pipe(
        take(1),
        map((response) => {
          this.hasMoreQuizzesAsExams.set(response.length === params.pageSize);
          if (params.page === 1) {
            this.quizzesAsExams.set(response);
          } else {
            this.quizzesAsExams.update(quizzes => [...quizzes, ...response]);
          }
          return void response;
        })),

  });



  readonly hasMoreQuizzesAsExams = signal(false);
  loadMoreQuizzesAsExams(): void {
    this.pageForQuizAsExams.update(pag => pag + 1);
  }

  #accumulatedMatches: Match[] = [];
  readonly matchesResource = rxResource<Match[], MatchFilters>({
    defaultValue: [],
    params: () => ({
      pageSize: this.pageSizeForMatches(),
      page: this.pageForMatches(),
      mode: 'Exam',
      status: 'Active',
    }),
    stream: ({ params }) => this.#examService.getMatches(params).pipe(
      map(resp => {
        if (params.page === 1) {
          this.#accumulatedMatches = resp;
        } else {
          this.#accumulatedMatches = [...this.#accumulatedMatches, ...resp];
        }
        return this.#accumulatedMatches;
      })
    ),
  });

  readonly matchesByQuiz = computed(() => {
    const allMatches = this.matchesResource.value() ?? [];
    console.log('allMatches', this.matchesResource.value())
    const dictionary: Record<string, Match[]> = {};

    for (const match of allMatches) {
      if (!dictionary[match.quizId || '']) {
        dictionary[match.quizId || ''] = [];
      }
      dictionary[match.quizId || ''].push(match);
    }

    console.log(dictionary)
    return dictionary;
  });


  async createExam(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/create']);
  }

  publishExam(exam: QuizResponseAsExams): void {
    void this.#router.navigate(['/teacher/exams/publish', exam.id]);
  }

  async goToQuizMatches(quizId: string): Promise<void> {
    await this.#router.navigate(['/teacher/exams/bank', quizId, 'matches']);
  }

  unpublishMatch(match: Match): void {
    this.#examService.unpublishMatch(match.id).pipe(take(1)).subscribe({
      next: () => {
        this.matchesResource.value.update(currentMatches => {
          const matches = currentMatches ?? [];
          return matches.filter(m => m.id !== match.id);
        });
      },
    });
  }
}
