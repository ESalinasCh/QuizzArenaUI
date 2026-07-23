import { Component, computed, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Button } from '../../../../shared/atoms/button/button';
import { SelectInput } from '../../../../shared/molecules/select-input/select-input';
import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { PublishMatchForm } from '../../models/publish-match-form.model';
import { CreateMatchRequestBody } from '../../api/teacher-exam.contract';

interface CourseModel {
  id: string;
  name: string;
  description: string;
  teacherId: string;
}

const defaultFormModel: PublishMatchForm = {
  courseId: '',
  durationMinutes: '30',
  maxRetries: '1',
  enabledFrom: new Date().toISOString().slice(0, 16),
  enabledUntil: new Date().toISOString().slice(0, 16),
  shuffleQuestions: false,
  shuffleOptions: false,
};

@Component({
  selector: 'qz-publish-quiz-as-match-form',
  imports: [Button, SelectInput, FormField, TextInput, TextSpan],
  templateUrl: './publish-quiz-as-match-form.html',
})
export class PublishQuizAsMatchForm {
  onSendMatchRequest = output<CreateMatchRequestBody>();
  onBack = output<void>();

  readonly matchModel = signal<PublishMatchForm>(structuredClone(defaultFormModel));
  readonly matchForm = form(this.matchModel);

  readonly isSubmitted = signal(false);
  readonly isDirtyEnabledFrom = computed(() => this.matchForm.enabledFrom().touched());
  readonly isDirtyEnabledUntil = computed(() => this.matchForm.enabledUntil().touched());

  readonly courses = signal<CourseModel[]>([
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'Fundamentos de Inteligencia Artificial',
      description: 'Practical Python course focused on data analysis, visualization and Machine Learning.',
      teacherId: '959d0300-4473-4198-b551-6c1c6fb214dc',
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Python Programming for Data Science',
      description: 'Practical Python course focused on data analysis, visualization and Machine Learning.',
      teacherId: '959d0300-4473-4198-b551-6c1c6fb214dc',
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Deep Learning Fundamentals',
      description: 'Neural networks, CNN, RNN architectures and practical applications.',
      teacherId: '959d0300-4473-4198-b551-6c1c6fb214dc',
    },
  ]);

  readonly backAriaLabel = $localize`:Exam step config back button aria label:Back`;
  readonly publishAriaLabel = $localize`:Exam step config publish button aria label:Publish exam`;

  readonly courseError = computed(() => {
    const val = this.matchModel().courseId;
    if (!val) return 'A course must be selected';
    return null;
  });

  readonly durationError = computed(() => {
    const val = Number(this.matchModel().durationMinutes);
    if (!val) return 'Duration is required';
    if (val < 1) return 'Duration must be at least 1 minute';
    return null;
  });

  readonly retriesError = computed(() => {
    const val = Number(this.matchModel().maxRetries);
    if (!val || val <= 0) return 'Max retries is required';
    return null;
  });

  readonly dateRangeInvalid = computed(() => {
    const from = this.matchModel().enabledFrom;
    const until = this.matchModel().enabledUntil;
    if (from && until && new Date(until) <= new Date(from)) {
      return true;
    }
    return false;
  });

  readonly isFormValid = computed(() => {
    const m = this.matchModel();
    const durationMinutes = Number(m.durationMinutes);
    const maxRetries = Number(m.maxRetries);
    if (isNaN(durationMinutes) || durationMinutes < 1) return false;
    if (maxRetries === null || maxRetries === undefined) return false;
    if (!m.enabledFrom || !m.enabledUntil) return false;
    if (this.dateRangeInvalid()) return false;
    return true;
  });

  toggleShuffleQuestions(): void {
    this.matchModel.update(m => ({ ...m, shuffleQuestions: !m.shuffleQuestions }));
  }

  toggleShuffleOptions(): void {
    this.matchModel.update(m => ({ ...m, shuffleOptions: !m.shuffleOptions }));
  }

  submit(): void {
    console.log(this.matchForm().value());
    this.isSubmitted.set(true);
    if (!this.isFormValid()) return;

    const m = this.matchModel();
    this.onSendMatchRequest.emit(
      {
        quizId: '',
        courseId: m.courseId,
        startedAt: m.enabledFrom,
        finishedAt: m.enabledUntil,
        timeMinutes: Number(m.durationMinutes),
        attemptsAmount: Number(m.maxRetries),
        shuffleQuestion: m.shuffleQuestions,
        shuffleOptions: m.shuffleOptions,
      }
    );
  }
}
