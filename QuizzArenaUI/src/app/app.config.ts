import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import {
  NavigationError,
  provideRouter,
  withNavigationErrorHandler,
  withRouterConfig,
} from '@angular/router';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { APP_CONFIG, AppConfig } from './core/config/app-config';

function handleNavigationError(error: NavigationError): void {
  console.error('Navigation failed', error.error);
}

export function createAppConfig(config: AppConfig): ApplicationConfig {
  const keycloakConfig: AuthConfig = {
    issuer: config.keycloak.issuer,
    redirectUri: document.baseURI,
    clientId: config.keycloak.clientId,
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: false,
  };

  return {
    providers: [
      { provide: APP_CONFIG, useValue: config },
      { provide: JWT_OPTIONS, useValue: {} },
      JwtHelperService,
      provideBrowserGlobalErrorListeners(),
      provideRouter(
        routes,
        withNavigationErrorHandler(handleNavigationError),
        withRouterConfig({ resolveNavigationPromiseOnError: true }),
      ),
      provideHttpClient(withXhr(), withInterceptors([authInterceptor, apiErrorInterceptor])),
      provideOAuthClient(),
      provideAppInitializer(() => {
        const oAuthService = inject(OAuthService);
        const authService = inject(AuthService);

        oAuthService.configure(keycloakConfig);
        return authService.initAuth();
      }),
    ],
  };
}

