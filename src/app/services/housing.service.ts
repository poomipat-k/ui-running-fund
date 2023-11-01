import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  data = ['a', 'b', 'c'];

  getData(): string[] {
    return this.data;
  }
  constructor() {}
}
