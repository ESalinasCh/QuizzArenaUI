import { Pipe, PipeTransform } from '@angular/core';
import { Option } from '../../features/teacher/models/options';

@Pipe({
  name: 'sortOptions'
})
export class SortOptionsPipe implements PipeTransform {
  transform(options: Option[] | undefined | null): Option[] {
    if (!options) {
      return [];
    }
    return [...options].sort((a, b) => a.position - b.position);
  }
}
