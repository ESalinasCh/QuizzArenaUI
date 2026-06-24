import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { StatCard } from '../../../../shared/molecules/stat-card/stat-card';
import { ContentItem } from '../../../../shared/molecules/content-item/content-item';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'qz-teacher-dashboard-page',
  imports: [StatCard, ContentItem, Button, Icon],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherDashboardPage {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #dashboardService = inject(TeacherDashboardService);
  readonly #examService = inject(TeacherExamService);

  protected readonly quizzesLabel = $localize`:Stat card quizzes label:Quizzes`;
  protected readonly publishedLabel = $localize`:Stat card published label:Published`;
  protected readonly uploadContentAriaLabel = $localize`:Upload content button aria label:Upload content`;
  protected readonly createExamAriaLabel = $localize`:Create exam button aria label:Create exam`;
  protected readonly publishExamAriaLabel = $localize`:Dashboard publish exam button aria label:Publish exam`;

  protected readonly dashboard = toSignal(this.#dashboardService.getDashboard(), {
    initialValue: { quizCount: 0, publishedCount: 0, recentContent: [] },
  });

  readonly #allExams = toSignal(this.#examService.getExams(), { initialValue: [] });

  readonly draftExams = computed(() => this.#allExams().filter(e => e.status === 'draft'));
  readonly publishedExams = computed(() => this.#allExams().filter(e => e.status === 'published'));

  protected readonly displayName = computed(() => {
    const user = this.#authService.currentUser();
    return user?.name?.trim().split(' ')[0] || user?.username || $localize`:Teacher fallback display name:Teacher`;
  });

  async uploadContent(): Promise<void> {
    await this.#router.navigate(['/teacher/content/upload']);
  }

  async createExam(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/create']);
  }
<<<<<<< HEAD

  async goToExamBank(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/bank']);
  }

  publishExam(exam: Exam): void {
    void this.#router.navigate(['/teacher/exams/publish'], {
      state: {
        title: exam.title,
        description: exam.description,
        classIds: [],
        questionIds: exam.questionIds,
        from: 'dashboard',
      },
    });
  }
=======
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
}
