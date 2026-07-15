import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalRef } from '../../../core/services/modal.service';

@Component({
  selector: 'qz-attempt-exit-dialog',
  templateUrl: './attempt-exit-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttemptExitDialog {
  readonly #modalRef = inject(ModalRef);

  readonly title = $localize`:Attempt exit dialog title:Attempt in progress`;
  readonly message = $localize`:Attempt exit dialog message:You cannot leave while this attempt is in progress. Please complete it first.`;
  readonly actionLabel = $localize`:Attempt exit dialog action:Continue attempt`;

  close(): void {
    this.#modalRef.close(false);
  }
}
