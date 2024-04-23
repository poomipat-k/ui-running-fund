import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, of, tap, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';

export const adminAuthGuard = (_next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const loggedInUser = userService.getCurrentInMemoryUser();
  if (loggedInUser?.id) {
    if (loggedInUser?.userRole === 'admin') {
      return of(true);
    }
    return of(false);
  }
  return userService.getCurrentUser().pipe(
    tap((user) => {
      if (user.id) {
        userService.setUser(user);
        if (user.userRole === 'admin') {
          return true;
        }
      }
      // role doesn't match
      return router.navigate(['/login']);
    }),
    catchError((err) => {
      router.navigate(['/login']);
      return throwError(() => err);
    })
  );
};
