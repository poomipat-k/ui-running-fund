import { Component, Input, OnInit, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-applicant-project-details',
  standalone: true,
  imports: [],
  templateUrl: './applicant-project-details.component.html',
  styleUrl: './applicant-project-details.component.scss',
})
export class ApplicantProjectDetailsComponent implements OnInit {
  // url params
  @Input() projectCode: string;

  private readonly themeService: ThemeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
  }
}
