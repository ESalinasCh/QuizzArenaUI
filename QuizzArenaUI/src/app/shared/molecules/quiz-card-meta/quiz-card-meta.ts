import { Component, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';
import { StatusLabel, StatusLabelVariant } from '../../atoms/status-label/status-label';

export interface QuizCardMetaItem {
  label: string;
  value: string;
  icon?: IconName;
  variant?: StatusLabelVariant;
}

@Component({
  selector: 'qz-quiz-card-meta',
  imports: [Icon, StatusLabel],
  templateUrl: './quiz-card-meta.html',
})
export class QuizCardMeta {
  items = input.required<readonly QuizCardMetaItem[]>();
}
