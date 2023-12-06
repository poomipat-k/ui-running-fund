import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredentialReq = req.clone({ withCredentials: true });
  return next(withCredentialReq);
};
