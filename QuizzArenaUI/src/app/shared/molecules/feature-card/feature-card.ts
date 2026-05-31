import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type FeatureCardVariant = 'row' | 'card';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCard {
  imageSrc = input.required<string>();
  imageAlt = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  variant = input<FeatureCardVariant>('card');
}
