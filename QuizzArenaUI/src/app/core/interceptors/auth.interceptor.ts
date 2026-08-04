import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isTokenRequest(req.url)) {
    return next(req);
  }

  return from(authService.getValidAccessToken()).pipe(
    switchMap(token => {
      if (!token) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next(authReq);
    }),
  );
};

function isTokenRequest(url: string): boolean {
  return url.includes('/protocol/openid-connect/token');
}
