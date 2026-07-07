import { ChangeDetectionStrategy, Component, model, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { Button } from "../../../../shared/atoms/button/button";


@Component({
    selector: 'qz-question-delete-modal',
    templateUrl: './question-delete-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, Button],
})
export class QuestionDeleteModal {
    isModalOpened = model.required();
    closeShowModalEvent = output<void>();
    
    handleCloseModalEvent() {
        this.closeShowModalEvent.emit();
    }
}
