import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackgroundColor } from '../shared/enums/background-color';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  private globalBackgroundColor = new BehaviorSubject<BackgroundColor>(
    BackgroundColor.white
  );
  public globalBackgroundColor$ = this.globalBackgroundColor.asObservable();

  public changeBackgroundColor(newColor: BackgroundColor): void {
    this.globalBackgroundColor.next(newColor);
  }
}
