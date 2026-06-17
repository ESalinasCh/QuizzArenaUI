import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_TRUNCATE_LENGTH = 18;
const TRUNCATE_SUFFIX = '...';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = DEFAULT_TRUNCATE_LENGTH): string {
    if (!value) {
      return '';
    }

    return value.length > maxLength ? `${value.slice(0, maxLength)}${TRUNCATE_SUFFIX}` : value;
  }
}
