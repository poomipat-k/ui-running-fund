import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  public dateToStringWithShortMonth(dateStr: string) {
    return this.transformDateString(dateStr, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  public dateToStringWithLongMonth(dateStr: string) {
    return this.transformDateString(dateStr, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  private transformDateString(
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    try {
      const result = date.toLocaleDateString('th-TH', options);
      return result;
    } catch (err) {
      console.error('Error in Date service transformDateString(): ', err);
      return '';
    }
  }
}
