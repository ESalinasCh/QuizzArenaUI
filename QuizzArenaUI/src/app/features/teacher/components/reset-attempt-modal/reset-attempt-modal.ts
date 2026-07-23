import { Component, inject, input } from "@angular/core";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { Button } from "../../../../shared/atoms/button/button";
import { ModalRef } from "../../../../core/services/modal.service";
import { Grade } from "../../models/exam.model";

@Component({
    selector: 'qz-reset-attempt-modal',
    templateUrl: './reset-attempt-modal.html',
    imports: [ItemContainer, Button],
})
export class ResetAttemptModal {
    readonly #modalRef = inject(ModalRef);
    attempt = input.required<Grade>();

    closeModal(): void {
        this.#modalRef.close();
    }

    handleResetClick() {
        this.#modalRef.close(this.attempt().userId);
    }

    handleCloseModalEvent() {
        this.closeModal();
    }
}
