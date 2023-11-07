import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ReviewPeriod } from '../models/review-period';
import { ReviewerDashboardRow } from '../models/reviewer-dashboard-row';
import { ReviewerProjectDetails } from '../models/reviewer-project-details';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  getReviewPeriod(): Observable<ReviewPeriod> {
    return this.http
      .get<ReviewPeriod>(`${this.baseUrl}/projects/review-period`)
      .pipe(catchError(this.handleError));
  }

  getReviewDashboard(
    userId: number,
    fromDate: string,
    toDate: string
  ): Observable<ReviewerDashboardRow[]> {
    return this.http
      .post<ReviewerDashboardRow[]>(
        `${this.baseUrl}/projects/reviewer`,
        {
          fromDate,
          toDate,
        },
        {
          headers: {
            Authorization: `Bearer ${userId}`,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  getProjectDetailsForReviewer(
    userId: number,
    projectCode: string
  ): Observable<ReviewerProjectDetails> {
    return this.http
      .get<ReviewerProjectDetails>(
        `${this.baseUrl}/review/project/${projectCode}`,
        {
          headers: {
            Authorization: `Bearer ${userId}`,
          },
        }
      )
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
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
