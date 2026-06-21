import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

function handleNavigationError(error: Error): void {
  console.error('[Router] Navigation failed:', error);
}

const keycloakConfig: AuthConfig = {
  issuer: environment.keycloak.issuer,
  redirectUri: environment.keycloak.redirectUri ?? document.baseURI,
  clientId: environment.keycloak.clientId,
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withNavigationErrorHandler(handleNavigationError)),
    // withXhr keeps XHR backend (vs Fetch) — needed for upload progress events
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideOAuthClient(),
    provideAppInitializer(() => {
      const oAuthService = inject(OAuthService);
      const authService = inject(AuthService);
      
      oAuthService.configure(keycloakConfig);
      return authService.initAuth();
    }),
  ],
};
