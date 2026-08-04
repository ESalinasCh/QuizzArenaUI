import { describe, it, expect } from 'vitest';
import {
  createQuizAsMatchFormModel,
  getFormFieldErrorMessage,
  getDateRangeError,
  getMoreThanCurrentDateTimeError,
  mapFormToCreateMatchRequest,
  mapFormToUpdateMatchRequest,
  FormFieldState,
} from './publish-match-form.utils';
import { Match } from '../../models/exam.model';
import { PublishMatchForm } from '../../models/publish-match-form.model';

const MOCK_MATCH: Match = {
  id: 'match-100',
  quizId: 'quiz-200',
  title: 'Math Exam',
  courseName: 'Math 101',
  courseId: 'course-abc',
  questionCount: 20,
  professorName: 'Dr. Euler',
  duration: 60,
  startedAt: '2026-09-01T08:00:00.000Z',
  finishedAt: '2026-09-01T10:00:00.000Z',
  attemptsAmount: 2,
  shuffleQuestion: true,
  shuffleOptions: false,
};

import { getLocalDatetimeString } from '../../../../core/utils/date-formatter.utils';

describe('publish-match-form.utils', () => {
  describe('createQuizAsMatchFormModel', () => {
    it('should return default values when no match is provided', () => {
      const model = createQuizAsMatchFormModel();
      expect(model.courseId).toBe('');
      expect(model.durationMinutes).toBe('30');
      expect(model.questionsAmount).toBe('10');
      expect(model.maxRetries).toBe('1');
      expect(model.shuffleQuestions).toBe(false);
      expect(model.shuffleOptions).toBe(false);
      expect(model.enabledFrom).toBeTruthy();
      expect(model.enabledUntil).toBeTruthy();
    });

    it('should map values from existing Match', () => {
      const model = createQuizAsMatchFormModel(MOCK_MATCH);
      expect(model.courseId).toBe('course-abc');
      expect(model.durationMinutes).toBe('60');
      expect(model.questionsAmount).toBe('20');
      expect(model.maxRetries).toBe('2');
      expect(model.shuffleQuestions).toBe(true);
      expect(model.shuffleOptions).toBe(false);
      expect(model.enabledFrom).toBe(getLocalDatetimeString(new Date(MOCK_MATCH.startedAt!)));
      expect(model.enabledUntil).toBe(getLocalDatetimeString(new Date(MOCK_MATCH.finishedAt!)));
    });
  });

  describe('getFormFieldErrorMessage', () => {
    it('should return null when not touched, dirty, or submitted', () => {
      const fieldState: FormFieldState = {
        errors: () => [{ message: 'Field is required' }],
        touched: () => false,
        dirty: () => false,
      };
      expect(getFormFieldErrorMessage(fieldState, false, 'Default')).toBeNull();
    });

    it('should return error message when touched and errors exist', () => {
      const fieldState: FormFieldState = {
        errors: () => [{ message: 'Field is required' }],
        touched: () => true,
        dirty: () => false,
      };
      expect(getFormFieldErrorMessage(fieldState, false, 'Default')).toBe('Field is required');
    });

    it('should fallback to default message if error object lacks message property', () => {
      const fieldState: FormFieldState = {
        errors: () => [{}],
        touched: () => true,
        dirty: () => false,
      };
      expect(getFormFieldErrorMessage(fieldState, false, 'Default error')).toBe('Default error');
    });

    it('should return null if there are no errors', () => {
      const fieldState: FormFieldState = {
        errors: () => [],
        touched: () => true,
        dirty: () => true,
      };
      expect(getFormFieldErrorMessage(fieldState, true, 'Default')).toBeNull();
    });
  });

  describe('getDateRangeError', () => {
    it('should return date_range message if date error is found and form was interacted with', () => {
      const mockFormState = Object.assign(
        () => ({
          errors: () => [{ kind: 'date_range', message: 'End date must be after start date' }],
        }),
        {
          enabledFrom: () => ({ touched: () => true, dirty: () => false, value: () => '' }),
          enabledUntil: () => ({ touched: () => false, dirty: () => false, value: () => '' }),
        }
      );

      expect(getDateRangeError(mockFormState, false)).toBe('End date must be after start date');
    });

    it('should return null if no date_range error exists', () => {
      const mockFormState = Object.assign(
        () => ({ errors: () => [] }),
        {
          enabledFrom: () => ({ touched: () => true, dirty: () => false, value: () => '' }),
          enabledUntil: () => ({ touched: () => false, dirty: () => false, value: () => '' }),
        }
      );

      expect(getDateRangeError(mockFormState, true)).toBeNull();
    });
  });

  describe('getMoreThanCurrentDateTimeError', () => {
    it('should return error message if enabledFrom is in the past', () => {
      const mockFormState = Object.assign(
        () => ({ errors: () => [] }),
        {
          enabledFrom: () => ({
            touched: () => true,
            dirty: () => false,
            value: () => '2020-01-01T10:00',
          }),
          enabledUntil: () => ({
            touched: () => false,
            dirty: () => false,
            value: () => '2099-01-01T10:00',
          }),
        }
      );

      expect(getMoreThanCurrentDateTimeError(mockFormState, false)).toBe('Date must be greater than current date');
    });

    it('should return null if dates are in the future', () => {
      const mockFormState = Object.assign(
        () => ({ errors: () => [] }),
        {
          enabledFrom: () => ({
            touched: () => true,
            dirty: () => false,
            value: () => '2099-01-01T10:00',
          }),
          enabledUntil: () => ({
            touched: () => false,
            dirty: () => false,
            value: () => '2099-01-02T10:00',
          }),
        }
      );

      expect(getMoreThanCurrentDateTimeError(mockFormState, false)).toBeNull();
    });
  });

  describe('mapFormToCreateMatchRequest', () => {
    it('should correctly map form model to CreateMatchRequestBody', () => {
      const formModel: PublishMatchForm = {
        courseId: 'course-1',
        durationMinutes: '45',
        questionsAmount: '12',
        maxRetries: '2',
        enabledFrom: '2026-10-01T10:00',
        enabledUntil: '2026-10-02T10:00',
        shuffleQuestions: true,
        shuffleOptions: false,
      };

      const result = mapFormToCreateMatchRequest(formModel, 'quiz-1');
      expect(result).toEqual({
        quizId: 'quiz-1',
        courseId: 'course-1',
        questionsAmount: 12,
        startedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        finishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        timeMinutes: 45,
        attemptsAmount: 2,
        shuffleQuestion: true,
        shuffleOptions: false,
      });
    });
  });

  describe('mapFormToUpdateMatchRequest', () => {
    it('should correctly map form model to UpdateMatchRequestBody', () => {
      const formModel: PublishMatchForm = {
        courseId: 'course-1',
        durationMinutes: '60',
        questionsAmount: '15',
        maxRetries: '3',
        enabledFrom: '2026-10-01T10:00',
        enabledUntil: '2026-10-02T10:00',
        shuffleQuestions: true,
        shuffleOptions: true,
      };

      const result = mapFormToUpdateMatchRequest(formModel, 'match-999', 'quiz-1');
      expect(result).toEqual({
        id: 'match-999',
        quizId: 'quiz-1',
        courseId: 'course-1',
        questionsAmount: 15,
        startedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        finishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        timeMinutes: 60,
        attemptsAmount: 3,
        shuffleQuestion: true,
        shuffleOptions: true,
      });
    });
  });
});
