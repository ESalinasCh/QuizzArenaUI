import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthState } from '../models/auth-state.model';
import { KeycloakTokenClaims, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #oAuthService = inject(OAuthService);
  readonly #router = inject(Router);

  readonly #authState = signal<AuthState>({ user: null, isAuthenticated: false });

  readonly currentUser: Signal<User | null> = computed(() => this.#authState().user);
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
    this.#oAuthService.initCodeFlow();
  }

  register(): void {
    const params = new URLSearchParams({
      client_id: this.#oAuthService.clientId ?? '',
      response_type: 'code',
      scope: this.#oAuthService.scope ?? 'openid profile email',
      redirect_uri: this.#oAuthService.redirectUri ?? `${window.location.origin}/`,
    });
    window.location.href = `${this.#oAuthService.issuer}/protocol/openid-connect/registrations?${params}`;
  }

  logout(): void {
    this.#oAuthService.logOut();
    this.#authState.set({ user: null, isAuthenticated: false });
    this.#router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.#authState().user?.roles.includes(role) ?? false;
  }

  #setUserFromToken(): void {
    const claims = this.#oAuthService.getIdentityClaims() as KeycloakTokenClaims | null;

    if (!claims) return;

    const user: User = {
      id: claims.sub,
      username: claims.preferred_username,
      email: claims.email,
      roles: claims.realm_access?.roles ?? [],
    };

    this.#authState.set({ user, isAuthenticated: true });
  }
}
