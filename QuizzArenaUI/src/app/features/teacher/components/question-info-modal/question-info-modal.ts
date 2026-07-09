import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { DatePipe } from "@angular/common";
import { Button } from "../../../../shared/atoms/button/button";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { Question } from "../../models/question";
import { ModalRef } from "../../../../core/services/modal.service";


@Component({
    selector: 'qz-question-info-modal',
    templateUrl: './question-info-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, DatePipe, Button, TextSpan],
})
export class QuestionInfoModal {
    readonly #modalRef = inject(ModalRef);
    isModalOpened = input<boolean>(true);
    closeModalEvent = output<void>();

    question = input.required<Question>();

    handleCloseModalEvent() {
        this.closeModalEvent.emit();
        this.#modalRef.close();
    }
}
