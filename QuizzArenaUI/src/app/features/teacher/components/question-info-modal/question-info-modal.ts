import { ChangeDetectionStrategy, Component, input, model, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { Question } from "../../../../core/models/Question";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { DatePipe } from "@angular/common";
import { Button } from "../../../../shared/atoms/button/button";


@Component({
    selector: 'qz-question-info-modal',
    templateUrl: './question-info-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, DatePipe, Button],
})
export class QuestionInfoModal {
    isModalOpened = model.required();
    closeModalEvent = output<void>();

    question = input.required<Question>();

    handleCloseModalEvent() {
        console.log('this.quiz()');
        console.log(this.question());
        this.closeModalEvent.emit();
    }

    closeModalClick() {
        this.closeModalEvent.emit();
        this.isModalOpened.set(false);
    }
}
