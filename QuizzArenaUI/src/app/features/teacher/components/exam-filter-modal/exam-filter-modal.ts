import { Component, inject, input, linkedSignal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ExamStatus } from '../../models/exam.model';
import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { form, FormField } from '@angular/forms/signals';
import { CheckboxInputComponent } from "../../../../shared/molecules/checkbox-input/checkbox-input";
import { ExamFormFilter } from '../../models/exam-form-filter';
import { ModalRef } from '../../../../core/services/modal.service';

@Component({
    selector: 'qz-exam-filter-modal',
    imports: [Button, TextInput, FormField, CheckboxInputComponent],
    templateUrl: './exam-filter-modal.html',
})
export class ExamFilterModal {
    readonly #modalRef = inject(ModalRef);

    validFilter = input<ExamFormFilter>(new ExamFormFilter());
    protected filterModel = linkedSignal(() => ({ ...this.validFilter() }));
    protected filterForm = form<ExamFormFilter>(this.filterModel);
    protected stateOptions: { key: ExamStatus, label: string }[] = [
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'Published' },
    ];

    protected applyFilters(): void {
        this.#modalRef.close(this.filterModel());
    }

    protected cleanFilters(): void {
        this.#modalRef.close(new ExamFormFilter());
    }

    protected toogleFilterModal() {
        this.#modalRef.close();
    }

}
