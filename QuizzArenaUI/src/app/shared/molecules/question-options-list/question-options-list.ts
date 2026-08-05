import { Component, input } from '@angular/core';
import { TextSpan } from '../../atoms/text-span/text-span';
import { Icon } from '../../atoms/icon/icon';

export interface QuestionOptionListItem {
  id?: string;
  description: string;
  isCorrect: boolean;
  position: number;
}

@Component({
  selector: 'qz-question-options-list',
  templateUrl: './question-options-list.html',
  imports: [TextSpan, Icon],
})
export class QuestionOptionsList {
  options = input.required<QuestionOptionListItem[]>();

  getOptionLetter(index: number): string {
    let letter = '';
    let n = index;
    do {
      letter = String.fromCharCode(65 + (n % 26)) + letter;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return letter;
  }
}
