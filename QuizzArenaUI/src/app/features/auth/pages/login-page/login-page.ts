import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { FeatureCard } from '../../../../shared/molecules/feature-card/feature-card';
import { AuthService } from '../../../../core/services/auth.service';

export interface LoginFeature {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Button, Icon, FeatureCard],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly #authService = inject(AuthService);

  readonly features: LoginFeature[] = [
    {
      imageSrc: 'images/login/login-ia-procesos.svg',
      imageAlt: $localize`:Feature card image alt|AI Processes:AI Processes`,
      title: $localize`:Feature card title|AI Processes:AI Processes`,
      description: $localize`:Feature card description|AI Processes:Generate personalized questions instantly`,
    },
    {
      imageSrc: 'images/login/login-quizzes.svg',
      imageAlt: $localize`:Feature card image alt|Quizzes:Quizzes`,
      title: $localize`:Feature card title|Quizzes:Quizzes`,
      description: $localize`:Feature card description|Quizzes:Create and publish quizzes ready for your classes`,
    },
    {
      imageSrc: 'images/login/login-resultados.svg',
      imageAlt: $localize`:Feature card image alt|Results:Results`,
      title: $localize`:Feature card title|Results:Results`,
      description: $localize`:Feature card description|Results:Evaluate and analyze your students' performance`,
    },
  ];

  signIn(): void {
    this.#authService.login();
  }
}
