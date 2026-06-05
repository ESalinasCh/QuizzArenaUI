import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, IconName } from '../../../../shared/atoms/icon/icon';

@Component({
  selector: 'app-student-section-title',
  standalone: true,
  imports: [Icon],
  templateUrl: './student-section-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentSectionTitle {
  title = input.required<string>();
  icon = input.required<IconName>();
}
