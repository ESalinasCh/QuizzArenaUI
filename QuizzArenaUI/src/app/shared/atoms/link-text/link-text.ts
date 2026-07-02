import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'qz-link-text',
    standalone: true,
    templateUrl: './link-text.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkText {
    readonly ariaLabel = input<string | null>(null);
    readonly text = input<string>('');
}
