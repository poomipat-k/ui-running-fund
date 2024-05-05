import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { FaqComponent } from '../components/faq/faq.component';
import { DashboardApplicantComponent } from '../dashboard-applicant/dashboard-applicant.component';
import { DashboardReviewerComponent } from '../dashboard-reviewer/dashboard-reviewer.component';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardApplicantComponent,
    DashboardReviewerComponent,
    FaqComponent,
    CarouselComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
  }
}
