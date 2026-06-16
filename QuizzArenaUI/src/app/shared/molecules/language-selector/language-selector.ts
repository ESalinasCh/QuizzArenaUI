import { ChangeDetectionStrategy, Component, LOCALE_ID, inject, signal } from '@angular/core';
import { Icon } from '../../atoms/icon/icon';

interface Language {
  code: string;
  label: string;
}

@Component({
  selector: 'qz-language-selector',
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

  close(): void {
    this.isOpen.set(false);
  }

  switchTo(lang: string): void {
    window.location.href = `/${lang}/`;
  }
}
