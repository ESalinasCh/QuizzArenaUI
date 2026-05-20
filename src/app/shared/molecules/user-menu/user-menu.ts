import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  username = input<string>('Alex');
}
