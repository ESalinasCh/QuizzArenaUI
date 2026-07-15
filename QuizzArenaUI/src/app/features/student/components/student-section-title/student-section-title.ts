import { Component, input } from '@angular/core';
import { Icon, IconName } from '../../../../shared/atoms/icon/icon';

@Component({
  selector: 'app-student-section-title',

  imports: [Icon],
  templateUrl: './student-section-title.html',
})
export class StudentSectionTitle {
  readonly title = input.required<string>();
  readonly icon = input.required<IconName>();
}
