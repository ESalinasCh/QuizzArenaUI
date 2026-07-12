import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModalRef } from '../../../core/services/modal.service';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'qz-api-error-dialog',
  imports: [Button],
  templateUrl: './api-error-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiErrorDialog {
  readonly #modalRef = inject(ModalRef);

  readonly message = input<string>('');
  readonly statusCode = input<number | null>(null);
  readonly actionLabel = input<string>('');

  close(): void {
    this.#modalRef.close();
  }
}
