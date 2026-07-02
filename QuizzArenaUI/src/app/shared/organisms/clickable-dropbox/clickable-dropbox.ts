import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output } from '@angular/core';

type AlignDropbox = 'right' | 'left';

@Component({
    selector: 'qz-clickable-dropbox',
    templateUrl: './clickable-dropbox.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ClickableDropbox {
    private elementRef = inject(ElementRef<HTMLElement>);

    closed = output<void>();
    align = input<AlignDropbox>('right');
    autoClosingByAClick = input(true)

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
        if (
            !clickedInside ||
            (clickedInside && this.autoClosingByAClick())
        ) {
            this.closed.emit();
        }
    }
}
