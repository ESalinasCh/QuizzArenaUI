import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthState } from '../models/auth-state.model';
import { KeycloakAccessTokenClaims, KeycloakTokenClaims, User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #oAuthService = inject(OAuthService);
  readonly #router = inject(Router);

  readonly #authState = signal<AuthState>({ isAuthenticated: false });
  readonly #jwtHelper = inject(JwtHelperService);
  #refreshTokenPromise: Promise<string | null> | undefined;
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
          this.#oAuthService.setupAutomaticSilentRefresh();
        }
        return true;
      })
      .catch(() => true);
  }

  login(): void {
    this.#oAuthService.customQueryParams = {
      theme : localStorage.getItem('theme') ?? 'dark'
    };
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

  async getValidAccessToken(): Promise<string | null> {
    if (this.#oAuthService.hasValidAccessToken()) {
      return this.#getAccessToken();
    }

    if (!this.#oAuthService.getRefreshToken()) {
      return null;
    }

    return this.#refreshAccessToken();
  }

  #refreshAccessToken(): Promise<string | null> {
    this.#refreshTokenPromise ??= this.#oAuthService
      .refreshToken()
      .then(() => {
        this.#setUserFromToken();
        return this.#getAccessToken();
      })
      .catch(() => {
        this.#authState.set({ isAuthenticated: false });
        this.#router.navigate(['/login']);
        return null;
      })
      .finally(() => {
        this.#refreshTokenPromise = undefined;
      });

    return this.#refreshTokenPromise;
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
    const token = this.#getAccessToken();

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

  #getAccessToken(): string | null {
    return this.#oAuthService.getAccessToken() || null;
  }
}
