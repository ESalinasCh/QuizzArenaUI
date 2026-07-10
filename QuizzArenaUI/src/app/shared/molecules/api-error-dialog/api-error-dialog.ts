import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'qz-api-error-dialog',
  imports: [Button],
  templateUrl: './api-error-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiErrorDialog {
  readonly isOpen = input<boolean>(false);
  readonly message = input<string>('');
  readonly statusCode = input<number | null>(null);
  readonly actionLabel = input<string>('');
  readonly action = output<void>();
}
