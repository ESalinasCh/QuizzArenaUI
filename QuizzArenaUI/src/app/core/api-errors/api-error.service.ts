import { Injectable, signal } from '@angular/core';
import { mapHttpErrorToApiError } from './api-error.mapper';
import { ApiErrorConfig, ApiErrorViewModel } from './api-error.model';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  readonly #error = signal<ApiErrorViewModel | null>(null);

  readonly error = this.#error.asReadonly();

  show(error: unknown, config?: ApiErrorConfig): void {
    this.#error.set(mapHttpErrorToApiError(error, config));
  }

  clear(): void {
    this.#error.set(null);
  }

  runAction(): void {
    this.clear();
  }
}
