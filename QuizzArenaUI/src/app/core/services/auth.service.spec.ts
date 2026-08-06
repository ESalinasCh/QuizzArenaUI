import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

function createMockToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'RS256' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let mockOAuthService: Partial<OAuthService>;
  let mockRouter: Partial<Router>;
  let mockJwtHelper: Partial<JwtHelperService>;

  beforeEach(() => {
    mockOAuthService = {
      loadDiscoveryDocumentAndTryLogin: vi.fn(),
      hasValidAccessToken: vi.fn(),
      getIdentityClaims: vi.fn(),
      getAccessToken: vi.fn(),
      getRefreshToken: vi.fn(),
      refreshToken: vi.fn(),
      setupAutomaticSilentRefresh: vi.fn(),
      initCodeFlow: vi.fn(),
      logOut: vi.fn(),
      configure: vi.fn(),
    };
    mockRouter = { navigate: vi.fn() };
    mockJwtHelper = {
      decodeToken: vi.fn().mockImplementation((token: string) => {
        if (!token) return null;
        try {
          const base64Body = token.split('.')[1];
          return JSON.parse(atob(base64Body));
        } catch {
          return null;
        }
      })
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: OAuthService, useValue: mockOAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: JwtHelperService, useValue: mockJwtHelper },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  describe('initial state', () => {
    it('should start as not authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should have no current user initially', () => {
      expect(service.currentUser()).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should call Keycloak authorization code flow', () => {
      service.login();

      expect(mockOAuthService.initCodeFlow).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call Keycloak logout and reset state', () => {
      service.logout();

      expect(mockOAuthService.logOut).toHaveBeenCalled();
      expect(service.isAuthenticated()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('hasRole', () => {
    it('should return false when not authenticated', () => {
      expect(service.hasRole('student')).toBe(false);
    });

    it('should return true when user has the role', async () => {
      const mockToken = createMockToken({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
        roles: ['student'],
      });
      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);
      await service.initAuth();
      expect(service.hasRole('student')).toBe(true);
    });

    it('should return false when user does not have the role', async () => {
      const mockToken = createMockToken({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
        roles: ['teacher'],
      });

      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);

      await service.initAuth();

      expect(service.hasRole('student')).toBe(false);
      expect(service.hasRole('teacher')).toBe(true);
    });
  });

  describe('getDefaultRoute', () => {
    it('should return /student/quizzes for student role', async () => {
      const mockToken = createMockToken({
        sub: 'user-1',
        preferred_username: 'student1',
        email: 'student@test.com',
        name: 'Student',
        roles: ['student'],
      });

      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-1',
        preferred_username: 'student1',
        email: 'student@test.com',
        name: 'Student',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);

      await service.initAuth();

      expect(service.getDefaultRoute()).toBe('/student/quizzes');
    });

    it('should return /teacher/dashboard for teacher role', async () => {
      const mockToken = createMockToken({
        sub: 'user-2',
        preferred_username: 'teacher1',
        email: 'teacher@test.com',
        name: 'Teacher',
        roles: ['teacher'],
      });

      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-2',
        preferred_username: 'teacher1',
        email: 'teacher@test.com',
        name: 'Teacher',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);

      await service.initAuth();

      expect(service.getDefaultRoute()).toBe('/teacher/dashboard');
    });

    it('should return /login when user has no recognized role', () => {
      expect(service.getDefaultRoute()).toBe('/login');
    });
  });

  describe('initAuth', () => {
    it('should set user when valid token exists', async () => {
      const mockToken = createMockToken({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
        roles: ['student'],
      });

      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);

      await service.initAuth();

      expect(service.isAuthenticated()).toBe(true);
      expect(mockOAuthService.setupAutomaticSilentRefresh).toHaveBeenCalled();
      expect(service.currentUser()).toEqual({
        id: 'user-1',
        username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
        roles: ['student'],
      });
    });

    it('should remain unauthenticated when no valid token', async () => {
      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(false);

      await service.initAuth();

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should still resolve when Keycloak discovery fails', async () => {
      (mockOAuthService.loadDiscoveryDocumentAndTryLogin as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const result = await service.initAuth();

      expect(result).toBe(true);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getValidAccessToken', () => {
    it('should return the current access token when it is still valid', async () => {
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue('access-token');

      const token = await service.getValidAccessToken();

      expect(token).toBe('access-token');
      expect(mockOAuthService.refreshToken).not.toHaveBeenCalled();
    });

    it('should refresh and return a new access token when the current token is expired', async () => {
      const refreshedToken = createMockToken({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
        roles: ['student'],
      });

      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (mockOAuthService.getRefreshToken as ReturnType<typeof vi.fn>).mockReturnValue('refresh-token');
      (mockOAuthService.refreshToken as ReturnType<typeof vi.fn>).mockResolvedValue({});
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(refreshedToken);

      const token = await service.getValidAccessToken();

      expect(mockOAuthService.refreshToken).toHaveBeenCalled();
      expect(token).toBe(refreshedToken);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return null when there is no refresh token', async () => {
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (mockOAuthService.getRefreshToken as ReturnType<typeof vi.fn>).mockReturnValue('');

      const token = await service.getValidAccessToken();

      expect(token).toBeNull();
      expect(mockOAuthService.refreshToken).not.toHaveBeenCalled();
    });

    it('should return null and reset auth state when token refresh fails', async () => {
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (mockOAuthService.getRefreshToken as ReturnType<typeof vi.fn>).mockReturnValue('refresh-token');
      (mockOAuthService.refreshToken as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Refresh failed'));

      const token = await service.getValidAccessToken();

      expect(token).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should reuse the same refresh promise for concurrent refresh requests', async () => {
      (mockOAuthService.hasValidAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (mockOAuthService.getRefreshToken as ReturnType<typeof vi.fn>).mockReturnValue('refresh-token');
      (mockOAuthService.refreshToken as ReturnType<typeof vi.fn>).mockResolvedValue({});
      (mockOAuthService.getIdentityClaims as ReturnType<typeof vi.fn>).mockReturnValue({
        sub: 'user-1',
        preferred_username: 'johndoe',
        email: 'john@test.com',
        name: 'John Doe',
      });
      (mockOAuthService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue('new-token');

      const [firstToken, secondToken] = await Promise.all([
        service.getValidAccessToken(),
        service.getValidAccessToken(),
      ]);

      expect(mockOAuthService.refreshToken).toHaveBeenCalledTimes(1);
      expect(firstToken).toBe('new-token');
      expect(secondToken).toBe('new-token');
    });
  });
});
