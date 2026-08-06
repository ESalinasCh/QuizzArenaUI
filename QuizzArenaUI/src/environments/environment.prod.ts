// Build-time flag only. Per-deploy configuration (Keycloak, API URL) is loaded
// at runtime from /config.json — see src/app/core/config/app-config.ts.
export const environment = {
  production: true,
  apiBaseUrl: 'https://quizzarena-backend-prod.azurewebsites.net', //5245
  keycloak: {
    issuer: 'https://quiz-keycloak.agreeableocean-4dc1e010.northcentralus.azurecontainerapps.io/realms/master',
    clientId: 'quiz-arena-ui',
    redirectUri: undefined as string | undefined,
  },
};
