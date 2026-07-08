import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { DatePipe } from "@angular/common";
import { Button } from "../../../../shared/atoms/button/button";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { Question } from "../../models/question";


@Component({
    selector: 'qz-question-info-modal',
    templateUrl: './question-info-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, DatePipe, Button, TextSpan],
})
export class QuestionInfoModal {
    isModalOpened = input.required<boolean>();
    closeModalEvent = output<void>();

    question = input.required<Question>();

    handleCloseModalEvent() {
        this.closeModalEvent.emit();
    }
}
