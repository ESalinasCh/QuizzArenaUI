import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiErrorService } from '../../../core/api-errors/api-error.service';
import { ApiErrorDialog } from '../../molecules/api-error-dialog/api-error-dialog';
import { Navbar } from '../../organisms/navbar/navbar';
import { Sidebar } from '../../organisms/sidebar/sidebar';

@Component({
  selector: 'qz-main-layout',
  imports: [RouterOutlet, Navbar, Sidebar, ApiErrorDialog],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);
  protected readonly apiErrorService = inject(ApiErrorService);

  isSidebarOpen = signal<boolean>(false);
  isImmersiveRoute = signal<boolean>(false);

  constructor() {
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.isImmersiveRoute.set(this.#getDeepestRouteData()['immersive'] === true);
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  handleApiErrorAction(): void {
    this.apiErrorService.runAction();
  }

  #getDeepestRouteData(): Record<string, unknown> {
    let route: ActivatedRoute | null = this.#activatedRoute;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return route?.snapshot?.data ?? {};
  }
}
