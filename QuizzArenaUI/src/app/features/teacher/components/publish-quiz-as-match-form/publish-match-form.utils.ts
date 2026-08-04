import { getLocalDatetimeString, formatLocalToUtcIso } from '../../../../core/utils/date-formatter.utils';
import { CreateMatchRequestBody, UpdateMatchRequestBody } from '../../api/teacher-exam.contract';
import { Match } from '../../models/exam.model';
import { PublishMatchForm } from '../../models/publish-match-form.model';

const HOUR_MS = 60 * 60 * 1000;

export function createQuizAsMatchFormModel(
  match?: Match,
): PublishMatchForm {
  return {
    courseId: match?.courseId || '',
    durationMinutes: match?.duration.toString() || '30',
    questionsAmount: match?.questionCount.toString() || '10',
    maxRetries: match?.attemptsAmount?.toString() || '1',
    enabledFrom: match?.startedAt ? getLocalDatetimeString(new Date(match.startedAt)) : getLocalDatetimeString(new Date(Date.now() + HOUR_MS)),
    enabledUntil: match?.finishedAt ? getLocalDatetimeString(new Date(match.finishedAt)) : getLocalDatetimeString(new Date(Date.now() + 2 * HOUR_MS)),
    shuffleQuestions: match?.shuffleQuestion || false,
    shuffleOptions: match?.shuffleOptions || false,
  };
}

export interface FormFieldState {
  errors: () => { message?: string }[];
  touched: () => boolean;
  dirty: () => boolean;
}

export function getFormFieldErrorMessage(
  fieldState: FormFieldState,
  isSubmitted: boolean,
  defaultMessage: string
): string | null {
  const errs = fieldState.errors();
  return (isSubmitted || fieldState.touched() || fieldState.dirty()) && errs.length > 0
    ? (errs[0].message ?? defaultMessage)
    : null;
}

export function getDateRangeError(formState: any, isSubmitted: boolean): string | null {
  const rootErrors = formState().errors() as { kind?: string; message?: string }[];
  const dateError = rootErrors.find(
    e => e.kind === 'date_range' || e.message === 'End date must be after start date'
  );
  const enabledFrom = formState.enabledFrom();
  const enabledUntil = formState.enabledUntil();
  const isInteraction =
    isSubmitted ||
    enabledFrom.touched() ||
    enabledFrom.dirty() ||
    enabledUntil.touched() ||
    enabledUntil.dirty();

  return isInteraction && dateError ? (dateError.message ?? 'End date must be after start date') : null;
}

export function getMoreThanCurrentDateTimeError(formState: any, isSubmitted: boolean): string | null {
  const enabledFrom = formState.enabledFrom();
  const enabledUntil = formState.enabledUntil();
  if (
    isSubmitted ||
    enabledFrom.touched() ||
    enabledFrom.dirty() ||
    enabledUntil.touched() ||
    enabledUntil.dirty()
  ) {
    const now = new Date().getTime();
    const fromTime = new Date(enabledFrom.value()).getTime();
    const untilTime = new Date(enabledUntil.value()).getTime();
    return fromTime <= now || untilTime <= now ? 'Date must be greater than current date' : null;
  }
  return null;
}

export function mapFormToCreateMatchRequest(formModel: PublishMatchForm, quizId: string): CreateMatchRequestBody {
  return {
    quizId,
    courseId: formModel.courseId,
    questionsAmount: Number(formModel.questionsAmount),
    startedAt: formatLocalToUtcIso(formModel.enabledFrom),
    finishedAt: formatLocalToUtcIso(formModel.enabledUntil),
    timeMinutes: Number(formModel.durationMinutes),
    attemptsAmount: Number(formModel.maxRetries),
    shuffleQuestion: formModel.shuffleQuestions,
    shuffleOptions: formModel.shuffleOptions,
  };
}

export function mapFormToUpdateMatchRequest(formModel: PublishMatchForm, matchId: string, quizId: string): UpdateMatchRequestBody {
  return {
    id: matchId,
    quizId,
    courseId: formModel.courseId,
    questionsAmount: Number(formModel.questionsAmount),
    startedAt: formatLocalToUtcIso(formModel.enabledFrom),
    finishedAt: formatLocalToUtcIso(formModel.enabledUntil),
    timeMinutes: Number(formModel.durationMinutes),
    attemptsAmount: Number(formModel.maxRetries),
    shuffleQuestion: formModel.shuffleQuestions,
    shuffleOptions: formModel.shuffleOptions,
  };
}
