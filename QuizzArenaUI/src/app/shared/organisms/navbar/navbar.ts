import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Icon } from '../../atoms/icon/icon';
import { Button } from '../../atoms/button/button';
import { UserMenu } from '../../molecules/user-menu/user-menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Icon, Button, UserMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  toggleSidebar = output<void>();

  onMenuClick(): void {
    this.toggleSidebar.emit();
  }
}
