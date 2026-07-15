import { Component, computed, input } from '@angular/core';
import { Badge, BadgeVariant } from '../../atoms/badge/badge';

export type ContentStatus = 'processed' | 'in-progress'; // re-exported for convenience

@Component({
  selector: 'app-content-item',
  imports: [Badge],
  templateUrl: './content-item.html',
})
export class ContentItem {
  title = input.required<string>();
  status = input.required<ContentStatus>();
  info = input.required<string>();

  statusLabel = computed(() =>
    this.status() === 'processed' ? 'Procesado' : 'En proceso',
  );

  statusVariant = computed((): BadgeVariant =>
    this.status() === 'processed' ? 'success' : 'warning',
  );
}
