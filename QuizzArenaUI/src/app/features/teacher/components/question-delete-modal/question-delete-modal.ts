import { Component, inject, input } from "@angular/core";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { Button } from "../../../../shared/atoms/button/button";
import { Question } from "../../models/question";
import { ModalRef } from "../../../../core/services/modal.service";


@Component({
    selector: 'qz-question-delete-modal',
    templateUrl: './question-delete-modal.html',

    imports: [ItemContainer, Button],
})
export class QuestionDeleteModal {
    readonly #modalRef = inject(ModalRef);
    question = input.required<Question>();

    closeModal(): void {
        this.#modalRef.close();
    }

    handleDeleteClick() {
        this.#modalRef.close(this.question().id);
    }

    handleCloseModalEvent() {
        this.closeModal();
    }
}
