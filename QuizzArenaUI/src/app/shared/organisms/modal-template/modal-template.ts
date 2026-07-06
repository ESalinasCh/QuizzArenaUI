import { Component, HostListener, input, output, viewChild, ViewContainerRef } from "@angular/core";

@Component({
    selector: 'qz-modal',
    templateUrl: './modal-template.html',
    styleUrls: ['./modal-template.css'],
})
export class ModalTemplateComponent {
    modalContentRef = viewChild('modalContent', { read: ViewContainerRef });

    title = input<string>('');
    width = input<string>('70vw');
    maxWidth = input<string>('90vw');
    closeOnOverlayClick = input<boolean>(true);
    showCloseButton = input<boolean>(true);
    showFooter = input<boolean>(false);
    isModalOpened = input<boolean>(true);

    isModalOpened = model.required();

    close(): void {
        this.closeEvent.emit();
        this.isModalOpened.set(false);
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