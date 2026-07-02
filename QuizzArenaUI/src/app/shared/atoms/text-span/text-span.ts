import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type SpanVariant = 'default';
type SpanBold = 'bold' | 'semibold' | 'none';

@Component({
    selector: 'qz-text-span',
    templateUrl: './text-span.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextSpan {
    text = input.required<string>();
    variant = input<SpanVariant>('default');
    bold = input<SpanBold>('none');

    variants: Record<SpanVariant, string> = {
        default: 'text-light-text dark:text-dark-text',
    } as const;

    bolds: Record<SpanBold, string> = {
        bold: 'font-bold',
        semibold: 'font-semibold',
        none: '',
    } as const;
}
