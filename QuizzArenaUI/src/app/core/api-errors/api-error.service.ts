import { Injectable, inject } from '@angular/core';
import { ModalRef, ModalService } from '../services/modal.service';
import { ApiErrorDialog } from '../../shared/molecules/api-error-dialog/api-error-dialog';
import { mapHttpErrorToApiError } from './api-error.mapper';
import { ApiErrorConfig } from './api-error.model';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  readonly #modalService = inject(ModalService);
  #activeModal: ModalRef<ApiErrorDialog> | undefined;

  show(error: unknown, config?: ApiErrorConfig): void {
    if (this.#activeModal) {
      return;
    }

    const apiError = mapHttpErrorToApiError(error, config);

    this.#activeModal = this.#modalService.open(
      ApiErrorDialog,
      {
        message: apiError.message,
        statusCode: apiError.statusCode,
        actionLabel: apiError.actionLabel,
      },
      {
        title: $localize`:API error dialog title:Something went wrong`,
        width: '420px',
        maxWidth: '90vw',
        closeOnOverlayClick: true,
        showCloseButton: true,
      },
    );

    this.#activeModal.afterClosed.finally(() => {
      this.#activeModal = undefined;
    });
  }
}
