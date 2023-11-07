import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly currentUserSubject = new BehaviorSubject<User>(new User());
  currentUserSubject$ = this.currentUserSubject.asObservable();

  private loggedInUser: User;
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  public getReviewers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/reviewers`)
      .pipe(catchError(this.handleError));
  }

  public getReviewerById(userId: string): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/reviewer`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      })
      .pipe(catchError(this.handleError));
  }

  public isLoggedIn(): Observable<boolean> {
    let userId = localStorage.getItem('token');
    if (!userId) {
      return of(false);
    }
    userId = JSON.parse(userId);
    if (!userId) {
      return of(false);
    }
    return of(true);
  }

  public getCurrentUser(): User {
    return this.loggedInUser;
  }

  // TODO: refactor later
  public login(user: User): void {
    if (user) {
      this.loggedInUser = user;
      localStorage.setItem('token', String(user.id));
      this.currentUserSubject.next(user);
    }
  }

  public autoLogin(): void {
    let userId = localStorage.getItem('token');
    if (userId) {
      this.getReviewerById(userId).subscribe((user) => {
        if (user) {
          this.login(user);
        }
      });
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
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
