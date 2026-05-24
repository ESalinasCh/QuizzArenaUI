import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Icon } from '../../atoms/icon/icon';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [Button, Icon],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  username = input<string>('UserName');
}
