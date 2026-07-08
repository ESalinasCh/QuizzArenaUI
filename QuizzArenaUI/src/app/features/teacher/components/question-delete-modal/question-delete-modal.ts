import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { Button } from "../../../../shared/atoms/button/button";
import { ModalMethods } from "../../../../shared/organisms/modal-template/ModalMethods";
import { Question } from "../../models/question";


@Component({
    selector: 'qz-question-delete-modal',
    templateUrl: './question-delete-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, Button],
})
export class QuestionDeleteModal implements ModalMethods {
    closeModalEvent = output<void>();
    confirmDeleteEvent = output<string>();
    isModalOpened = input.required<boolean>();
    question = input.required<Question>();

    closeModal(): void {
        this.closeModalEvent.emit();
    }

    handleDeleteClick() {
        this.confirmDeleteEvent.emit(this.question().id);
        this.closeModal();
    }

    handleCloseModalEvent() {
        this.closeModal();
    }
}
