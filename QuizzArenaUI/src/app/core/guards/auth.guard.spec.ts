import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockAuthService: { isAuthenticated: ReturnType<typeof vi.fn> };
  const mockState = {} as RouterStateSnapshot;
  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    mockAuthService = { isAuthenticated: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('should redirect to /login when user is not authenticated (no Keycloak token)', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState)) as UrlTree;
    const destinationPath = result.root.children['primary'].segments[0].path;
    expect(destinationPath).toBe('login');
  });

  it('should allow access when user is authenticated (valid Keycloak token)', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    expect(result).toBe(true);
  });
});
