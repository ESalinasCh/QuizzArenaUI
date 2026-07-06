import { ChangeDetectionStrategy, Component, linkedSignal, model, output, signal } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { SelectInput } from "../../../../shared/molecules/select-input/select-input";
import { STATUS_OPTIONS_MOCK } from "../../mocks/statusOptions.mock";
import { TYPE_OPTIONS_MOCK } from "../../mocks/typeQuestionOptions.mock";
import { TextareaInput } from "../../../../shared/molecules/text-input copy/textarea-input";
import { Quiz } from "../../../../core/models/quiz";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { form, FormField } from "@angular/forms/signals";


@Component({
    selector: 'qz-question-edit-modal',
    templateUrl: './question-edit-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, TextInput, SelectInput, TextareaInput, TextSpan, FormField],
})
export class QuestionEditModal {
    isModalOpened = model.required<boolean>();
    quiz = model.required<Quiz>();

    closeModalEvent = output<void>();

    quizScreenshot = linkedSignal(()=>{
        console.log(this.quiz())
        return this.isModalOpened() ? this.quiz() : this.quiz();
    });
    quizForm = form(this.quizScreenshot);

    states = signal(structuredClone(STATUS_OPTIONS_MOCK));
    types = signal(structuredClone(TYPE_OPTIONS_MOCK));
    
    handleCloseModal() {
        console.log(this.quiz())
        this.closeModalEvent.emit();
    }
}
