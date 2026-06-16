import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'app-link-action-form',
  standalone: true,
  imports: [FormsModule, Icon],
  templateUrl: './link-action-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkActionForm {
  placeholder = input.required<string>();
  actionLabel = input.required<string>();
  leadingIcon = input<IconName>('link');
  actionIcon = input<IconName>('arrow-right');

  value = signal('');
  submitted = output<string>();

  submit(): void {
    this.submitted.emit(this.value().trim());
  }
}
