import { Component, ElementRef, HostListener, input, output, signal, ViewChild } from '@angular/core';
import { Grade } from '../../../features/teacher/models/exam.model';
import { GradeStatusLabel } from '../../atoms/grade-status-label/grade-status-label';

@Component({
    selector: 'qz-grade-card',
    imports: [GradeStatusLabel],
    templateUrl: './grade-card.html',
})
export class GradeCard {
    @ViewChild('MenuButton') botonRef!: ElementRef; 
    menuOpen = signal(false);
    grade = input.required<Grade>();
    expanded = input<boolean>(false);
    toggleAttempts = output<string>();
    resetAttempts = output<string>();
    openMenu() {
        this.menuOpen.update((open) => !open);
    }

    onToggle(): void {
        this.toggleAttempts.emit(this.grade().id);
    }

    reset(): void {
        this.resetAttempts.emit(this.grade().id);
    }
    
    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
        if (!this.botonRef.nativeElement.contains(event.target)) {
            this.menuOpen.set(false);
        }
    }
}
