import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenshotService {
  private screenshotCapturing = new BehaviorSubject<boolean>(false);
  public screenshotCapturing$ = this.screenshotCapturing.asObservable();

  public changeCapturingStateTo(capturing: boolean): void {
    this.screenshotCapturing.next(capturing);
  }

  constructor() {}
}
