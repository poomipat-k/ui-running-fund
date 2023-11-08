import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BackgroundColor } from './shared/enums/background-color';
import { ThemeService } from './services/theme.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavbarComponent, FooterComponent],
})
export class AppComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    this.themeService.globalBackgroundColor$
      .pipe(delay(0))
      .subscribe((color) => {
        this.backgroundColor = color;
      });
  }
}
