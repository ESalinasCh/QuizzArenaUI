import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from "@angular/core";
import { ModalTemplateComponent } from "../../../../shared/organisms/modal-template/modal-template";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { SelectInput } from "../../../../shared/molecules/select-input/select-input";
import { TYPE_OPTIONS_MOCK } from "../../mocks/typeQuestionOptions.mock";
import { TextareaInput } from "../../../../shared/molecules/textarea-input/textarea-input";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { form, FormField } from "@angular/forms/signals";
import { OPTIONS_MOCK } from "../../mocks/options.mock";
import { QUESTION_STATUS_RESPONSE } from "../../mocks/questionStatusResponse.mock";
import { Button } from "../../../../shared/atoms/button/button";
import { ModalMethods } from "../../../../shared/organisms/modal-template/ModalMethods";
import { PROCESS_JOB_MOCK } from "../../mocks/processJob.mock";
import { Question } from "../../models/question";
import { Option } from "../../models/options";

const changeOptionCorrectStatus = (currentOptions: Option[], selectedOption: Option) => {
    return currentOptions.map(opt => ({
        ...opt,
        isCorrect: opt.position == selectedOption.position ? !opt.isCorrect : opt.isCorrect
    }))
};

@Component({
    selector: 'qz-question-add-edit-modal',
    templateUrl: './question-add-edit-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ModalTemplateComponent, ItemContainer, SelectInput, TextareaInput, TextSpan, FormField, Button],
})
export class QuestionEditModal implements ModalMethods {
    question = input<Question>(new Question());
    formType = computed(() => this.question().id == '' ? 'Create' : 'Edit');
    isModalOpened = input.required<boolean>();
    closeModalEvent = output<void>();
    newQuestion = output<Question>();

    questionModel = linkedSignal(() => { return this.isModalOpened() ? this.question() : this.question() });
    questionForm = form(this.questionModel);

    states = signal(structuredClone(QUESTION_STATUS_RESPONSE));
    types = signal(structuredClone(TYPE_OPTIONS_MOCK));
    processJobs = signal(structuredClone(PROCESS_JOB_MOCK));
    optionsModel = linkedSignal(() => {
        const options = structuredClone(OPTIONS_MOCK)
            .filter(opt => opt.questionId == this.question().id)
            .sort((a, b) => a.position - b.position);
        return this.isModalOpened() ? options : options;
    });

    closeModal() {
        this.closeModalEvent.emit();
    }

    handleChangeCorrectAnswer(selectedOption: Option) {
        this.optionsModel.update(currentOptions => {
            return changeOptionCorrectStatus(currentOptions, selectedOption);
        });
    }

    handleCancelButton() {
        this.closeModal();
    }

    handleSubmitForm(event: Event) {
        event.preventDefault();
        this.newQuestion.emit(this.questionModel());
        this.closeModal();
    }

    handleCloseModal() {
        this.closeModal();
    }

}
