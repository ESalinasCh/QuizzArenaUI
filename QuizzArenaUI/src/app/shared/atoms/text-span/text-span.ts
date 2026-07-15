import { Component, input } from '@angular/core';

type SpanVariant = 'default';
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
    additionalCssClasses = input('');

    variants: Record<SpanVariant, string> = {
        default: 'text-light-text dark:text-dark-text',
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
