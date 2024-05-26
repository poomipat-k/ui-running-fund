import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription, delay } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ThemeService } from './services/theme.service';
import { BackgroundColor } from './shared/enums/background-color';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavbarComponent, FooterComponent],
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly subs: Subscription[] = [];

  protected backgroundColor = BackgroundColor.white;

  private readonly themeService: ThemeService = inject(ThemeService);

  get backgroundClass(): string {
    switch (this.backgroundColor) {
      case BackgroundColor.white:
        return 'background--white';
      case BackgroundColor.gray:
        return 'background--gray';
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subs.push(
      this.themeService.globalBackgroundColor$
        .pipe(delay(0))
        .subscribe((color) => {
          this.backgroundColor = color;
        })
    );
  }
}
