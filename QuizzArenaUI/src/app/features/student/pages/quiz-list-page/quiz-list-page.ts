import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { QuizAccessForm } from '../../components/quiz-access-form/quiz-access-form';
import { RecentQuizCard } from '../../components/recent-quiz-card/recent-quiz-card';
import { StudentSectionTitle } from '../../components/student-section-title/student-section-title';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'app-student-quiz-list-page',
  standalone: true,
  imports: [AvailableQuizCard, QuizAccessForm, RecentQuizCard, StudentSectionTitle],
  templateUrl: './quiz-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizListPage {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly dashboard = toSignal(this.#studentQuizService.getDashboard(), {
    initialValue: { availableQuizzes: [], recentQuizzes: [] },
  });

  readonly displayName = computed(() => {
    const user = this.#authService.currentUser();

    return user?.name?.split(' ')[0] ?? user?.username ?? 'Maria';
  });

  startQuiz(quizId: string): void {
    void this.#router.navigate(['/student/quizzes', quizId, 'start']);
  }

  viewResults(quizId: string): void {
    void this.#router.navigate(['/student/quizzes', quizId, 'results']);
  }

  goToQuizFromLink(quizLink: string): void {
    if (!quizLink) {
      return;
    }

    const quizId = quizLink.split('/').filter(Boolean).at(-1) ?? quizLink;
    this.startQuiz(quizId);
  }
}
