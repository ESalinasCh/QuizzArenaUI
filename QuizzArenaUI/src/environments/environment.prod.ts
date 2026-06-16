export const environment = {
  production: true,
  apiBaseUrl: 'https://n8n.bsdevbo.com/webhook',
  keycloak: {
    issuer: 'https://auth.bsdevbo.com/realms/master',
    clientId: 'quiz-arena-ui',
    redirectUri: undefined as string | undefined,
  },
};
