import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ExamQuestionCard } from '../exam-question-card/exam-question-card';
import { Question } from '../../models/exam.model';

@Component({
  selector: 'qz-exam-step-questions',
  imports: [Button, ExamQuestionCard],
  templateUrl: './exam-step-questions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamStepQuestions {
  questions = input.required<Question[]>();

  next = output<Set<string>>();
  back = output<void>();

  readonly removedIds = signal<Set<string>>(new Set());
  readonly selectedIds = signal<Set<string>>(new Set());

  readonly visibleQuestions = computed(() =>
    this.questions().filter(q => !this.removedIds().has(q.id)),
  );

  readonly selectedCount = computed(() => this.selectedIds().size);

  readonly canContinue = computed(() => this.selectedIds().size > 0);

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleQuestion(id: string): void {
    this.selectedIds.update(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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

  submit(): void {
    if (!this.canContinue()) return;
    this.next.emit(new Set(this.selectedIds()));
  }
}
