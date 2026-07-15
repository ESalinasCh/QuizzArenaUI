import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from "@angular/core";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { SelectInput } from "../../../../shared/molecules/select-input/select-input";
import { TYPE_OPTIONS_MOCK } from "../../mocks/typeQuestionOptions.mock";
import { TextareaInput } from "../../../../shared/molecules/textarea-input/textarea-input";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { form, FormField } from "@angular/forms/signals";
import { OPTIONS_MOCK } from "../../mocks/options.mock";
import { QUESTION_STATUS_RESPONSE } from "../../mocks/questionStatusResponse.mock";
import { Button } from "../../../../shared/atoms/button/button";
import { PROCESS_JOB_MOCK } from "../../mocks/processJob.mock";
import { Question } from "../../models/question";
import { Option } from "../../models/options";
import { ModalRef } from "../../../../core/services/modal.service";

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
    imports: [ItemContainer, SelectInput, TextareaInput, TextSpan, FormField, Button],
})
export class QuestionEditModal {
    readonly #modalRef = inject(ModalRef);
    question = input<Question>(new Question());
    formType = computed(() => this.question().id == '' ? 'Create' : 'Edit');

    questionModel = linkedSignal(() => this.question());
    questionForm = form(this.questionModel);

    states = signal(structuredClone(QUESTION_STATUS_RESPONSE));
    types = signal(structuredClone(TYPE_OPTIONS_MOCK));
    processJobs = signal(structuredClone(PROCESS_JOB_MOCK));
    optionsModel = linkedSignal(() => {
        if (this.question().options && this.question().options!.length > 0) {
            return structuredClone(this.question().options!);
        }
        return structuredClone(OPTIONS_MOCK)
            .filter(opt => opt.questionId == this.question().id)
            .sort((a, b) => a.position - b.position);
    });

    originalQuestion = linkedSignal(() => {
        return structuredClone(this.question());
    });

    originalOptions = linkedSignal(() => {
        return structuredClone(this.optionsModel());
    });

    closeModal(result?: any) {
        this.#modalRef.close(result);
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
        
        if (this.formType() === 'Create') {
            const updated = {
                ...this.questionModel(),
                options: this.optionsModel()
            };
            this.closeModal(updated as Question);
            return;
        }

        // Edit mode - Calculate Delta
        const currentQuestion = this.questionModel();
        const origQuestion = this.originalQuestion();

        const delta: any = {
            id: currentQuestion.id
        };

        if (currentQuestion.content !== origQuestion.content) {
            delta.content = currentQuestion.content;
        }
        if (currentQuestion.justification !== origQuestion.justification) {
            delta.justification = currentQuestion.justification;
        }
        if (currentQuestion.status !== origQuestion.status) {
            delta.status = currentQuestion.status;
        }
        if (currentQuestion.type !== origQuestion.type) {
            delta.type = currentQuestion.type;
        }

        // Compare Options
        const currentOptions = this.optionsModel();
        const origOptions = this.originalOptions();
        const changedOptions: any[] = [];

        currentOptions.forEach(currOpt => {
            const origOpt = origOptions.find(o => o.position === currOpt.position);
            if (origOpt) {
                const optDelta: any = {};
                let hasChanges = false;

                if (currOpt.description !== origOpt.description) {
                    optDelta.description = currOpt.description;
                    hasChanges = true;
                }
                if (currOpt.isCorrect !== origOpt.isCorrect) {
                    optDelta.isCorrect = currOpt.isCorrect;
                    hasChanges = true;
                }

                if (hasChanges) {
                    optDelta.optionId = currOpt.optionId || currOpt.id;
                    changedOptions.push(optDelta);
                }
            }
        });

        if (changedOptions.length > 0) {
            delta.options = changedOptions;
        }

        this.closeModal(delta);
    }

    handleCloseModal() {
        this.closeModal();
    }

}
