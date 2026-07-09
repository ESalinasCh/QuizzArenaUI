import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
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
    imports: [ItemContainer, DatePipe, Button, TextSpan],
})
export class QuestionInfoModal {
    readonly #modalRef = inject(ModalRef);
    question = input.required<Question>();

    handleCloseModalEvent() {
        this.#modalRef.close();
    }
}
