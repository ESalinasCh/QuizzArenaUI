import { Component, input } from '@angular/core';

export type ItemContainerVariant = 'none' | 'success' | 'danger';

@Component({
    selector: 'qz-item-container',
    imports: [],
    templateUrl: './item-container.html',

})
export class ItemContainer {
    clickable = input(false);
    withBorders = input(true);
    variant = input<ItemContainerVariant>('none');
    additionalClasses = input('');
}
