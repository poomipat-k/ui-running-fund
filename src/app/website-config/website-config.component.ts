import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Subscription } from 'rxjs';

import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { WebsiteConfigService } from '../services/website-config.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { AdminDashboardDateConfigPreviewRow } from '../shared/models/admin-dashboard-date-config-preview-row';
import { AdminUpdateWebsiteConfig } from '../shared/models/admin-update-website-config';
import { TableCell } from '../shared/models/table-cell';
import { WebsiteConfigSideNav } from '../shared/models/website-config-side-nav';
import { fromDateBeforeToDateValidator } from '../shared/validators/fromDateBeforeToDate';
import { WebsiteConfigDashboardComponent } from './website-config-dashboard/website-config-dashboard.component';
import { WebsiteConfigLandingPageComponent } from './website-config-landing-page/website-config-landing-page.component';

@Component({
  selector: 'app-website-config',
  standalone: true,
  imports: [
    WebsiteConfigLandingPageComponent,
    WebsiteConfigDashboardComponent,
    SuccessPopupComponent,
    CommonModule,
  ],
  templateUrl: './website-config.component.html',
  styleUrl: './website-config.component.scss',
})
export class WebsiteConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('dashboard') dashboardComponent: WebsiteConfigDashboardComponent;

  private readonly themeService: ThemeService = inject(ThemeService);

  private readonly PAGE_SIZE = 5;

  protected form: FormGroup;
  protected dashboardActivePage = 1;

  protected bannerFilesSubject = new BehaviorSubject<File[]>([]);
  protected originalFormValue: AdminUpdateWebsiteConfig;
  protected dashboardData: TableCell[][] = [];
  protected dashboardItemCount = 0;
  protected activeNav = '';
  protected sideNavItems: WebsiteConfigSideNav[] = [
    {
      display: 'Landing Page',
      value: 'landingPage',
    },
    {
      display: 'Dashboard',
      value: 'dashboard',
    },
  ];
  protected showSuccessPopup = false;
  protected successPopupText = 'อัพเดตข้อมูลเว็บไซต์เรียบร้อยแล้ว';

  private readonly subs: Subscription[] = [];

  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly dateService: DateService = inject(DateService);
  private readonly router: Router = inject(Router);
  private readonly websiteConfigService: WebsiteConfigService =
    inject(WebsiteConfigService);

  get landingGroup(): FormGroup {
    return this.form.get('landing') as FormGroup;
  }
  get dashboardGroup(): FormGroup {
    return this.form.get('dashboard') as FormGroup;
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();

    if (this.sideNavItems[0]) {
      this.activeNav = this.sideNavItems[0].value;
    }

    // Load dashboard data
    this.getDashboardPeriod();
  }

  ngAfterViewInit(): void {
    // subs to dashboard date config changes
    this.dashboardGroup.valueChanges.subscribe(() => {
      if (this.dashboardComponent && this.dashboardGroup.valid) {
        this.dashboardComponent.onDashboardPageChanged(1);
      } else {
        this.clearDashboard();
      }
    });
  }

  private initForm() {
    this.form = new FormGroup({
      landing: new FormGroup({
        banner: new FormArray([
          // new FormGroup({
          // id: new FormControl(null),
          // objectKey: new FormControl(null),
          // linkTo: new FormControl(null),
          // fullPath: new FormControl(null),
          // }),
        ]),
        content: new FormControl(null),
      }),
      dashboard: new FormGroup(
        {
          fromDay: new FormControl(null, Validators.required),
          fromMonth: new FormControl(null, Validators.required),
          fromYear: new FormControl(null, Validators.required),
          toDay: new FormControl(null, Validators.required),
          toMonth: new FormControl(null, Validators.required),
          toYear: new FormControl(null, Validators.required),
        },
        fromDateBeforeToDateValidator()
      ),
    });
  }

  private loadDashboardData(pageNo: number) {
    this.subs.push(
      this.projectService
        .getAdminDashboardDateConfigPreview(
          this.dashboardGroup.value,
          pageNo,
          this.PAGE_SIZE
        )
        .subscribe((rows: AdminDashboardDateConfigPreviewRow[]) => {
          if (rows && rows.length) {
            const data = rows.map((row) => [
              {
                display: row.projectCode,
                value: row.projectCode,
              },
              {
                display: this.dateService.dateToStringWithLongMonth(
                  row.projectCreatedAt
                ),
                value: row.projectCreatedAt,
              },
              {
                display: row.projectName,
                value: row.projectName,
              },

              {
                display: this.getStatusDisplay(row),
                value: row.projectStatus,
              },
            ]);
            const count = rows[0].count;
            this.dashboardItemCount = count;
            this.dashboardData = data;
          } else {
            this.clearDashboard();
          }
        })
    );
  }

  private clearDashboard() {
    this.dashboardItemCount = 0;
    this.dashboardData = [];
  }

  onDashboardPageChanged(currentPage: number) {
    if (currentPage >= 1) {
      this.dashboardActivePage = currentPage;
      this.loadDashboardData(currentPage);
    }
  }

  onNavItemClick(item: WebsiteConfigSideNav) {
    if (item.value) {
      this.activeNav = item.value;
    }
  }

  onSave() {
    if (!this.form.valid) {
      console.error(this.form.errors);
      return;
    }
    if (isEqual(this.originalFormValue, this.form.value)) {
      console.warn('nothing changed from current website configuration');
      this.successPopupText = 'ไม่มีการเปลี่ยนแปลงข้อมูล';
      this.showSuccessPopup = true;
      setTimeout(() => {
        this.showSuccessPopup = false;
        this.redirectToDashboardPage();
      }, 2000);
      return;
    }
    this.subs.push(
      this.websiteConfigService
        .adminUpdateWebsiteConfig(this.form.value)
        .subscribe((result) => {
          if (result.success) {
            this.successPopupText = 'อัพเดตข้อมูลเว็บไซต์เรียบร้อยแล้ว';
            this.showSuccessPopup = true;
            setTimeout(() => {
              this.showSuccessPopup = false;
              this.redirectToDashboardPage();
            }, 2000);
          }
        })
    );
  }

  onCancel() {
    this.redirectToDashboardPage();
  }

  private redirectToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  private getStatusDisplay(row: AdminDashboardDateConfigPreviewRow): string {
    return `standard__${row.projectStatus}`;
  }

  private getDashboardPeriod() {
    this.subs.push(
      this.projectService.getReviewPeriod().subscribe((p) => {
        const fromDate = new Date(p.fromDate);
        const toDate = new Date(p.toDate);
        const localFromDate = fromDate.toLocaleDateString('en-US', {
          timeZone: 'Asia/bangkok',
        });
        const localToDate = toDate.toLocaleDateString('en-US', {
          timeZone: 'Asia/bangkok',
        });
        const [fromMonth, fromDay, fromYear] = localFromDate
          ?.split('/')
          .map((s) => +s);
        const [toMonth, toDay, toYear] = localToDate?.split('/').map((s) => +s);
        this.form.patchValue({
          dashboard: {
            fromYear,
            fromMonth,
            fromDay,
            toYear,
            toMonth,
            toDay,
          },
        });
        this.originalFormValue = this.form.value;
      })
    );
  }
}
