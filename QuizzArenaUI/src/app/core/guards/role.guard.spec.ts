import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  let mockAuthService: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    hasRole: ReturnType<typeof vi.fn>;
    getDefaultRoute: ReturnType<typeof vi.fn>;
  };
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn(),
      hasRole: vi.fn(),
      getDefaultRoute: vi.fn(),
    };
    mockRouter = { createUrlTree: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access when route has no roles restriction', () => {
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));
    expect(result).toBe(true);
  });

  it('should allow student to access /student route', () => {
    const route = { data: { roles: ['student'] } } as unknown as ActivatedRouteSnapshot;
    mockAuthService.hasRole.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));
    expect(mockAuthService.hasRole).toHaveBeenCalledWith('student');
    expect(result).toBe(true);
  });

  it('should allow teacher to access /teacher route', () => {
    const route = { data: { roles: ['teacher'] } } as unknown as ActivatedRouteSnapshot;
    mockAuthService.hasRole.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));
    expect(mockAuthService.hasRole).toHaveBeenCalledWith('teacher');
    expect(result).toBe(true);
  });

  it('should redirect teacher to /teacher/dashboard when accessing student route', () => {
    const route = { data: { roles: ['student'] } } as unknown as ActivatedRouteSnapshot;
    mockAuthService.hasRole.mockReturnValue(false);
    mockAuthService.getDefaultRoute.mockReturnValue('/teacher/dashboard');
    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));
    expect(mockAuthService.hasRole).toHaveBeenCalledWith('student');
    expect(mockAuthService.getDefaultRoute).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/teacher/dashboard']);
    expect(result).toEqual(TestBed.inject(Router).createUrlTree(['/teacher/dashboard']));
  });

  it('should redirect student to /student/quizzes when accessing teacher route', () => {
    const route = { data: { roles: ['teacher'] } } as unknown as ActivatedRouteSnapshot;
    mockAuthService.hasRole.mockReturnValue(false);
    mockAuthService.getDefaultRoute.mockReturnValue('/student/quizzes');
    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));
    expect(mockAuthService.hasRole).toHaveBeenCalledWith('teacher');
    expect(mockAuthService.getDefaultRoute).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/student/quizzes']);
    expect(result).toEqual(TestBed.inject(Router).createUrlTree(['/student/quizzes']));
  });

  it('should redirect user with no roles to /login when accessing any role-protected route', () => {
    const route = { data: { roles: ['teacher'] } } as unknown as ActivatedRouteSnapshot;
    mockAuthService.hasRole.mockReturnValue(false);
    mockAuthService.getDefaultRoute.mockReturnValue('/login');
    const result = TestBed.runInInjectionContext(() => roleGuard(route, mockState));
    expect(mockAuthService.getDefaultRoute).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(TestBed.inject(Router).createUrlTree(['/login']));
  });
});
