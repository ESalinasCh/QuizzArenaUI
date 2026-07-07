import { ChangeDetectionStrategy, Component, linkedSignal, model, OnInit, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ModalTemplateComponent } from '../../../../shared/organisms/modal-template/modal-template';
import { form, FormField } from '@angular/forms/signals';
import { CheckboxInputComponent } from "../../../../shared/molecules/checkbox-input/checkbox-input";
import { TestFormFilter } from '../../models/test-form-filter';
import { QUESTION_STATUS_RESPONSE, StatusQuestionOptions } from '../../mocks/questionStatusResponse.mock';
import { TYPE_OPTIONS_MOCK, TypeQuestionOptions } from '../../mocks/typeQuestionOptions.mock';

@Component({
    selector: 'qz-question-filter-modal',
    imports: [Button, ModalTemplateComponent, FormField, CheckboxInputComponent],
    templateUrl: './question-filter-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFilterModal implements OnInit {
    isModalOpened = model.required<boolean>();
    questionFilterModel = model.required<TestFormFilter>();

    filterScreenshotModel = linkedSignal(() => {
        if (this.isModalOpened()) return structuredClone(this.questionFilterModel());
        return structuredClone(this.questionFilterModel())
    });
    filterForm = form<TestFormFilter>(this.filterScreenshotModel);

    statusOptions = signal<StatusQuestionOptions[]>([]);
    typeOptions = signal<TypeQuestionOptions[]>([]);
    
    ngOnInit(): void {
        this.getStatus();
        this.getTypes();
    }

    protected applyFilters(): void {
        this.questionFilterModel.set(structuredClone(this.filterScreenshotModel()));
        this.closeFilterModal();
    }

    protected cleanFilters(): void {
        this.questionFilterModel.set(new TestFormFilter());
        this.closeFilterModal();
    }

    protected closeFilterModal() {
        return this.isModalOpened.set(false);
    }

    private getStatus() {
        this.statusOptions.set(structuredClone(QUESTION_STATUS_RESPONSE));
    }
    private getTypes() {
        this.typeOptions.set(structuredClone(TYPE_OPTIONS_MOCK));
    }
}
