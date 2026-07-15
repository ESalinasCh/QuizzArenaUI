import { Component, output } from '@angular/core';
import { Icon } from '../../atoms/icon/icon';
import { Button } from '../../atoms/button/button';
import { UserMenu } from '../../molecules/user-menu/user-menu';
import { LanguageSelector } from '../../molecules/language-selector/language-selector';

@Component({
  selector: 'qz-navbar',
  imports: [Icon, Button, UserMenu, LanguageSelector],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  toggleSidebar = output<void>();
}
