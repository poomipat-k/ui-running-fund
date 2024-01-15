import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ReviewCriteria } from '../shared/models/review-criteria';
import { ReviewPeriod } from '../shared/models/review-period';
import { ReviewerDashboardRow } from '../shared/models/reviewer-dashboard-row';
import { ReviewerProjectDetails } from '../shared/models/reviewer-project-details';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseApiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  getReviewPeriod(): Observable<ReviewPeriod> {
    return this.http
      .get<ReviewPeriod>(`${this.baseApiUrl}/project/review-period`)
      .pipe(catchError(this.handleError));
  }

  getReviewDashboard(
    fromDate: string,
    toDate: string
  ): Observable<ReviewerDashboardRow[]> {
    return this.http
      .post<ReviewerDashboardRow[]>(`${this.baseApiUrl}/project/reviewer`, {
        fromDate,
        toDate,
      })
      .pipe(catchError(this.handleError));
  }

  getProjectDetailsForReviewer(
    projectCode: string
  ): Observable<ReviewerProjectDetails> {
    return this.http
      .get<ReviewerProjectDetails>(
        `${this.baseApiUrl}/project/review/${projectCode}`
      )
      .pipe(catchError(this.handleError));
  }

  getReviewCriteria(criteriaVersion = 1): Observable<ReviewCriteria[]> {
    return this.http
      .get<ReviewCriteria[]>(
        `${this.baseApiUrl}/review/criteria/${criteriaVersion}`
      )
      .pipe(catchError(this.handleError));
  }

  addReview(body: ReviewerProjectDetails) {
    return this.http
      .post<number>(`${this.baseApiUrl}/project/review`, body)
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
      () => new Error('[Project Service]: please try again later.')
    );
  }
}
