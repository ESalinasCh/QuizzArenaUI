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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly #authService = inject(AuthService);

  readonly features: LoginFeature[] = [
    {
      imageSrc: 'images/login/login-ia-procesos.svg',
      imageAlt: 'IA Procesos',
      title: 'IA Procesos',
      description: 'Genera preguntas personalizadas al instante',
    },
    {
      imageSrc: 'images/login/login-quizzes.svg',
      imageAlt: 'Quizzes',
      title: 'Quizzes',
      description: 'Crea y publica quizzes listos para tus clases',
    },
    {
      imageSrc: 'images/login/login-resultados.svg',
      imageAlt: 'Resultados',
      title: 'Resultados',
      description: 'Evalúa y analiza el desempeño de tus estudiantes',
    },
  ];

  signIn(): void {
    this.#authService.login();
  }
}
