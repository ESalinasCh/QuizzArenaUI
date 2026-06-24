import { Component, computed, input, output, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ExamQuestionCard } from '../exam-question-card/exam-question-card';
import { Question } from '../../models/exam.model';

@Component({
  selector: 'qz-exam-step-questions',
  imports: [Button, ExamQuestionCard],
  templateUrl: './exam-step-questions.html',
})
export class ExamStepQuestions {
  questions = input.required<Question[]>();

<<<<<<< HEAD
  publish = output<Set<string>>();
  saveToBank = output<Set<string>>();
  back = output<void>();

  readonly backAriaLabel = $localize`:Exam step questions back button aria label:Back`;
  readonly publishAriaLabel = $localize`:Exam step questions publish button aria label:Publish exam`;
  readonly saveToBankAriaLabel = $localize`:Exam step questions save to bank button aria label:Save to exam bank`;

=======
  next = output<Set<string>>();
  back = output<void>();

>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  readonly removedIds = signal<Set<string>>(new Set());
  readonly selectedIds = signal<Set<string>>(new Set());

  readonly visibleQuestions = computed(() =>
    this.questions().filter(q => !this.removedIds().has(q.id)),
  );

  readonly selectedCount = computed(() => this.selectedIds().size);
<<<<<<< HEAD
=======

>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  readonly canContinue = computed(() => this.selectedIds().size > 0);

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleQuestion(id: string): void {
    this.selectedIds.update(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  removeQuestion(id: string): void {
    this.removedIds.update(prev => new Set([...prev, id]));
    this.selectedIds.update(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

<<<<<<< HEAD
  submitPublish(): void {
    if (!this.canContinue()) return;
    this.publish.emit(new Set(this.selectedIds()));
  }

  submitSaveToBank(): void {
    if (!this.canContinue()) return;
    this.saveToBank.emit(new Set(this.selectedIds()));
=======
  submit(): void {
    if (!this.canContinue()) return;
    this.next.emit(new Set(this.selectedIds()));
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  }
}
