import { Component, computed, input } from '@angular/core';

export type ButtonSize = 'large' | 'medium' | 'small' | 'icon' | 'action';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'ghost';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'qz-button',

  templateUrl: './button.html',
  styleUrl: './button.css',

})
export class Button {
  readonly size = input<ButtonSize>('medium');
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly additionalClasses = input('');

  readonly buttonClasses = computed(() =>
    [
      this.#baseClasses,
      this.#sizeClasses[this.size()],
      this.#variantClasses[this.variant()],
      this.fullWidth() ? 'w-full' : 'w-full sm:w-auto',
    ]
      .filter(Boolean)
      .join(' '),
  );

  readonly #baseClasses =
    'inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-light-bg dark:focus-visible:ring-offset-dark-bg ' +
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 ' +
    'hover:scale-[1.01] active:scale-[0.98]';

  readonly #sizeClasses: Record<ButtonSize, string> = {
    large: 'min-h-[48px] sm:min-h-[44px] rounded-xl px-6 text-base tracking-wide',
    medium: 'min-h-[44px] sm:min-h-[40px] rounded-lg px-5 text-sm tracking-wide',
    small: 'min-h-[38px] sm:min-h-[34px] rounded-md px-4 text-xs tracking-wide',
    icon: 'h-10 w-10 rounded-button text-lg',
    action: 'h-10 w-[94px] rounded-[10px] px-3 text-sm',
  };

  readonly #variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-primary text-white shadow-md shadow-indigo-600/10 hover:bg-primary-hover hover:shadow-lg hover:shadow-indigo-600/20',

    secondary:
      'border border-light-border bg-light-surface text-light-text hover:border-indigo-200 hover:bg-indigo-50/20 ' +
      'dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:border-indigo-900 dark:hover:bg-indigo-950/20',

    success:
      'bg-success-bg-light text-success-text-light hover:bg-success hover:text-white ' +
      'dark:bg-success-bg-dark dark:text-success-text-dark dark:hover:bg-success dark:hover:text-white',

    danger:
      'bg-danger-bg-light text-danger-text-light hover:bg-danger hover:text-white ' +
      'dark:bg-danger-bg-dark dark:text-danger-text-dark dark:hover:bg-danger dark:hover:text-white',

    ghost:
      'bg-transparent text-light-text hover:bg-light-surface-alt hover:text-primary ' +
      'dark:text-dark-text dark:hover:bg-dark-surface-alt dark:hover:text-dark-text',
  };
}
