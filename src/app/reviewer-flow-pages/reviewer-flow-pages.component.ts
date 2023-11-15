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
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { ReviewCriteria } from '../shared/models/review-criteria';
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
  @ViewChild('reviewerScore') reviewerScoreComponent: ReviewerScoreComponent;
  // url params
  @Input() projectCode: string;
  protected form: FormGroup;
  protected reviewCriteriaList: ReviewCriteria[] = [];

  private readonly routerService: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  protected pageIndex = 1;
  private maxPageIndex = 5;

  private readonly userService: UserService = inject(UserService);
  private readonly projectService: ProjectService = inject(ProjectService);

  private readonly subs: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);

    this.initForm();
    this.prepareData();

    // this.pageIndex += 3;
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
    });
  }

  protected nextPage(): void {
    if (this.pageIndex >= this.maxPageIndex) {
      return;
    }
    // validate page

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
            return this.projectService.getProjectDetailsForReviewer(
              user.id,
              this.projectCode
            );
          })
        )
        .subscribe((_result) => {})
    );
  }

  private addScoreFormControls(criteriaList: ReviewCriteria[]) {
    if (!criteriaList || criteriaList.length === 0) {
      return;
    }
    const group = this.form.get('score') as FormGroup;
    criteriaList.forEach((c) => {
      group.addControl(
        `${c.criteria_version}_${c.order_number}`,
        new FormControl(null, Validators.required)
      );
    });
  }
}
