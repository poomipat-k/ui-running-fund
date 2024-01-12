import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CaptchaPuzzle } from '../shared/models/captcha-puzzle';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private baseApiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  generateCaptcha(): Observable<CaptchaPuzzle> {
    return this.http
      .post<CaptchaPuzzle>(`${this.baseApiUrl}/captcha/generate`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('[Captcha Service]: please try again later.')
    );
  }
}
