import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import { AdminUpdateWebsiteConfig } from '../shared/models/admin-update-website-config';
import { CmsConfig } from '../shared/models/cms-config';
import { CommonSuccessResponse } from '../shared/models/common-success-response';
import { FAQ } from '../shared/models/faq';
import { Footer } from '../shared/models/footer';
import { HowToCreate } from '../shared/models/how-to-create';
import { LandingPage } from '../shared/models/landing-page';
import { OperationConfig } from '../shared/models/operation-config';

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

  getCmsData() {
    return this.http
      .get<CmsConfig>(`${this.baseApiUrl}/content/cms`)
      .pipe(catchError(this.handleError));
  }

  getFAQ() {
    return this.http
      .get<FAQ[]>(`${this.baseApiUrl}/content/faq`)
      .pipe(catchError(this.handleError));
  }

  getHowToCreate() {
    return this.http
      .get<HowToCreate[]>(`${this.baseApiUrl}/content/how-to-create`)
      .pipe(catchError(this.handleError));
  }

  getFooter() {
    return this.http
      .get<Footer>(`${this.baseApiUrl}/content/footer`)
      .pipe(catchError(this.handleError));
  }

  adminUpdateWebsiteConfig(
    formData: AdminUpdateWebsiteConfig
  ): Observable<CommonSuccessResponse> {
    return this.http
      .put<CommonSuccessResponse>(
        `${this.baseApiUrl}/admin/cms/website/config`,
        formData
      )
      .pipe(catchError(this.handleError));
  }

  getOperationConfig() {
    return this.http
      .get<OperationConfig>(`${this.baseApiUrl}/operation/config`)
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
