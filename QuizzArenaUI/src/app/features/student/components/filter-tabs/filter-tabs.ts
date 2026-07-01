import { Component, input, output } from '@angular/core';
import { FilterStatusOption } from '../../models/student-quiz.model';
import { MatchStatus } from '../../api/student-quiz.contract';

@Component({
  selector: 'qz-filter-tabs',
  templateUrl: './filter-tabs.html',
})
export class FilterTabs {
  readonly options = input.required<FilterStatusOption[]>();
  readonly value = input.required<MatchStatus | undefined>();
  readonly valueChange = output<MatchStatus>();

  protected select(value: MatchStatus): void {
    this.valueChange.emit(value);
  }
}