import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles?.length) {
    return true;
  }

  if (requiredRoles.some((role) => authService.hasRole(role))) {
    return true;
  }

  return router.createUrlTree([authService.getDefaultRoute()]);
};
