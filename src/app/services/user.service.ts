import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  public getReviewers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseApiUrl}/user/reviewers`)
      .pipe(catchError(this.handleError));
  }

  public getReviewerById(userId: number): Observable<User> {
    return this.http
      .get<User>(`${this.baseApiUrl}/user/reviewer`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      })
      .pipe(catchError(this.handleError));
  }

  public getUserTokenIdFromStorage(): number {
    let userId = localStorage.getItem('token');
    if (!userId) {
      return 0;
    }
    userId = JSON.parse(userId);
    if (!userId) {
      return 0;
    }
    const numId = +userId;
    return numId || 0;
  }

  public getCurrentUser(): User {
    return this.loggedInUser;
  }

  public login(email: string, password: string) {
    return this.http
      .post<User>(`${this.baseApiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  // TODO: refactor later
  public login2(user: User): void {
    if (user) {
      this.loggedInUser = user;
      localStorage.setItem('token', String(user.id));
      this.currentUserSubject.next(user);
    }
  }

  public logout(): void {
    this.loggedInUser = new User();
    localStorage.removeItem('token');
    this.currentUserSubject.next(this.loggedInUser);
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
    return throwError(
      () => new Error('[User Service]: please try again later.')
    );
  }
}
