import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BackgroundColor } from './shared/enums/background-color';
import { ThemeService } from './services/theme.service';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavbarComponent, FooterComponent],
})
export class AppComponent implements AfterViewInit, OnDestroy {
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
