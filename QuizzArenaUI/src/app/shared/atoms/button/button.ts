import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly size = input<ButtonSize>('medium');
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly buttonClasses = computed(() =>
    [
      this.#baseClasses,
      this.#sizeClasses[this.size()],
      this.#variantClasses[this.variant()],
      this.fullWidth() ? 'w-full' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  readonly #baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-light-bg dark:focus-visible:ring-offset-dark-bg ' +
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 ' +
    'active:scale-[0.98]';

  readonly #sizeClasses: Record<ButtonSize, string> = {
    large: 'h-12 w-[354px] max-w-full rounded-button px-6 text-base',
    medium: 'h-11 w-[320px] max-w-full rounded-[10px] px-5 text-sm',
    small: 'h-10 w-[160px] max-w-full rounded-lg px-4 text-sm',
    icon: 'h-10 w-10 rounded-button text-lg',
    action: 'h-10 w-[94px] rounded-[10px] px-3 text-sm',
  };

  readonly #variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-primary text-white shadow-button hover:bg-primary-hover hover:shadow-card-hover',

    secondary:
      'border border-light-border bg-light-surface-alt text-light-text hover:border-primary hover:bg-primary-light hover:text-primary ' +
      'dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text dark:hover:border-primary dark:hover:bg-dark-border dark:hover:text-white',

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
