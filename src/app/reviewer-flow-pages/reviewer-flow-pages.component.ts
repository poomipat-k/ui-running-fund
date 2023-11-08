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
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { BackgroundColor } from '../shared/enums/background-color';
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
  ],
  templateUrl: './reviewer-flow-pages.component.html',
  styleUrls: ['./reviewer-flow-pages.component.scss'],
})
export class ReviewerFlowPagesComponent implements OnInit {
  @ViewChild('interestedPerson') form1: ReviewerInterestedPerson;
  // url params
  @Input() projectCode: string;
  protected form: FormGroup;

  private readonly routerService: Router = inject(Router);
  private readonly themeService: ThemeService = inject(ThemeService);

  protected pageIndex = 1;
  private pages = [
    ReviewerInterestedPerson,
    GeneralDetailsComponent,
    ReviewerScoreComponent,
  ];
  private maxPageIndex = this.pages.length;

  private readonly userService: UserService = inject(UserService);
  private readonly projectService: ProjectService = inject(ProjectService);

  constructor() {}

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.gray);
    this.initForm();

    this.loadDetails();
  }

  protected nextPage(): void {
    if (this.pageIndex >= this.maxPageIndex) {
      return;
    }
    // validate page

    if (this.pageIndex === 1 && !this.form1.isFormValid()) {
      console.log('===formIsNotValid');
      return;
    } else {
      this.pageIndex++;
    }
    console.log(this.form);
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
          // console.log('==Success result', result);
        }
      });
  }

  private initForm() {
    this.form = new FormGroup({
      isInterestedPerson: new FormControl(null, Validators.required),
    });
  }
}
