import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();
  //console.log('AuthGuard triggered. Token 1:', token);

  if (token && !auth.isTokenExpired(token)) {
    //console.log('AuthGuard triggered. Token 2:', token);

    return true;
  }
  auth.logout();
  return router.createUrlTree(['/login-student']);
};
