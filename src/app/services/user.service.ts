import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { CommonSuccessResponse } from '../shared/models/common-success-response';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly currentUserSubject = new BehaviorSubject<User>(new User());
  currentUserSubject$ = this.currentUserSubject.asObservable();

  private loggedInUser: User;
  private baseApiUrl = environment.apiUrl;

  private readonly http: HttpClient = inject(HttpClient);
  constructor() {}

  public getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.baseApiUrl}/auth/current`)
      .pipe(catchError(this.handleError));
  }

  public getUserFullName(userId: number): Observable<any> {
    return this.http
      .get<User>(`${this.baseApiUrl}/user/full-name/${userId}`)
      .pipe(catchError(this.handleError));
  }

  public getCurrentInMemoryUser(): User {
    return this.loggedInUser;
  }

  public login(
    email: string,
    password: string
  ): Observable<CommonSuccessResponse> {
    return this.http
      .post<CommonSuccessResponse>(`${this.baseApiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  public register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    termsAndConditions: boolean,
    privacy: boolean
  ) {
    return this.http
      .post<number>(`${this.baseApiUrl}/auth/register`, {
        email,
        firstName,
        lastName,
        password,
        termsAndConditions,
        privacy,
      })
      .pipe(catchError(this.handleError));
  }

  public sendForgotPasswordEmail(
    email: string,
    captchaId: string,
    captchaValue: number
  ) {
    return this.http
      .post<number>(`${this.baseApiUrl}/user/password/forgot`, {
        email,
        captchaId,
        captchaValue,
      })
      .pipe(catchError(this.handleError));
  }

  public resetPassword(
    password: string,
    confirmPassword: string,
    resetPasswordCode: string
  ) {
    return this.http
      .post<number>(`${this.baseApiUrl}/user/password/reset`, {
        password,
        confirmPassword,
        resetPasswordCode,
      })
      .pipe(catchError(this.handleError));
  }

  public activateUser(activateCode: string) {
    return this.http
      .post<number>(`${this.baseApiUrl}/user/activate-email`, {
        activateCode,
      })
      .pipe(catchError(this.handleError));
  }

  public setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.loggedInUser = user;
    this.setLocalStorageUser(user);
  }

  public logout(): Observable<CommonSuccessResponse> {
    return this.http
      .post<CommonSuccessResponse>(`${this.baseApiUrl}/auth/logout`, {})
      .pipe(
        tap((result) => {
          if (result.success) {
            this.removeLocalStorageUser();
            this.loggedInUser = new User();
            this.currentUserSubject.next(this.loggedInUser);
          }
        }),
        catchError(this.handleError)
      );
  }

  private setLocalStorageUser(user: User): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  private removeLocalStorageUser(): void {
    localStorage.removeItem('loggedInUser');
  }

  public refreshAccessToken(): Observable<CommonSuccessResponse> {
    return this.http
      .post<CommonSuccessResponse>(`${this.baseApiUrl}/auth/refresh-token`, {})
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
    return throwError(() => error);
  }
}
