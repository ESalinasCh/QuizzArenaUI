export const environment = {
  production: true,
  keycloak: {
    issuer: 'https://auth.bsdevbo.com/realms/master',
    clientId: 'quiz-arena-ui',
    redirectUri: undefined as string | undefined,
  },
};
