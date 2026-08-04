import { Component, inject, input } from "@angular/core";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { Button } from "../../../../shared/atoms/button/button";
import { ModalRef } from "../../../../core/services/modal.service";
import { Match } from "../../models/exam.model";

@Component({
    selector: 'qz-unpublish-match-modal',
    templateUrl: './unpublish-match-modal.html',
    imports: [ItemContainer, Button],
})
export class UnpublishMatchModal {
    readonly #modalRef = inject(ModalRef);
    match = input.required<Match>();

    closeModal(): void {
        this.#modalRef.close();
    }

    handleResetClick() {
        this.#modalRef.close(this.match().id);
    }

    handleCloseModalEvent() {
        this.closeModal();
    }
}
