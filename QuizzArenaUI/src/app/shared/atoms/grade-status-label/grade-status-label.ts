import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { GradeStatus } from '../../../features/teacher/models/exam.model';

@Component({
    selector: 'qz-grade-status-label',
    imports: [NgClass],
    templateUrl: './grade-status-label.html',
})
export class GradeStatusLabel {
    status = input.required<GradeStatus>();

    readonly statusClasses: Record<GradeStatus, string> = {
        Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        Timeout: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        InProgress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
}
