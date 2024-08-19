import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AdminDashboardFilter } from '../shared/models/admin-dashboard-filter';

import { AdminDashboardDateConfigPreviewRow } from '../shared/models/admin-dashboard-date-config-preview-row';
import { AdminDashboardRow } from '../shared/models/admin-request-dashboard-row';
import { AdminSummaryByStatus } from '../shared/models/admin-summary-by-status';
import { ApplicantCriteria } from '../shared/models/applicant-criteria';
import { ApplicantDashboardRow } from '../shared/models/applicant-dashboard-row';
import { ApplicantDetailsItem } from '../shared/models/applicant-details-item';
import { CommonSuccessResponse } from '../shared/models/common-success-response';
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
      .post<number>(`${this.baseApiUrl}/project`, formData)
      .pipe(catchError(this.handleError));
  }

  adminUpdateProject(formData: FormData, projectCode: string) {
    return this.http
      .post<number>(`${this.baseApiUrl}/admin/project/${projectCode}`, formData)
      .pipe(catchError(this.handleError));
  }

  /* 
  use [fromDate, toDate) as result to sync with the backend api
  */
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
    projectCode: string,
    reviewerId?: number
  ): Observable<ReviewerProjectDetails> {
    return this.http
      .post<ReviewerProjectDetails>(
        `${this.baseApiUrl}/project/review/${projectCode}`,
        {
          reviewerId,
        }
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
      .post<CommonSuccessResponse>(
        `${this.baseApiUrl}/project/addition-files`,
        formData
      )
      .pipe(catchError(this.handleError));
  }

  getAdminRequestDashboard(
    {
      fromYear,
      fromMonth,
      fromDay,
      toYear,
      toMonth,
      toDay,
    }: {
      fromYear: number;
      fromMonth: number;
      fromDay: number;
      toYear: number;
      toMonth: number;
      toDay: number;
    },
    pageNo: number,
    pageSize: number,
    sortBy: string[],
    isAsc: boolean,
    searchFilter?: AdminDashboardFilter
  ): Observable<AdminDashboardRow[]> {
    return this.http
      .post<AdminDashboardRow[]>(`${this.baseApiUrl}/admin/dashboard/request`, {
        fromYear,
        fromMonth,
        fromDay,
        toYear,
        toMonth,
        toDay,
        pageNo,
        pageSize,
        sortBy,
        isAsc,
        projectCode: searchFilter?.projectCode,
        projectName: searchFilter?.projectName,
        projectStatus: searchFilter?.projectStatus,
      })
      .pipe(catchError(this.handleError));
  }

  getAdminStartedDashboard(
    {
      fromYear,
      fromMonth,
      fromDay,
      toYear,
      toMonth,
      toDay,
    }: {
      fromYear: number;
      fromMonth: number;
      fromDay: number;
      toYear: number;
      toMonth: number;
      toDay: number;
    },
    pageNo: number,
    pageSize: number,
    sortBy: string[],
    isAsc: boolean,
    searchFilter?: AdminDashboardFilter
  ): Observable<AdminDashboardRow[]> {
    return this.http
      .post<AdminDashboardRow[]>(`${this.baseApiUrl}/admin/dashboard/started`, {
        fromYear,
        fromMonth,
        fromDay,
        toYear,
        toMonth,
        toDay,
        pageNo,
        pageSize,
        sortBy,
        isAsc,
        projectCode: searchFilter?.projectCode,
        projectName: searchFilter?.projectName,
        projectStatus: searchFilter?.projectStatus,
      })
      .pipe(catchError(this.handleError));
  }

  getAdminSummary({
    fromYear,
    fromMonth,
    fromDay,
    toYear,
    toMonth,
    toDay,
  }: {
    fromYear: number;
    fromMonth: number;
    fromDay: number;
    toYear: number;
    toMonth: number;
    toDay: number;
  }): Observable<AdminSummaryByStatus[]> {
    return this.http
      .post<AdminSummaryByStatus[]>(
        `${this.baseApiUrl}/admin/dashboard/summary`,
        {
          fromYear,
          fromMonth,
          fromDay,
          toYear,
          toMonth,
          toDay,
        }
      )
      .pipe(catchError(this.handleError));
  }

  downloadReport({
    fromYear,
    fromMonth,
    fromDay,
    toYear,
    toMonth,
    toDay,
  }: {
    fromYear: number;
    fromMonth: number;
    fromDay: number;
    toYear: number;
    toMonth: number;
    toDay: number;
  }) {
    return this.http
      .post<string>(`${this.baseApiUrl}/admin/report`, {
        fromYear,
        fromMonth,
        fromDay,
        toYear,
        toMonth,
        toDay,
      })
      .pipe(catchError(this.handleError));
  }

  getAdminDashboardDateConfigPreview(
    {
      fromYear,
      fromMonth,
      fromDay,
      toYear,
      toMonth,
      toDay,
    }: {
      fromYear: number;
      fromMonth: number;
      fromDay: number;
      toYear: number;
      toMonth: number;
      toDay: number;
    },
    pageNo: number,
    pageSize: number
  ): Observable<AdminDashboardDateConfigPreviewRow[]> {
    return this.http
      .post<AdminDashboardDateConfigPreviewRow[]>(
        `${this.baseApiUrl}/admin/dashboard/config/preview`,
        {
          fromYear,
          fromMonth,
          fromDay,
          toYear,
          toMonth,
          toDay,
          pageNo,
          pageSize,
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
    const message = error?.error
      ? `${error?.error?.message}, name: ${error?.error?.name || '-'}`
      : '[Project Service]: Unknown error.';
    return throwError(() => new Error(message));
  }
}
