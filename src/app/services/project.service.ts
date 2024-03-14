import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApplicantCriteria } from '../shared/models/applicant-criteria';
import { ApplicantDashboardRow } from '../shared/models/applicant-dashboard-row';
import { ApplicantDetailsItem } from '../shared/models/applicant-details-item';
import { ReviewCriteria } from '../shared/models/review-criteria';
import { ReviewPeriod } from '../shared/models/review-period';
import { ReviewerDashboardRow } from '../shared/models/reviewer-dashboard-row';
import { ReviewerProjectDetails } from '../shared/models/reviewer-project-details';
import { S3ObjectMetadata } from '../shared/models/s3-object-metadata';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseApiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  addProject(formData: FormData) {
    return this.http
      .post<any>(`${this.baseApiUrl}/project`, formData)
      .pipe(catchError(this.handleError));
  }

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

  getApplicantProjectDetails(
    projectCode: string
  ): Observable<ApplicantDetailsItem[]> {
    return this.http
      .get<ApplicantDetailsItem[]>(
        `${this.baseApiUrl}/applicant/project/details/${projectCode}`
      )
      .pipe(catchError(this.handleError));
  }

  getApplicantDashboard(): Observable<ApplicantDashboardRow[]> {
    return this.http
      .get<ApplicantDashboardRow[]>(
        `${this.baseApiUrl}/project/applicant/dashboard`
      )
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

  getApplicantCriteria(criteriaVersion = 1): Observable<ApplicantCriteria[]> {
    return this.http
      .get<ApplicantCriteria[]>(
        `${this.baseApiUrl}/applicant/criteria/${criteriaVersion}`
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

  listApplicantFiles(
    projectCode: string,
    createdBy?: number
  ): Observable<S3ObjectMetadata[]> {
    return this.http
      .post<S3ObjectMetadata[]>(`${this.baseApiUrl}/s3/objects`, {
        prefix: projectCode,
        createdBy: createdBy,
      })
      .pipe(catchError(this.handleError));
  }

  addReview(body: ReviewerProjectDetails) {
    return this.http
      .post<number>(`${this.baseApiUrl}/project/review`, body)
      .pipe(catchError(this.handleError));
  }

  addAdditionalFiles(formData: FormData) {
    return this.http
      .post<any>(`${this.baseApiUrl}/project/addition-files`, formData)
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
