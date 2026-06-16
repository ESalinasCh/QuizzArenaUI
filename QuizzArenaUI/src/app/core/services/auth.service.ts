import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthState } from '../models/auth-state.model';
import { KeycloakAccessTokenClaims, KeycloakTokenClaims, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #oAuthService = inject(OAuthService);
  readonly #router = inject(Router);

  readonly #authState = signal<AuthState>({ isAuthenticated: false });

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
      roles: accessTokenClaims?.roles ?? [],
    };

    this.#authState.set({ isAuthenticated: true, user });
  }

  #decodeAccessToken(): KeycloakAccessTokenClaims | null {
    const token = this.#oAuthService.getAccessToken();
    const payload = token.split('.').at(1);

    if (!payload) {
      return null;
    }

    try {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(
        normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
        '=',
      );
      const decodedPayload = atob(paddedPayload);

      return JSON.parse(decodedPayload) as KeycloakAccessTokenClaims;
    } catch {
      return null;
    }
  }
}
