import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, forkJoin, mergeMap, of } from 'rxjs';
import { ArrowForwardComponent } from '../components/svg/arrow-forward/arrow-forward.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ReviewCriteria } from '../shared/models/review-criteria';
import { ReviewDetails } from '../shared/models/review-details';
import { ReviewerProjectDetails } from '../shared/models/reviewer-project-details';
import { User } from '../shared/models/user';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { ReviewerConfirmationComponent } from './reviewer-confirmation/reviewer-confirmation.component';
import { ReviewerInterestedPerson } from './reviewer-interested-person/reviewer-interested-person.component';
import { ReviewerScoreComponent } from './reviewer-score/reviewer-score.component';
import { ReviewerSummaryComponent } from './reviewer-summary/reviewer-summary.component';

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
    ReviewerSummaryComponent,
    ReviewerConfirmationComponent,
  ],
  templateUrl: './reviewer-flow-pages.component.html',
  styleUrls: ['./reviewer-flow-pages.component.scss'],
})
export class ReviewerFlowPagesComponent implements OnInit, OnDestroy {
  @ViewChild('interestedPerson')
  interestedPersonComponent: ReviewerInterestedPerson;
  @ViewChild('reviewerScore')
  reviewerScoreComponent: ReviewerScoreComponent;
  // url params
  @Input() projectCode: string;
  protected form: FormGroup;
  protected reviewCriteriaList: ReviewCriteria[] = [];
  protected apiData: ReviewerProjectDetails = new ReviewerProjectDetails();
  protected pageIndex = 1;
  protected maxPageIndex = 5;
  private currentUser: User;

  // Services
  private readonly routerService: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly userService: UserService = inject(UserService);
  private readonly projectService: ProjectService = inject(ProjectService);
  protected readonly dateService: DateService = inject(DateService);

  private readonly subs: Subscription[] = [];

  get projectCreatedAt(): string {
    if (this.apiData.projectCreatedAt) {
      return this.dateService.dateToStringWithLongMonth(
        this.apiData.projectCreatedAt
      );
    }
    return '';
  }

  get userFullName(): string {
    if (!this.currentUser) {
      return '';
    }
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  constructor() {}

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.initForm();
    this.prepareData();
    // this.pageIndex += 2;
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm() {
    this.form = new FormGroup({
      ip: new FormGroup({
        isInterestedPerson: new FormControl(null, Validators.required),
      }),
      score: new FormGroup({
        summary: new FormControl(null, Validators.required),
      }),
      comment: new FormControl(),
    });
  }

  protected nextPage(): void {
    if (this.pageIndex === this.maxPageIndex) {
      console.log('===submit', this.form.value);
      return;
    }
    if (
      this.pageIndex === 1 &&
      this.interestedPersonComponent.validToGoNext()
    ) {
      console.log(this.form);
      this.pageIndex++;
    } else if (this.pageIndex === 2) {
      console.log(this.form);
      this.pageIndex++;
    } else if (
      this.pageIndex === 3 &&
      this.reviewerScoreComponent.validToGoNext()
    ) {
      this.pageIndex++;
      console.log(this.form);
    } else if (this.pageIndex === 4) {
      this.pageIndex++;
      console.log(this.form);
    } else {
      console.log('===not valid to go next');
      console.log(this.form);
    }
  }

  protected prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      return;
    }
    this.routerService.navigate(['/']);
  }

  private prepareData() {
    this.subs.push(
      forkJoin([
        this.projectService.getReviewCriteria(1),
        this.userService.isLoggedIn(),
      ])
        .pipe(
          mergeMap(([criteriaList, isLoggedIn]) => {
            if (!isLoggedIn || !criteriaList || criteriaList.length === 0) {
              return of(null);
            }
            this.reviewCriteriaList = criteriaList;
            this.addScoreFormControls(criteriaList);
            const user = this.userService.getCurrentUser();
            this.currentUser = user;
            console.log('===user', user);
            return this.projectService.getProjectDetailsForReviewer(
              user.id,
              this.projectCode
            );
          })
        )
        .subscribe((result) => {
          console.log('===sub result:', result);
          const data = new ReviewerProjectDetails();
          if (result) {
            data.projectId = result.projectId;
            data.projectCode = result.projectCode;
            data.projectCreatedAt = result.projectCreatedAt;
            data.projectName = result.projectName;
            data.reviewerId = result.reviewerId;
            data.reviewedAt = result.reviewedAt;
            data.isInterestedPerson = result.isInterestedPerson;
            data.interestedPesonType = result.interestedPesonType;
            data.reviewDetails = result.reviewDetails;
            this.apiData = data;

            this.patchFormData(result);
          }
        })
    );
  }

  private patchFormData(data: ReviewerProjectDetails) {
    this.patchScores(data.reviewDetails);
  }

  private patchIntestedPerson() {}

  private patchScores(reviewDetails: ReviewDetails[] | undefined) {
    if (reviewDetails && reviewDetails.length > 0) {
      const scores = this.buildScoresToPatch(reviewDetails);
      const control = this.form.get('score') as FormGroup;
      if (control) {
        control.patchValue(scores);
      }
    }
  }

  private buildScoresToPatch(reviewDetails: ReviewDetails[] | undefined): {
    [key: string]: number;
  } {
    const scores: { [key: string]: number } = {};
    reviewDetails?.forEach((rd) => {
      scores[`${rd.criteriaVersion}_${rd.criteriaOrderNumber}`] = rd.score;
    });
    return scores;
  }

  private addScoreFormControls(criteriaList: ReviewCriteria[]) {
    if (!criteriaList || criteriaList.length === 0) {
      return;
    }
    const group = this.form.get('score') as FormGroup;
    criteriaList.forEach((c) => {
      group.addControl(
        `${c.criteriaVersion}_${c.orderNumber}`,
        new FormControl(null, Validators.required)
      );
    });
  }
}
