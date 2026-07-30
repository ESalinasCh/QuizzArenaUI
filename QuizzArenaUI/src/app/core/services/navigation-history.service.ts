import { Injectable, inject } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationHistoryService {
  readonly #router = inject(Router);
  readonly #history: string[] = [];

  readonly #maxHistorySize = 20;

  constructor() {
    this.#initHistoryTracking();
  }

  #initHistoryTracking(): void {
    if (this.#router.url && this.#router.url !== '/' && this.#history.length === 0) {
      this.#pushToHistory(this.#router.url);
    }

    this.#router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.#pushToHistory(event.urlAfterRedirects);
      });
  }

  #pushToHistory(url: string): void {
    if (this.#history[this.#history.length - 1] !== url) {
      this.#history.push(url);
      if (this.#history.length > this.#maxHistorySize) {
        this.#history.shift();
      }
    }
  }

  getHistory(): string[] {
    return [...this.#history];
  }

  getPreviousUrl(): string | null {
    if (this.#history.length > 1) {
      return this.#history[this.#history.length - 2];
    }
    return null;
  }

  getCurrentUrl(): string | null {
    return this.#history.length > 0 ? this.#history[this.#history.length - 1] : null;
  }

  back(defaultUrl = '/'): void {
    const formattedDefaultUrl = defaultUrl.startsWith('/') ? defaultUrl : `/${defaultUrl}`;
    if (this.#history.length > 1) {
      this.#history.pop();
      const previousUrl = this.#history.pop();
      if (previousUrl) {
        const targetUrl = previousUrl.startsWith('/') ? previousUrl : `/${previousUrl}`;
        this.#router.navigateByUrl(targetUrl);
        return;
      }
    }
    this.#router.navigateByUrl(formattedDefaultUrl);
  }
}
