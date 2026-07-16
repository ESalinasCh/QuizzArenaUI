import { HttpErrorResponse } from '@angular/common/http';
import { resolveApiErrorMessage } from './api-error-message.dictionary';
import { ApiErrorConfig, ApiErrorItem, ApiErrorResponse, ApiErrorViewModel } from './api-error.model';

export function mapHttpErrorToApiError(
  error: unknown,
  config: ApiErrorConfig = {},
): ApiErrorViewModel {
  const response = error instanceof HttpErrorResponse ? parseApiErrorResponse(error.error) : null;
  const statusCode = getStatusCode(error, response);
  const apiErrors = getApiErrors(response);

  return {
    message: resolveApiErrorMessages(apiErrors, config.fallbackMessage),
    statusCode,
    actionLabel: config.actionLabel ?? $localize`:API error dialog default action:OK`,
  };
}

function parseApiErrorResponse(error: unknown): ApiErrorResponse | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  return error as ApiErrorResponse;
}

function getStatusCode(error: unknown, response: ApiErrorResponse | null): number | null {
  if (typeof response?.status === 'number') {
    return response.status;
  }

  return error instanceof HttpErrorResponse ? error.status : null;
}

function getApiErrors(response: ApiErrorResponse | null): ApiErrorItem[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response.errors) && response.errors.length > 0) {
    return response.errors;
  }

  return [response];
}

function resolveApiErrorMessages(errors: ApiErrorItem[], fallbackMessage?: string): string {
  if (errors.length === 0) {
    return resolveApiErrorMessage(undefined, fallbackMessage);
  }

  return errors
    .map(error => resolveApiErrorMessage(error.code, error.message ?? fallbackMessage))
    .join('\n');
}
