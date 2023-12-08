import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, of, tap, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';

export const reviewerAuthGuard = (_next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const loggedInUser = userService.getCurrentInMemoryUser();
  console.log('===loggedInUser', loggedInUser);
  if (loggedInUser?.id) {
    if (loggedInUser?.userRole === 'reviewer') {
      return of(true);
    }
    return of(false);
  }
  return userService.getCurrentUser().pipe(
    tap((user) => {
      console.log('==tap user', user);
      if (user.id) {
        userService.setUser(user);
        if (user.userRole === 'reviewer') {
          return true;
        }
      }
      return router.navigate(['/login']);
    }),
    catchError((err) => {
      console.warn('[catchError] will redirect to login page in 1 seconds...');
      setTimeout(() => {
        router.navigate(['/login']);
      }, 1000);
      return throwError(() => err);
    })
  );
};
