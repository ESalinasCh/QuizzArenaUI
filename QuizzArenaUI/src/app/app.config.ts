import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthConfig, provideOAuthClient } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { APP_CONFIG, AppConfig } from './core/config/app-config';

function initializeAuth(oAuthService: OAuthService, authService: AuthService, config: AppConfig): () => Promise<boolean> {
  return () => {
    const keycloakConfig: AuthConfig = {
      issuer: config.keycloak.issuer,
      redirectUri: `${window.location.origin}/`,
      clientId: config.keycloak.clientId,
      responseType: 'code',
      scope: 'openid profile email',
      showDebugInformation: !config.production,
    };
    oAuthService.configure(keycloakConfig);
    return authService.initAuth();
  };
}

/**
 * Builds the application config from runtime configuration loaded in `main.ts`.
 * The config is provided via {@link APP_CONFIG} so it is injectable app-wide.
 */
export function createAppConfig(config: AppConfig): ApplicationConfig {
  return {
    providers: [
      { provide: APP_CONFIG, useValue: config },
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])),
      provideOAuthClient(),
      {
        provide: APP_INITIALIZER,
        useFactory: initializeAuth,
        deps: [OAuthService, AuthService, APP_CONFIG],
        multi: true,
      },
    ],
  };
}
