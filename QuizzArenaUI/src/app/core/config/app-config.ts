import { InjectionToken } from '@angular/core';

/**
 * Runtime application configuration.
 *
 * These values are NOT compiled into the bundle. They are loaded from
 * `/config.json` before the app bootstraps (see `main.ts`), which lets a
 * single built artifact run in any environment (12-Factor: Config).
 */
export interface AppConfig {
  production: boolean;
  keycloak: {
    issuer: string;
    clientId: string;
  };
  apiBaseUrl: string;
}

/** Injection token used to access the runtime configuration anywhere in the app. */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
