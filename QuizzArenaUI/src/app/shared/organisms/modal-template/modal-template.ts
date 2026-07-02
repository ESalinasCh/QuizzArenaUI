import { Component, HostListener, input, output } from "@angular/core";

@Component({
    selector: 'qz-modal',
    templateUrl: './modal-template.html',
    styleUrls: ['./modal-template.css'],
})
export class ModalTemplateComponent {
    title = input<string>('');
    width = input<string>('500px');
    maxWidth = input<string>('90vw');
    closeOnOverlayClick = input<boolean>(true);
    showCloseButton = input<boolean>(true);
    showFooter = input<boolean>(false);

    closedModalEvent = output<void>();

    close(): void {
        this.closedModalEvent.emit();
    }

    onOverlayClick(): void {
        if (this.closeOnOverlayClick()) {
            this.close();
        }
    }

    @HostListener('document:keydown.escape')
    onEscapePress(): void {
        this.close();
    }
}