import { Component, input } from '@angular/core';

@Component({
    selector: 'qz-link-text',

    templateUrl: './link-text.html',

})
export class LinkText {
    readonly ariaLabel = input<string | null>(null);
    readonly text = input<string>('');
}
