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
import { Subscription, concatMap, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { ErrorPopupComponent } from '../components/error-popup/error-popup.component';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { ArrowForwardComponent } from '../components/svg/arrow-forward/arrow-forward.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ReviewCriteria } from '../shared/models/review-criteria';
import { ReviewDetails } from '../shared/models/review-details';
import { ReviewerImprovement } from '../shared/models/review-improvement';
import { ReviewerProjectDetails } from '../shared/models/reviewer-project-details';
import { User } from '../shared/models/user';
import { requiredCheckBoxToBeCheckedValidator } from '../shared/validators/requiredCheckbox';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { ReviewSuccessComponent } from './review-success/review-success.component';
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
    SuccessPopupComponent,
    ReviewSuccessComponent,
    SuccessPopupComponent,
    ErrorPopupComponent,
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

  protected showSuccessPopup = false;
  protected showErrorPopup = false;
  protected form: FormGroup;
  protected reviewCriteriaList: ReviewCriteria[] = [];
  protected apiData: ReviewerProjectDetails = new ReviewerProjectDetails();
  protected pageIndex = 1;
  protected maxPageIndex = 5; // submit page
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
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private initForm() {
    this.form = new FormGroup({
      projectHistoryId: new FormControl(null, Validators.required),
      ip: new FormGroup({
        isInterestedPerson: new FormControl(null, Validators.required),
      }),
      review: new FormGroup({
        reviewSummary: new FormControl(null, Validators.required),
        scores: new FormGroup({}),
      }),
      comment: new FormControl(),
    });
  }

  protected nextPage(): void {
    if (this.pageIndex === this.maxPageIndex) {
      this.submitForm();
      return;
    }
    if (
      this.pageIndex === 1 &&
      this.interestedPersonComponent.validToGoNext()
    ) {
      this.pageIndex++;
    } else if (this.pageIndex === 2) {
      this.pageIndex++;
    } else if (
      this.pageIndex === 3 &&
      this.reviewerScoreComponent.validToGoNext()
    ) {
      this.pageIndex++;
    } else if (this.pageIndex === 4) {
      this.pageIndex++;
    }
  }

  private submitForm() {
    if (this.form.valid && !this.form.disabled) {
      this.projectService.addReview(this.form.value).subscribe({
        next: (id) => {
          if (id) {
            this.form.disable();
            this.showSuccessPopup = true;
            setTimeout(() => {
              this.showSuccessPopup = false;
              this.pageIndex++;
            }, 2000);
          }
        },
        error: () => {
          this.showErrorPopup = true;
          setTimeout(() => {
            this.showErrorPopup = false;
          }, 2000);
        },
      });
    }
  }

  protected prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      return;
    }
    this.routerService.navigate(['/']);
  }

  protected redirectToHomePage(): void {
    this.routerService.navigate(['/']);
  }

  private prepareData() {
    this.subs.push(
      this.projectService
        .getReviewCriteria(environment.reviewCriteriaVersion)
        .pipe(
          concatMap((criteriaList) => {
            const user = this.userService.getCurrentInMemoryUser();
            if (!criteriaList || criteriaList.length === 0) {
              return of(null);
            }
            this.reviewCriteriaList = criteriaList;
            this.addScoreFormControls(criteriaList);
            this.currentUser = user;
            return this.projectService.getProjectDetailsForReviewer(
              this.projectCode
            );
          })
        )
        .subscribe((result) => {
          const data = new ReviewerProjectDetails();
          if (result) {
            data.projectId = result.projectId;
            data.projectHistoryId = result.projectHistoryId;
            data.projectCode = result.projectCode;
            data.projectCreatedAt = result.projectCreatedAt;
            data.projectName = result.projectName;
            data.reviewId = result.reviewId;
            data.reviewedAt = result.reviewedAt;
            data.isInterestedPerson = result.isInterestedPerson;
            data.interestedPersonType = result.interestedPersonType;
            data.reviewDetails = result.reviewDetails;
            data.reviewSummary = result.reviewSummary;
            data.reviewerComment = result.reviewerComment;

            data.reviewImprovement = new ReviewerImprovement();
            data.reviewImprovement.benefit = result.reviewImprovement?.benefit;
            data.reviewImprovement.experienceAndReliability =
              result.reviewImprovement?.experienceAndReliability;
            data.reviewImprovement.fundAndOutput =
              result.reviewImprovement?.fundAndOutput;
            data.reviewImprovement.projectQuality =
              result.reviewImprovement?.projectQuality;
            data.reviewImprovement.projectStandard =
              result.reviewImprovement?.projectStandard;
            data.reviewImprovement.visionAndImage =
              result.reviewImprovement?.visionAndImage;

            this.apiData = data;

            this.patchFormData(result);
          }
        })
    );
  }

  private patchFormData(data: ReviewerProjectDetails) {
    this.patchProjectHistoryId(data.projectHistoryId);
    this.patchInterestedPerson(data);
    this.patchScores(data.reviewDetails);
    this.patchSummary(data);
    this.patchComment(data.reviewerComment);
    // Disable form when reviewer already reviewed
    if (data.reviewId) {
      this.form?.disable();
    }
  }

  private patchProjectHistoryId(projectHistoryId: number) {
    if (projectHistoryId) {
      this.form.patchValue({
        projectHistoryId: projectHistoryId,
      });
    }
  }

  private patchInterestedPerson(data: ReviewerProjectDetails) {
    if (
      data.isInterestedPerson === null ||
      data.isInterestedPerson === undefined
    ) {
      return;
    }
    const control = this.form.get('ip') as FormGroup;
    if (!data.isInterestedPerson) {
      control.patchValue({ isInterestedPerson: false });
      return;
    }

    control.addControl(
      'interestedPersonType',
      new FormControl(data.interestedPersonType, Validators.required)
    );
    control.patchValue({
      isInterestedPerson: true,
    });
    return;
  }

  private patchScores(reviewDetails: ReviewDetails[] | undefined) {
    if (reviewDetails && reviewDetails.length > 0) {
      const scores = this.buildScoresToPatch(reviewDetails);
      const scoreGroupControl = this.form.get('review.scores') as FormGroup;
      if (scoreGroupControl) {
        scoreGroupControl?.patchValue(scores);
      }
    }
  }

  private patchSummary(data: ReviewerProjectDetails) {
    if (data.reviewSummary === null || data.reviewSummary === undefined) {
      return;
    }
    const scoreGroupControl = this.form.get('review') as FormGroup;
    if (data.reviewSummary !== 'to_be_revised') {
      scoreGroupControl?.removeControl('improvement');
      scoreGroupControl?.patchValue({
        reviewSummary: data.reviewSummary,
      });
      return;
    }
    // Add improvement checkbox when to_be_revised selected
    const improvementFormGroup = new FormGroup(
      {
        projectQuality: new FormControl(
          data?.reviewImprovement?.projectQuality ?? false
        ),
        projectStandard: new FormControl(
          data?.reviewImprovement?.projectStandard ?? false
        ),
        visionAndImage: new FormControl(
          data?.reviewImprovement?.visionAndImage ?? false
        ),
        benefit: new FormControl(data?.reviewImprovement?.benefit ?? false),
        experienceAndReliability: new FormControl(
          data?.reviewImprovement?.experienceAndReliability ?? false
        ),
        fundAndOutput: new FormControl(
          data?.reviewImprovement?.fundAndOutput ?? false
        ),
      },
      requiredCheckBoxToBeCheckedValidator()
    );
    scoreGroupControl.addControl('improvement', improvementFormGroup);
    scoreGroupControl?.patchValue({
      reviewSummary: data.reviewSummary,
    });
    return;
  }

  private patchComment(reviewerComment: string | undefined) {
    if (reviewerComment) {
      this.form.patchValue({
        comment: reviewerComment,
      });
    }
  }

  private buildScoresToPatch(reviewDetails: ReviewDetails[] | undefined): {
    [key: string]: number;
  } {
    const scores: { [key: string]: number } = {};
    reviewDetails?.forEach((rd) => {
      scores[`q_${rd.criteriaVersion}_${rd.criteriaOrderNumber}`] = rd.score;
    });
    return scores;
  }

  private addScoreFormControls(criteriaList: ReviewCriteria[]) {
    if (!criteriaList || criteriaList.length === 0) {
      return;
    }
    const group = this.form.get('review.scores') as FormGroup;
    criteriaList.forEach((c) => {
      group.addControl(
        `q_${c.criteriaVersion}_${c.orderNumber}`,
        new FormControl(null, Validators.required)
      );
    });
  }
}
