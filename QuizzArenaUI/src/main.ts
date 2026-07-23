import { bootstrapApplication } from '@angular/platform-browser';
import { createAppConfig } from './app/app.config';
import { AppConfig } from './app/core/config/app-config';
import { App } from './app/app';
import { setRuntimeConfig } from './app/core/utils/api-url.util';

// Load runtime configuration before bootstrapping so a single built artifact
// can run in any environment (12-Factor: Config). The container renders
// /config.json from environment variables at startup.
fetch('config.json', { cache: 'no-cache' })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load config.json: HTTP ${response.status}`);
    }
    return response.json() as Promise<AppConfig>;
  })
  .then((config) => {
    setRuntimeConfig(config);
    return bootstrapApplication(App, createAppConfig(config));
  })
  .catch((err) => console.error('Application bootstrap failed:', err));
