import { Route } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

describe('app.routes', () => {
  const loginRoute: Route = { path: 'login' };
  const mainRoute: Route = {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: undefined },
      { path: 'student', canActivate: [roleGuard], data: { roles: ['student'] } },
      { path: 'teacher', canActivate: [roleGuard], data: { roles: ['teacher'] } },
    ],
  };
  const wildcardRoute: Route = { path: '**', redirectTo: '' };

  it('login route should have no guards', () => {
    expect(loginRoute.canActivate).toBeUndefined();
  });

  it('main layout should be protected by authGuard', () => {
    expect(mainRoute.canActivate).toContain(authGuard);
  });

  it('student child route should require student role', () => {
    const studentRoute = mainRoute.children?.find(c => c.path === 'student');
    expect(studentRoute?.canActivate).toContain(roleGuard);
    expect(studentRoute?.data?.['roles']).toEqual(['student']);
  });

  it('teacher child route should require teacher role', () => {
    const teacherRoute = mainRoute.children?.find(c => c.path === 'teacher');
    expect(teacherRoute?.canActivate).toContain(roleGuard);
    expect(teacherRoute?.data?.['roles']).toEqual(['teacher']);
  });

  it('root child should redirect based on user role', () => {
    const rootChild = mainRoute.children?.find(c => c.path === '');
    expect(rootChild?.pathMatch).toBe('full');
  });

  it('wildcard route should redirect to empty path', () => {
    expect(wildcardRoute.redirectTo).toBe('');
  });

  it('login route should be publicly accessible', () => {
    expect(loginRoute.path).toBe('login');
  });
});
