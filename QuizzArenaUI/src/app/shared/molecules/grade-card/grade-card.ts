import { Component, input, output } from '@angular/core';
import { Grade } from '../../../features/teacher/models/exam.model';
import { GradeStatusLabel } from '../../atoms/grade-status-label/grade-status-label';

@Component({
    selector: 'qz-grade-card',
    imports: [GradeStatusLabel],
    templateUrl: './grade-card.html',
})
export class GradeCard {
    grade = input.required<Grade>();
    expanded = input<boolean>(false);

    toggleAttempts = output<string>();

    onToggle(): void {
        this.toggleAttempts.emit(this.grade().id);
    }
}
