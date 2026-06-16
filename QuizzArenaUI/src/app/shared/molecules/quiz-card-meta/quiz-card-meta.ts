import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MetaText } from '../../atoms/meta-text/meta-text';
import { StatusLabel, StatusLabelVariant } from '../../atoms/status-label/status-label';

@Component({
  selector: 'qz-quiz-card-meta',
  standalone: true,
  imports: [MetaText, StatusLabel],
  templateUrl: './quiz-card-meta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizCardMeta {
  questionCount = input.required<number>();
  statusLabel = input.required<string>();
  statusVariant = input<StatusLabelVariant>('info');
}
