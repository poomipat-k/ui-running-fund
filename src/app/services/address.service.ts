import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Postcode } from '../shared/models/Postcode';
import { District } from '../shared/models/district';
import { Province } from '../shared/models/province';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseApiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  getProvinces() {
    return this.http
      .get<Province[]>(`${this.baseApiUrl}/address/provinces`)
      .pipe(catchError(this.handleError));
  }

  getDistrictsByProvinceId(provinceId: number) {
    return this.http
      .get<District[]>(`${this.baseApiUrl}/address/districts/${provinceId}`)
      .pipe(catchError(this.handleError));
  }

  getSubdistrictsByDistrictId(districtId: number) {
    return this.http
      .get<District[]>(`${this.baseApiUrl}/address/subdistricts/${districtId}`)
      .pipe(catchError(this.handleError));
  }

  getPostcodesBySubdistrictId(subdistrictId: number) {
    return this.http
      .get<Postcode[]>(`${this.baseApiUrl}/address/postcodes/${subdistrictId}`)
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
