import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ModalRef } from "../../../../core/services/modal.service";

@Component({
    selector: 'qz-question-info-modal',
    templateUrl: './question-info-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent],
})
export class QuestionInfoModal {
    readonly #modalRef = inject(ModalRef);

    toogleShowModal() {
        this.#modalRef.close();
    }
}
