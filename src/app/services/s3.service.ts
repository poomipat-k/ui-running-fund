import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetPutPresignedResponse } from '../shared/models/get-put-presigned-response';
import { Presigned } from '../shared/models/presigned-url';
import { S3UploadResponse } from '../shared/models/s3-upload-response';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private baseApiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);
  constructor() {}

  getAttachmentsPresigned(
    path: string,
    userId?: number
  ): Observable<Presigned> {
    return this.http
      .post<Presigned>(`${this.baseApiUrl}/s3/presigned`, {
        path,
        projectCreatedByUserId: userId,
      })
      .pipe(catchError(this.handleError));
  }

  // upload through formdata
  uploadFileToStaticBucket(formData: FormData) {
    return this.http
      .post<S3UploadResponse>(`${this.baseApiUrl}/admin/cms/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  getPutPresigned(objectKey: string) {
    return this.http
      .post<GetPutPresignedResponse>(
        `${this.baseApiUrl}/s3/static/presigned/put`,
        {
          objectKey,
        }
      )
      .pipe(catchError(this.handleError));
  }

  putPresigned(url: string, file: File, options?: any) {
    return this.http
      .put<any>(url, file, options)
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
    return throwError(() => error);
  }
}
