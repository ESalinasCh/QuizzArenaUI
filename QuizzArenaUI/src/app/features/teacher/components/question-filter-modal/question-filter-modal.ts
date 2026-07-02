import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ExamStatus } from '../../models/exam.model';
import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { ModalTemplateComponent } from '../../../../shared/organisms/modal-template/modal-template';
import { form, FormField } from '@angular/forms/signals';
import { CheckboxInputComponent } from "../../../../shared/molecules/checkbox-input/checkbox-input";
import { ExamFormFilter } from '../../models/exam-form-filter';

@Component({
    selector: 'qz-question-filter-modal',
    imports: [Button, TextInput, ModalTemplateComponent, FormField, CheckboxInputComponent],
    templateUrl: './question-filter-modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFilterModal {
    protected handleToogleModal = output<void>();
    protected handleNewFilter = output<ExamFormFilter>();
    validFilter = input<ExamFormFilter>(new ExamFormFilter());
    protected filterModel = linkedSignal(() => ({ ...this.validFilter() }));
    protected filterForm = form<ExamFormFilter>(this.filterModel);
    protected stateOptions: { key: ExamStatus, label: string }[] = [
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'Published' },
    ];

    protected applyFilters(): void {
        this.handleNewFilter.emit({
            endDate: this.filterModel().endDate,
            startDate: this.filterModel().startDate,
            states: this.filterModel().states,
        });
        this.toogleFilterModal();
    }

    protected cleanFilters(): void {
        this.handleNewFilter.emit(new ExamFormFilter());
        this.toogleFilterModal();
    }

    protected toogleFilterModal() {
        this.handleToogleModal.emit();
    }

}
