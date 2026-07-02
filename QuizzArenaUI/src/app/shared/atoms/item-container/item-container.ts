import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'qz-item-container',
    imports: [],
    templateUrl: './item-container.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemContainer {
    clickable = input(false);
    withBorders = input(true);
    additionalClasses = input('');
}
