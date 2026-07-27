import { Pipe, PipeTransform } from '@angular/core';
import { StatusLabelVariant } from '../atoms/status-label/status-label';

@Pipe({
  name: 'statusVariant',
})
export class StatusVariantPipe implements PipeTransform {
  transform(status: string | null | undefined): StatusLabelVariant {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
      case 'finished':
        return 'danger';
      default:
        return 'info';
    }
  }
}
