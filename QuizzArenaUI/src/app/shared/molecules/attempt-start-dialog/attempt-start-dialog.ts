import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModalRef } from '../../../core/services/modal.service';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'qz-attempt-start-dialog',
  imports: [Button],
  templateUrl: './attempt-start-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttemptStartDialog {
  readonly #modalRef = inject(ModalRef<AttemptStartDialog, boolean>);

  readonly message = input.required<string>();
  readonly cancelLabel = input.required<string>();
  readonly confirmLabel = input.required<string>();

  cancel(): void {
    this.#modalRef.close(false);
  }

  confirm(): void {
    this.#modalRef.close(true);
  }
}
