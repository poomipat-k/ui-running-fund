import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080/api';
  constructor(private readonly http: HttpClient) {}

  getReviewers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/reviewers`);
  }
}
