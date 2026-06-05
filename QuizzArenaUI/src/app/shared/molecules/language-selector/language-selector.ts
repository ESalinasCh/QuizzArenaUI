import { ChangeDetectionStrategy, Component, HostListener, LOCALE_ID, inject, signal } from '@angular/core';
import { Icon } from '../../atoms/icon/icon';

interface Language {
  code: string;
  label: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [Icon],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelector {
  readonly #localeId = inject(LOCALE_ID);

  readonly isOpen = signal(false);

  readonly languages: Language[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  get currentLanguage(): Language {
    return this.languages.find(l => this.#localeId.startsWith(l.code)) ?? this.languages[0];
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  switchTo(lang: string): void {
    const current = window.location.pathname;
    const hasLocale = /^\/(en|es)/.test(current);
    window.location.href = hasLocale
      ? current.replace(/^\/(en|es)/, `/${lang}`)
      : `/${lang}${current}`;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen.set(false);
  }
}
