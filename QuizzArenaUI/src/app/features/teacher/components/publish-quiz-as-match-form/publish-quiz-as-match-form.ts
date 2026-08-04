import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Button } from '../../../../shared/atoms/button/button';
import { SelectInput } from '../../../../shared/molecules/select-input/select-input';
import { TextInput } from '../../../../shared/molecules/text-input/text-input';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { PublishMatchForm, PublishMode } from '../../models/publish-match-form.model';
import { CreateMatchRequestBody, UpdateMatchRequestBody } from '../../api/teacher-exam.contract';
import { Course } from '../../models/content-upload.model';
import { publishMatchSchema } from './publish-match-schema';
import {
  createQuizAsMatchFormModel,
  getDateRangeError,
  getFormFieldErrorMessage,
  getMoreThanCurrentDateTimeError,
  mapFormToCreateMatchRequest,
  mapFormToUpdateMatchRequest,
} from './publish-match-form.utils';
import { Match } from '../../models/exam.model';

@Component({
  selector: 'qz-publish-quiz-as-match-form',
  imports: [Button, SelectInput, FormField, TextInput, TextSpan],
  templateUrl: './publish-quiz-as-match-form.html',
})
export class PublishQuizAsMatchForm {
  readonly emitSaveRequest = output<CreateMatchRequestBody>();
  readonly emitUpdateRequest = output<UpdateMatchRequestBody>();

  readonly back = output<void>();

  readonly courses = input<Course[]>([]);

  readonly quizId = input<string>('');
  readonly matchId = input<string>('');
  readonly mode = input<PublishMode>('publish');

  readonly match = input<Match | null>(null);

  readonly matchModel = linkedSignal<PublishMatchForm>(() => {
    return (this.mode() === 'edit' && this.match())
      ? createQuizAsMatchFormModel(this.match()!)
      : createQuizAsMatchFormModel()
  });
  readonly matchForm = form(this.matchModel, publishMatchSchema);

  readonly isSubmitted = signal(false);

  readonly backAriaLabel = $localize`:Exam step config back button aria label:Back`;
  readonly publishAriaLabel = computed(() =>
    this.mode() === 'edit'
      ? $localize`:Exam step config update button aria label:Save changes`
      : $localize`:Exam step config publish button aria label:Publish exam`
  );
  readonly submitButtonText = computed(() =>
    this.mode() === 'edit'
      ? $localize`:Exam step config save button label:Save changes`
      : $localize`:Exam step config publish button label:Publish exam`
  );

  readonly courseError = computed(() =>
    getFormFieldErrorMessage(this.matchForm.courseId(), this.isSubmitted(), 'A course must be selected')
  );

  readonly durationError = computed(() =>
    getFormFieldErrorMessage(this.matchForm.durationMinutes(), this.isSubmitted(), 'Duration is required')
  );

  readonly questionsAmountError = computed(() =>
    getFormFieldErrorMessage(this.matchForm.questionsAmount(), this.isSubmitted(), 'Number of questions is required')
  );

  readonly retriesError = computed(() =>
    getFormFieldErrorMessage(this.matchForm.maxRetries(), this.isSubmitted(), 'Max retries is required')
  );

  readonly enabledFromError = computed(() =>
    getFormFieldErrorMessage(this.matchForm.enabledFrom(), this.isSubmitted(), 'Start date is required')
  );

  readonly enabledUntilError = computed(() =>
    getFormFieldErrorMessage(this.matchForm.enabledUntil(), this.isSubmitted(), 'End date is required')
  );

  readonly dateRangeError = computed(() => getDateRangeError(this.matchForm, this.isSubmitted()));
  readonly isMoreThanCurrentDateTime = computed(() => getMoreThanCurrentDateTimeError(this.matchForm, this.isSubmitted()));

  toggleShuffleQuestions(): void {
    this.matchModel.update(m => ({ ...m, shuffleQuestions: !m.shuffleQuestions }));
  }

  toggleShuffleOptions(): void {
    this.matchModel.update(m => ({ ...m, shuffleOptions: !m.shuffleOptions }));
  }

  submit(): void {
    this.isSubmitted.set(true);
    if (!this.matchForm().valid()) return;
    if (this.mode() === 'publish') {
      this.emitSaveRequest.emit(mapFormToCreateMatchRequest(this.matchModel(), this.quizId()));
      return;
    }
    this.emitUpdateRequest.emit(mapFormToUpdateMatchRequest(this.matchModel(), this.matchId(), this.quizId()));
  }
}
