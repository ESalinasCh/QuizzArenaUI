// Build-time flag only. Per-deploy configuration (Keycloak, API URL) is loaded
// at runtime from /config.json — see src/app/core/config/app-config.ts.
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  keycloak: {
    issuer: 'https://auth.bsdevbo.com/realms/master',
    clientId: 'quiz-arena-ui',
    redirectUri: 'http://localhost:3000/en/',
  },
};
