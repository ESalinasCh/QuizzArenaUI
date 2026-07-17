import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { StatsCard } from '../../../../shared/organisms/stats-card/stats-card';
import { ContentItem } from '../../../../shared/molecules/content-item/content-item';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Exam } from '../../models/exam.model';
//import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { ExamFilterModal } from '../../components/exam-filter-modal/exam-filter-modal';
import { ExamFormFilter } from '../../models/exam-form-filter';
// import { LinkText } from '../../../../shared/atoms/link-text/link-text';
import { ModalService } from '../../../../core/services/modal.service';
import { form } from '@angular/forms/signals';
import { EmptyState } from '../../../../shared/molecules/empty-state/empty-state';


@Component({
  selector: 'qz-teacher-dashboard-page',
  imports: [ContentItem, Button, Icon, StatsCard, EmptyState],
  templateUrl: './dashboard-page.html',
})
export class TeacherDashboardPage {
  readonly #modalService = inject(ModalService);
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


  searchFilter = signal(new ExamFormFilter());

  async uploadContent(): Promise<void> {
    await this.#router.navigate(['/teacher/content/upload']);
  }

  async createExam(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/create']);
  }

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

  protected foundExams = signal<Exam[]>([]);

  protected searchModel = signal({
    text: '',
  });
  protected searchForm = form(this.searchModel);

  isClearSearchOptionAvailable = signal(false);

  protected search() {
    const text = this.searchModel().text;
    const foundExams = this.#allExams().filter(exam => exam.title.includes(text));
    this.isClearSearchOptionAvailable.set(true);
    this.foundExams.set(foundExams);
  }

  protected clear() {
    this.foundExams.set([]);
    this.searchModel.update(model => ({ ...model, text: '' }));
    this.isClearSearchOptionAvailable.set(false);
  }

  protected toggleFilterModal() {
    const ref = this.#modalService.open<ExamFilterModal, ExamFormFilter>(
      ExamFilterModal,
      { validFilter: this.searchFilter() },
      { title: 'Filters' }
    );
    ref.afterClosed.then((filter) => {
      if (filter) {
        this.getNewFilter(filter);
      }
    });
  }

  protected getNewFilter(newFilter: ExamFormFilter) {
    this.searchFilter.set(newFilter);
  }


}
