import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { Grade } from '../../models/exam.model';
import { GradeStatusLabel } from '../../../../shared/atoms/grade-status-label/grade-status-label';

@Component({
  selector: 'qz-grade-card',
  imports: [GradeStatusLabel, Button],
  templateUrl: './grade-card.html',
})
export class GradeCard {
  @ViewChild('MenuButton') botonRef!: ElementRef;
  menuOpen = signal(false);
  grade = input.required<Grade>();
  expanded = input<boolean>(false);
  toggleAttempts = output<string>();
  resetAttempts = output<string>();
  viewResults = output<string>();

  readonly viewAttemptLabel = $localize`:Grade card view attempt button:View attempt`;

  openMenu() {
    this.menuOpen.update((open) => !open);
  }

  onToggle(): void {
    this.toggleAttempts.emit(this.grade().id);
  }

  reset(): void {
    this.resetAttempts.emit(this.grade().id);
  }

  onViewResults(attemptId: string): void {
    this.viewResults.emit(attemptId);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.botonRef.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }
}
