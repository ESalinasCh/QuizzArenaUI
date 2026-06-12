export const environment = {
  production: false,
  apiBaseUrl: 'https://n8n.bsdevbo.com/webhook',
  keycloak: {
    issuer: 'https://auth.bsdevbo.com/realms/master',
    clientId: 'quiz-arena-ui',
    redirectUri: 'http://localhost:3000/en/',
  },
};
