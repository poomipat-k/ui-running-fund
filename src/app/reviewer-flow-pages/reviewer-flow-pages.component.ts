import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { mergeMap, of } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { ReviewerInvolvementComponent } from './reviewer-involvement/reviewer-involvement.component';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../enums/background-color';

@Component({
  selector: 'app-reviewer-flow-pages',
  standalone: true,
  imports: [
    CommonModule,
    ReviewerInvolvementComponent,
    GeneralDetailsComponent,
  ],
  templateUrl: './reviewer-flow-pages.component.html',
  styleUrls: ['./reviewer-flow-pages.component.scss'],
})
export class ReviewerFlowPagesComponent implements OnInit {
  // url params
  @Input() projectCode: string;

  private readonly routerService: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  protected pageIndex = 1;
  private maxPageIndex = 2;

  private readonly userService: UserService = inject(UserService);
  private readonly projectService: ProjectService = inject(ProjectService);

  constructor() {}

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);

    this.loadDetails();
  }

  protected nextPage(): void {
    if (this.pageIndex < this.maxPageIndex) {
      this.pageIndex++;
    }
  }

  protected prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      return;
    }
    this.routerService.navigate(['/']);
  }

  private loadDetails() {
    this.userService.currentUserSubject$
      .pipe(
        mergeMap((user) => {
          if (user.id) {
            return this.projectService.getProjectDetailsForReviewer(
              user.id,
              this.projectCode
            );
          }
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('==Success result', result);
        }
      });
  }
}
