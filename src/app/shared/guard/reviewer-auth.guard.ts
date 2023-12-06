import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { UserService } from '../../services/user.service';

export const reviewerAuthGuard = (_next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const loggedIn = !!userService.getCurrentUser()?.id;
  if (loggedIn) {
    return of(true);
  }
  const userId = userService.getUserTokenIdFromStorage();
  if (userId == 0) {
    return router.navigate(['/login']);
  }
  return userService.getReviewerById(userId).pipe(
    tap((user) => {
      if (user.id) {
        userService.login2(user);
      }
      return !user.id ? router.navigate(['/login']) : true;
    })
  );
};
