import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
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
      .get<User>(`${this.baseApiUrl}/user/current`)
      .pipe(catchError(this.handleError));
  }

  public getCurrentInMemoryUser(): User {
    return this.loggedInUser;
  }

  public login(
    email: string,
    password: string
  ): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${this.baseApiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  public setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.loggedInUser = user;
  }

  public logout(): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${this.baseApiUrl}/auth/logout`, {})
      .pipe(
        tap((result) => {
          if (result.success) {
            this.loggedInUser = new User();
            this.currentUserSubject.next(this.loggedInUser);
          }
        }),
        catchError(this.handleError)
      );
  }
  // End refactor

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
