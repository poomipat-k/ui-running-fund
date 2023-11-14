import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserService } from '../../services/user.service';

export const authGuard = (_next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const service = inject(UserService);
  return service.isLoggedIn().pipe(
    tap((isLoggedIn) => {
      !isLoggedIn ? router.navigate(['/login']) : true;
    })
  );
};
