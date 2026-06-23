import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

function createMockToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'RS256' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let mockOAuthService: Partial<OAuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockOAuthService = {
      loadDiscoveryDocumentAndTryLogin: vi.fn(),
      hasValidAccessToken: vi.fn(),
      getIdentityClaims: vi.fn(),
      getAccessToken: vi.fn(),
      initCodeFlow: vi.fn(),
      logOut: vi.fn(),
      configure: vi.fn(),
    };
    mockRouter = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: OAuthService, useValue: mockOAuthService },
        { provide: Router, useValue: mockRouter },
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
});
