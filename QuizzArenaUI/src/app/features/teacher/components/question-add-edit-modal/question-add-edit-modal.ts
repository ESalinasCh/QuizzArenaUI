import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from "@angular/core";
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { SelectInput } from "../../../../shared/molecules/select-input/select-input";
import { TYPE_OPTIONS_MOCK } from "../../mocks/typeQuestionOptions.mock";
import { TextareaInput } from "../../../../shared/molecules/textarea-input/textarea-input";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { form, FormField } from "@angular/forms/signals";
import { QUESTION_STATUS_RESPONSE } from "../../mocks/questionStatusResponse.mock";
import { Button } from "../../../../shared/atoms/button/button";
import { PROCESS_JOB_MOCK } from "../../mocks/processJob.mock";
import { Question } from "../../models/question";
import { Option } from "../../models/options";
import { ModalRef } from "../../../../core/services/modal.service";

import { Icon } from "../../../../shared/atoms/icon/icon";

import { calculateQuestionDelta, QuestionDelta } from "./question-delta.utils";
import { SortOptionsPipe } from "../../../../shared/pipes/sort-options.pipe";

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
    imports: [ItemContainer, SelectInput, TextareaInput, TextSpan, FormField, Button, Icon, SortOptionsPipe],
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
        return [];
    });

    originalQuestion = linkedSignal(() => {
        return structuredClone(this.question());
    });

    originalOptions = linkedSignal(() => {
        if (this.question().options && this.question().options!.length > 0) {
            return structuredClone(this.question().options!);
        }
        return [];
    });

    editingOptionPosition = signal<number | null>(null);

    startEditingOption(option: Option) {
        this.editingOptionPosition.set(option.position);
    }

    saveOptionDescription(option: Option, newDescription: string) {
        this.optionsModel.update(opts =>
            opts.map(o => o.position === option.position ? { ...o, description: newDescription } : o)
        );
        this.editingOptionPosition.set(null);
    }

    handleAddOption() {
        const currentOpts = this.optionsModel();
        const nextPosition = currentOpts.length > 0 ? Math.max(...currentOpts.map(o => o.position)) + 1 : 1;
        const newOpt: Option = {
            description: '',
            isCorrect: false,
            position: nextPosition,
            questionId: this.question().id
        };
        this.optionsModel.update(opts => [...opts, newOpt]);
        this.editingOptionPosition.set(nextPosition);
    }

    validationError = signal<string | null>(null);

    closeModal(result?: Question | QuestionDelta) {
        this.#modalRef.close(result);
    }

    handleChangeCorrectAnswer(selectedOption: Option) {
        this.validationError.set(null);
        this.optionsModel.update(currentOptions => {
            return changeOptionCorrectStatus(currentOptions, selectedOption);
        });
    }

    handleCancelButton() {
        this.closeModal();
    }

    handleSubmitForm(event: Event) {
        event.preventDefault();

        const correctCount = this.optionsModel().filter(o => o.isCorrect).length;
        const qType = this.questionModel().type;

        if (qType === 'SingleChoice' && correctCount !== 1) {
            this.validationError.set('A Single Choice question must have exactly 1 correct answer option.');
            return;
        }

        if (qType === 'MultipleChoice' && correctCount < 1) {
            this.validationError.set('A Multiple Choice question must have at least 1 correct answer option.');
            return;
        }

        this.validationError.set(null);

        if (this.formType() === 'Create') {
            const updated = {
                ...this.questionModel(),
                options: this.optionsModel()
            };
            this.closeModal(updated as Question);
            return;
        }

        const delta = calculateQuestionDelta(
            this.questionModel(),
            this.originalQuestion(),
            this.optionsModel(),
            this.originalOptions()
        );

        this.closeModal(delta);
    }

    handleCloseModal() {
        this.closeModal();
    }

}
