import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";


@Component({
    selector: 'qz-question-edit-modal',
    templateUrl: './question-edit-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent],
})
export class QuestionEditModal {
    handleToogleShowModal = output<void>();
    
    toogleShowModal() {
        this.handleToogleShowModal.emit();
    }
}
