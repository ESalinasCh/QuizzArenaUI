import { Component, computed, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Button } from '../../../../shared/atoms/button/button';
import { SelectInput } from '../../../../shared/molecules/select-input/select-input';
import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { PublishMatchForm } from '../../models/publish-match-form.model';
import { CreateMatchRequestBody } from '../../api/teacher-exam.contract';
import { publishMatchSchema } from './publish-match-schema';

interface CourseModel {
  id: string;
  name: string;
  description: string;
  teacherId: string;
}

import { getLocalDatetimeString, formatLocalToOffsetIso } from '../../../../core/utils/date-formatter.utils';

const defaultFormModel: PublishMatchForm = {
  courseId: '',
  durationMinutes: '30',
  maxRetries: '1',
  enabledFrom: getLocalDatetimeString(new Date()),
  enabledUntil: getLocalDatetimeString(new Date(Date.now() + 60 * 60 * 1000)),
  shuffleQuestions: false,
  shuffleOptions: false,
};

export const formSchema = publishMatchSchema;

@Component({
  selector: 'qz-publish-quiz-as-match-form',
  imports: [Button, SelectInput, FormField, TextInput, TextSpan],
  templateUrl: './publish-quiz-as-match-form.html',
})
export class PublishQuizAsMatchForm {
  onSendMatchRequest = output<CreateMatchRequestBody>();
  onBack = output<void>();

  readonly matchModel = signal<PublishMatchForm>(structuredClone(defaultFormModel));
  readonly matchForm = form(this.matchModel, formSchema);

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
    const field = this.matchForm.courseId();
    const errs = field.errors();
    return (this.isSubmitted() || field.touched() || field.dirty()) && errs.length > 0
      ? (errs[0].message ?? 'A course must be selected')
      : null;
  });

  readonly durationError = computed(() => {
    const field = this.matchForm.durationMinutes();
    const errs = field.errors();
    return (this.isSubmitted() || field.touched() || field.dirty()) && errs.length > 0
      ? (errs[0].message ?? 'Duration is required')
      : null;
  });

  readonly retriesError = computed(() => {
    const field = this.matchForm.maxRetries();
    const errs = field.errors();
    return (this.isSubmitted() || field.touched() || field.dirty()) && errs.length > 0
      ? (errs[0].message ?? 'Max retries is required')
      : null;
  });

  readonly enabledFromError = computed(() => {
    const field = this.matchForm.enabledFrom();
    const errs = field.errors();
    return (this.isSubmitted() || field.touched() || field.dirty()) && errs.length > 0
      ? (errs[0].message ?? 'Start date is required')
      : null;
  });

  readonly enabledUntilError = computed(() => {
    const field = this.matchForm.enabledUntil();
    const errs = field.errors();
    return (this.isSubmitted() || field.touched() || field.dirty()) && errs.length > 0
      ? (errs[0].message ?? 'End date is required')
      : null;
  });

  readonly dateRangeError = computed(() => {
    const rootErrors = this.matchForm().errors();
    const dateError = rootErrors.find(e => e.kind === 'date_range' || e.message === 'End date must be after start date');
    const isInteraction = this.isSubmitted() ||
      this.matchForm.enabledFrom().touched() || this.matchForm.enabledFrom().dirty() ||
      this.matchForm.enabledUntil().touched() || this.matchForm.enabledUntil().dirty();
    return isInteraction && dateError
      ? (dateError.message ?? 'End date must be after start date')
      : null;
  });

  readonly dateRangeInvalid = computed(() => {
    return this.dateRangeError() !== null;
  });

  readonly isFormValid = computed(() => {
    return this.matchForm().valid();
  });

  readonly isMoreThanCurrentDateTime = computed(() => {

    if (
      this.isSubmitted() ||
      this.matchForm.enabledFrom().touched() || this.matchForm.enabledFrom().dirty() ||
      this.matchForm.enabledUntil().touched() || this.matchForm.enabledUntil().dirty()
    ) {
      const now = new Date().getTime();
      const enabledFrom = new Date(this.matchForm.enabledFrom().value()).getTime();
      const enabledUntil = new Date(this.matchForm.enabledUntil().value()).getTime();
      return (enabledFrom <= now || enabledUntil <= now) ? 'Date must be greater than current date' : null;
    }
    return null;
  });

  toggleShuffleQuestions(): void {
    this.matchModel.update(m => ({ ...m, shuffleQuestions: !m.shuffleQuestions }));
  }

  toggleShuffleOptions(): void {
    this.matchModel.update(m => ({ ...m, shuffleOptions: !m.shuffleOptions }));
  }

  submit(): void {
    this.isSubmitted.set(true);
    if (!this.isFormValid()) return;

    const m = this.matchModel();
    this.onSendMatchRequest.emit(
      {
        quizId: '',
        courseId: m.courseId,
        startedAt: formatLocalToOffsetIso(m.enabledFrom),
        finishedAt: formatLocalToOffsetIso(m.enabledUntil),
        timeMinutes: Number(m.durationMinutes),
        attemptsAmount: Number(m.maxRetries),
        shuffleQuestion: m.shuffleQuestions,
        shuffleOptions: m.shuffleOptions,
      }
    );
  }
}
