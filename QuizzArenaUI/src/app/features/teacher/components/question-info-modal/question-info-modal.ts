import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";


@Component({
    selector: 'qz-question-info-modal',
    templateUrl: './question-info-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent],
})
export class QuestionInfoModal {
    handleToogleShowModal = output<void>();
    
    toogleShowModal() {
        this.handleToogleShowModal.emit();
    }
}
