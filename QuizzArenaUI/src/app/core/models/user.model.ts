export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

/** Raw claims from the Keycloak JWT token */
export interface KeycloakTokenClaims {
  sub: string;
  preferred_username: string;
  email: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
}
