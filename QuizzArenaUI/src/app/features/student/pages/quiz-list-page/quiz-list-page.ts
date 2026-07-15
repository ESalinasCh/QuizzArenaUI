import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { SectionTitle } from '../../../../shared/molecules/section-title/section-title';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { QuizAccessForm } from '../../components/quiz-access-form/quiz-access-form';
import { RecentQuizCard } from '../../components/recent-quiz-card/recent-quiz-card';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-quiz-list-page',
  imports: [AvailableQuizCard, QuizAccessForm, RecentQuizCard, SectionTitle],
  templateUrl: './quiz-list-page.html',

})
export class StudentQuizListPage {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly availableQuizzesTitle = $localize`:Student dashboard available quizzes section title:Available Quizzes`;
  readonly recentQuizzesTitle = $localize`:Student dashboard recent quizzes section title:Recent Quizzes`;
  readonly studentFallbackName = $localize`:Student fallback display name:Student`;

  readonly dashboard = toSignal(this.#studentQuizService.getDashboard(), {
    initialValue: { availableQuizzes: [], recentQuizzes: [] },
  });

  readonly displayName = computed(() => {
    const user = this.#authService.currentUser();

    return user?.name?.split(' ')[0] ?? user?.username ?? this.studentFallbackName;
  });

  async startQuiz(quizId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', quizId, 'start']);
  }

  async viewResults(quizId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', quizId, 'results'], {
      queryParams: { view: 'details' },
    });
  }

  async goToQuizFromLink(quizLink: string): Promise<void> {
    if (!quizLink) {
      return;
    }

    const quizId = quizLink.split('/').filter(Boolean).at(-1) ?? quizLink;
    await this.startQuiz(quizId);
  }
}
