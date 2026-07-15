import { Component, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { form, FormField } from '@angular/forms/signals';
import { CheckboxInputComponent } from "../../../../shared/molecules/checkbox-input/checkbox-input";
import { QuestionFilter } from '../../models/question-form-filter';
import { QUESTION_STATUS_RESPONSE, StatusQuestionOptions } from '../../mocks/questionStatusResponse.mock';
import { TYPE_OPTIONS_MOCK, TypeQuestionOptions } from '../../mocks/typeQuestionOptions.mock';
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { ModalRef } from '../../../../core/services/modal.service';

@Component({
    selector: 'qz-question-filter-modal',
    imports: [Button, FormField, CheckboxInputComponent, ItemContainer, TextSpan],
    templateUrl: './question-filter-modal.html',

})
export class QuestionFilterModal implements OnInit {
    readonly #modalRef = inject(ModalRef);
    questionFilter = input.required<QuestionFilter>();
    questionFilterModel = linkedSignal(() => this.questionFilter());
    questionFilterForm = form<QuestionFilter>(this.questionFilterModel);

    statusOptions = signal<StatusQuestionOptions[]>([]);
    typeOptions = signal<TypeQuestionOptions[]>([]);

    ngOnInit(): void {
        this.getStatus();
        this.getTypes();
    }

    protected applyFilters(): void {
        this.#modalRef.close(this.questionFilterModel());
    }

    protected cleanFilters(): void {
        this.#modalRef.close(new QuestionFilter());
    }

    protected closeFilterModal() {
        this.#modalRef.close();
    }

    private getStatus() {
        this.statusOptions.set(structuredClone(QUESTION_STATUS_RESPONSE));
    }
    private getTypes() {
        this.typeOptions.set(structuredClone(TYPE_OPTIONS_MOCK));
    }
}
