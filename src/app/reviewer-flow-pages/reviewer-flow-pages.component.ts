import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap, of } from 'rxjs';
import { ArrowForwardComponent } from '../components/svg/arrow-forward/arrow-forward.component';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ReviewCriteria } from '../shared/models/review-criteria';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { ReviewerInterestedPerson } from './reviewer-interested-person/reviewer-interested-person.component';
import { ReviewerScoreComponent } from './reviewer-score/reviewer-score.component';

@Component({
  selector: 'app-reviewer-flow-pages',
  standalone: true,
  imports: [
    CommonModule,
    ReviewerInterestedPerson,
    GeneralDetailsComponent,
    ReviewerScoreComponent,
    ReactiveFormsModule,
    ArrowForwardComponent,
  ],
  templateUrl: './reviewer-flow-pages.component.html',
  styleUrls: ['./reviewer-flow-pages.component.scss'],
})
export class ReviewerFlowPagesComponent implements OnInit {
  @ViewChild('interestedPerson') form1: ReviewerInterestedPerson;
  // url params
  @Input() projectCode: string;
  protected form: FormGroup;
  protected reviewCriteriaList: ReviewCriteria[] = [];

  private readonly routerService: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  protected pageIndex = 1;
  private maxPageIndex = 3;

  private readonly userService: UserService = inject(UserService);
  private readonly projectService: ProjectService = inject(ProjectService);

  constructor() {}

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.initForm();

    this.loadReviewCriteria();
    this.loadDetails();

    this.pageIndex += 2;
  }

  protected nextPage(): void {
    if (this.pageIndex >= this.maxPageIndex) {
      return;
    }
    // validate page

    if (this.pageIndex === 1 && this.form1.validToGoNext()) {
      this.pageIndex++;
      console.log(this.form);
    } else if (this.pageIndex === 2) {
      this.pageIndex++;
      console.log(this.form);
    } else {
      console.log('===not valid to go next');
    }
  }

  protected prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      return;
    }
    this.routerService.navigate(['/']);
  }

  private loadReviewCriteria() {
    this.projectService.getReviewCriteria(1).subscribe((result) => {
      if (result) {
        this.reviewCriteriaList = result;
      }
    });
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
        console.log('===loadDetails result:', result);
        if (result) {
        }
      });
  }

  private initForm() {
    this.form = new FormGroup({
      ip: new FormGroup({
        isInterestedPerson: new FormControl(null, Validators.required),
      }),
    });
  }
}
