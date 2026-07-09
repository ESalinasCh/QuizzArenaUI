import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { Button } from "../../../../shared/atoms/button/button";
import { Question } from "../../models/question";
import { ModalRef } from "../../../../core/services/modal.service";


@Component({
    selector: 'qz-question-delete-modal',
    templateUrl: './question-delete-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, Button],
})
export class QuestionDeleteModal {
    readonly #modalRef = inject(ModalRef);
    isModalOpened = input<boolean>(true);
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
