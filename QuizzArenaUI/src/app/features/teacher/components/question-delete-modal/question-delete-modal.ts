import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";


@Component({
    selector: 'qz-question-delete-modal',
    templateUrl: './question-delete-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent],
})
export class QuestionDeleteModal {
    handleToogleShowModal = output<void>();
    
    toogleShowModal() {
        this.handleToogleShowModal.emit();
    }
}
