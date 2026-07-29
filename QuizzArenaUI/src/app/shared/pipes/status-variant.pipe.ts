import { Pipe, PipeTransform } from '@angular/core';
import { StatusLabelVariant } from '../atoms/status-label/status-label';

@Pipe({
  name: 'statusVariant',
})
export class StatusVariantPipe implements PipeTransform {
  readonly variants: Record<string, StatusLabelVariant> = {
    'active': 'success',
    'pending': 'warning',
    'expired': 'danger',
    'finished': 'danger',
    'draft': 'info',
  }

  transform(status?: string | null): StatusLabelVariant {
    return this.variants[status?.toLowerCase() ?? 'draft'] ?? 'info';
  }
}
