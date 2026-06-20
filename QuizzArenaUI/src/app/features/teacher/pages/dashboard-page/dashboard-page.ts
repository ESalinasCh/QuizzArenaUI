import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { StatCard } from '../../../../shared/molecules/stat-card/stat-card';
import { ContentItem } from '../../../../shared/molecules/content-item/content-item';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';

@Component({
  selector: 'app-teacher-dashboard-page',
  imports: [StatCard, ContentItem, Button, Icon],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherDashboardPage {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #dashboardService = inject(TeacherDashboardService);

  readonly quizzesLabel = $localize`:Stat card quizzes label:Quizzes`;
  readonly publishedLabel = $localize`:Stat card published label:Published`;
  readonly uploadContentAriaLabel = $localize`:Upload content button aria label:Upload content`;

  readonly dashboard = toSignal(this.#dashboardService.getDashboard(), {
    initialValue: { quizCount: 0, publishedCount: 0, recentContent: [] },
  });

  readonly displayName = computed(() => {
    const user = this.#authService.currentUser();
    return user?.name?.trim().split(' ')[0] || user?.username || $localize`:Teacher fallback display name:Teacher`;
  });

  uploadContent(): void {
    void this.#router.navigate(['/teacher/content/upload']);
  }
}
