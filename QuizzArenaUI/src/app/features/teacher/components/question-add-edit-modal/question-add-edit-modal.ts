import { ChangeDetectionStrategy, Component, linkedSignal, model, output, signal } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { SelectInput } from "../../../../shared/molecules/select-input/select-input";
import { TYPE_OPTIONS_MOCK } from "../../mocks/typeQuestionOptions.mock";
import { TextareaInput } from "../../../../shared/molecules/textarea-input/textarea-input";
import { Question } from "../../../../core/models/Question";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { form, FormField } from "@angular/forms/signals";
import { OPTIONS_MOCK } from "../../mocks/optionsMock.";
import { QUESTION_STATUS_RESPONSE } from "../../mocks/questionStatusResponse.mock";
import { Option } from "../../../../core/models/Options";
import { Button } from "../../../../shared/atoms/button/button";
@Component({
    selector: 'qz-question-add-edit-modal',
    templateUrl: './question-add-edit-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, SelectInput, TextareaInput, TextSpan, FormField, Button],
})
export class QuestionEditModal {
    isModalOpened = model.required<boolean>();
    question = model.required<Question>();

    closeModalEvent = output<void>();

    temporalQuestion = linkedSignal(() => {
        return this.isModalOpened() ? this.question() : this.question();
    });
    questionForm = form(this.temporalQuestion);

    states = signal(structuredClone(QUESTION_STATUS_RESPONSE));
    types = signal(structuredClone(TYPE_OPTIONS_MOCK));
    options = linkedSignal(() => {
        const options = structuredClone(OPTIONS_MOCK)
            .filter(opt => opt.questionId == this.question().id)
            .sort((a, b) => a.position - b.position);
        return this.isModalOpened() ? options : options;
    });

    closeModal() {
        this.isModalOpened.set(false);
    }

    handleClickOptionToChangeCorrectStatus(option: Option) {
        option.isCorrect = !option.isCorrect;
    }

    handleCancelButton() {
        this.closeModal();
    }

    handleSubmitForm(event: Event) {
        event.preventDefault();
        this.question.set(this.questionForm().value());
        this.closeModal();
    }

    handleCloseModal() {
        this.closeModalEvent.emit();
    }

}
