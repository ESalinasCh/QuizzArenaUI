import { Component, input } from '@angular/core';

type SpanVariant = 'default' | 'danger' | 'primary' | 'success' | 'info' | 'warning';
type SpanBold = 'bold' | 'semibold' | 'none';
type SpanFontSize = 'default' | 'small' | 'base' | 'big' | 'gigant';
@Component({
    selector: 'qz-text-span',
    templateUrl: './text-span.html',
})
export class TextSpan {
    text = input<string>();
    variant = input<SpanVariant>('default');
    bold = input<SpanBold>('none');
    fontSize = input<SpanFontSize>('default');
    i18n = input<string>('');
    additionalCssClasses = input('');

    variants: Record<SpanVariant, string> = {
        default: 'text-light-text dark:text-dark-text',
        success: 'text-success-text-light dark:text-success-text-dark',
        warning: 'text-warning-text-light dark:text-warning-text-dark',
        danger: 'text-danger-text-light dark:text-danger-text-dark',
        info: 'text-info-text-light dark:text-info-text-dark',
        primary: 'text-primary',
    } as const;

    bolds: Record<SpanBold, string> = {
        bold: 'font-bold',
        semibold: 'font-semibold',
        none: '',
    } as const;

    fontSizes: Record<SpanFontSize, string> = {
        default: '',
        small: 'text-xs',
        base: 'text-base',
        big: 'text-xl',
        gigant: 'text-3xl',
    } as const;

}
