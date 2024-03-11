import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/button/button/button.component';
import { ProjectService } from '../services/project.service';
import { S3Service } from '../services/s3.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';

@Component({
  selector: 'app-applicant-project-details',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './applicant-project-details.component.html',
  styleUrl: './applicant-project-details.component.scss',
})
export class ApplicantProjectDetailsComponent implements OnInit, OnDestroy {
  // url params
  @Input() projectCode: string;

  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly s3Service: S3Service = inject(S3Service);
  private readonly subs: Subscription[] = [];

  protected pathDisplay = '';
  protected downloadButtonAction = '';

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.loadProjectDetails();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  loadProjectDetails() {
    this.subs.push(
      this.projectService
        .getApplicantProjectDetails(this.projectCode)
        .subscribe((result) => {
          console.log('===result', result);
          if (result && result.length > 0) {
            this.pathDisplay = `${this.projectCode} ${result[0].projectName}`;
          }
        })
    );
  }

  onDownloadClick() {
    this.subs.push(
      this.s3Service
        .getAttachmentsPresigned(
          `${this.projectCode}/zip/${this.projectCode}_แบบฟอร์ม.zip`
        )
        .subscribe((result) => {
          if (result?.URL) {
            window.open(result.URL);
          }
        })
    );
  }
}
