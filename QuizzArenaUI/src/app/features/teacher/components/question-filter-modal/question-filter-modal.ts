import { ChangeDetectionStrategy, Component, input, linkedSignal, OnInit, output, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ModalTemplateComponent } from '../../../../shared/organisms/modal-template/modal-template';
import { form, FormField } from '@angular/forms/signals';
import { CheckboxInputComponent } from "../../../../shared/molecules/checkbox-input/checkbox-input";
import { QuestionFilter } from '../../models/question-form-filter';
import { QUESTION_STATUS_RESPONSE, StatusQuestionOptions } from '../../mocks/questionStatusResponse.mock';
import { TYPE_OPTIONS_MOCK, TypeQuestionOptions } from '../../mocks/typeQuestionOptions.mock';
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";

@Component({
    selector: 'qz-question-filter-modal',
    imports: [Button, ModalTemplateComponent, FormField, CheckboxInputComponent, ItemContainer, TextSpan],
    templateUrl: './question-filter-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFilterModal implements OnInit {
    isModalOpened = input.required<boolean>();
    closeEvent = output<void>();
    newFilterEvent = output<QuestionFilter>();
    questionFilter = input.required<QuestionFilter>();
    questionFilterModel = linkedSignal(() => { this.isModalOpened(); return this.questionFilter() });
    questionFilterForm = form<QuestionFilter>(this.questionFilterModel);

    statusOptions = signal<StatusQuestionOptions[]>([]);
    typeOptions = signal<TypeQuestionOptions[]>([]);

    ngOnInit(): void {
        this.getStatus();
        this.getTypes();
    }

    protected applyFilters(): void {
        this.newFilterEvent.emit(this.questionFilterModel());
        this.closeFilterModal();
    }

    protected cleanFilters(): void {
        this.newFilterEvent.emit(new QuestionFilter());
        this.closeFilterModal();
    }

    protected closeFilterModal() {
        this.closeEvent.emit();
    }

    private getStatus() {
        this.statusOptions.set(structuredClone(QUESTION_STATUS_RESPONSE));
    }
    private getTypes() {
        this.typeOptions.set(structuredClone(TYPE_OPTIONS_MOCK));
    }
}
