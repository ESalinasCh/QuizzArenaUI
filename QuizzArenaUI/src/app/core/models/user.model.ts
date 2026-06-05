export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  roles: string[];
}

export interface KeycloakTokenClaims {
  sub: string;
  preferred_username: string;
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}

/** Raw claims from the Keycloak access token */
export interface KeycloakAccessTokenClaims extends KeycloakTokenClaims {
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
}
