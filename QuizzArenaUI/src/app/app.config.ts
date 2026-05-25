import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthConfig, provideOAuthClient } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';

const keycloakConfig: AuthConfig = {
  issuer: 'https://auth.bsdevbo.com/realms/master',
  redirectUri: window.location.origin,
  clientId: 'quiz-arena-ui',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: false,
};

function initializeAuth(oAuthService: OAuthService, authService: AuthService): () => Promise<boolean> {
  return () => {
    oAuthService.configure(keycloakConfig);
    return authService.initAuth();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [OAuthService, AuthService],
      multi: true,
    },
  ],
};
