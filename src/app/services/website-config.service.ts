import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import { AdminUpdateWebsiteConfig } from '../shared/models/admin-update-website-config';
import { CommonSuccessResponse } from '../shared/models/common-success-response';
import { LandingPage } from '../shared/models/landing-page';

@Injectable({
  providedIn: 'root',
})
export class WebsiteConfigService {
  private baseApiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  getLandingPage() {
    return this.http
      .get<LandingPage>(`${this.baseApiUrl}/content/landing`)
      .pipe(catchError(this.handleError));
  }

  adminUpdateWebsiteConfig(
    formData: AdminUpdateWebsiteConfig
  ): Observable<CommonSuccessResponse> {
    return this.http
      .put<CommonSuccessResponse>(
        `${this.baseApiUrl}/admin/website/config`,
        formData
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
      () => new Error('[WebsiteConfig Service]: please try again later.')
    );
  }
}
