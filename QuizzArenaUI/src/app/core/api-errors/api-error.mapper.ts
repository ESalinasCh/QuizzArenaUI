import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorConfig, ApiErrorResponse, ApiErrorViewModel } from './api-error.model';

export function mapHttpErrorToApiError(
  error: unknown,
  config: ApiErrorConfig = {},
): ApiErrorViewModel {
  const response = error instanceof HttpErrorResponse ? parseApiErrorResponse(error.error) : null;
  const statusCode = getStatusCode(error, response);

  return {
    message:
      response?.message ??
      config.fallbackMessage ??
      $localize`:API error fallback message:We could not complete this action. Please try again later.`,
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
