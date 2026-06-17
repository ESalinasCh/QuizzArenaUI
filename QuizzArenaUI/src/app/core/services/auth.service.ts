import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthState } from '../models/auth-state.model';
import { KeycloakAccessTokenClaims, KeycloakTokenClaims, User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

const BASE64_BLOCK_SIZE = 4;

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #oAuthService = inject(OAuthService);
  readonly #router = inject(Router);

  readonly #authState = signal<AuthState>({ isAuthenticated: false });
  readonly #jwtHelper = inject(JwtHelperService);
  readonly currentUser: Signal<User | undefined> = computed(() => {
    const state = this.#authState();
    return state.isAuthenticated ? state.user : undefined;
  });
  readonly isAuthenticated: Signal<boolean> = computed(() => this.#authState().isAuthenticated);

  initAuth(): Promise<boolean> {
    return this.#oAuthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.#oAuthService.hasValidAccessToken()) {
          this.#setUserFromToken();
        }
        return true;
      })
      .catch(() => true);
  }

  login(): void {
    this.#oAuthService.customQueryParams = {};
    this.#oAuthService.initCodeFlow();
  }

  logout(): void {
    this.#oAuthService.logOut();
    this.#authState.set({ isAuthenticated: false });
    this.#router.navigate(['/login']);
  }

  getDefaultRoute(): string {
    if (this.hasRole('student')) {
      return '/student/quizzes';
    }

    if (this.hasRole('teacher')) {
      return '/teacher/dashboard';
    }

    return '/login';
  }

  hasRole(role: string): boolean {
    const state = this.#authState();
    return state.isAuthenticated ? state.user.roles.includes(role) : false;
  }

  #setUserFromToken(): void {
    const claims = this.#oAuthService.getIdentityClaims() as KeycloakTokenClaims | null;
    const accessTokenClaims = this.#decodeAccessToken();

    if (!claims) return;

    const user: User = {
      id: claims.sub,
      username: claims.preferred_username,
      email: claims.email,
      name: claims.name,
      roles: this.#getRolesFromAccessToken(accessTokenClaims),
    };

    this.#authState.set({ isAuthenticated: true, user });
  }

  #getRolesFromAccessToken(claims: KeycloakAccessTokenClaims | null): string[] {
    if (!claims) return [];
    if (claims.roles?.length) return claims.roles;
    if (claims.realm_access?.roles?.length) return claims.realm_access.roles;
    const clientRoles = Object.values(claims.resource_access ?? {}).flatMap(c => c.roles);
    return clientRoles;
  }

  #decodeAccessToken(): KeycloakAccessTokenClaims | null {
    const token = this.#oAuthService.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      return this.#jwtHelper.decodeToken<KeycloakAccessTokenClaims>(
        token,
      );
    } catch {
      return null;
    }
  }
}
