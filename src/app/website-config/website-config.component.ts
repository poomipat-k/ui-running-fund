import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateService } from '../services/date.service';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { AdminDashboardDateConfigPreviewRow } from '../shared/models/admin-dashboard-date-config-preview-row';
import { TableCell } from '../shared/models/table-cell';
import { WebsiteConfigSideNav } from '../shared/models/website-config-side-nav';
import { fromDateBeforeToDateValidator } from '../shared/validators/fromDateBeforeToDate';
import { WebsiteConfigDashboardComponent } from './website-config-dashboard/website-config-dashboard.component';
import { WebsiteConfigLandingPageComponent } from './website-config-landing-page/website-config-landing-page.component';

@Component({
  selector: 'app-website-config',
  standalone: true,
  imports: [WebsiteConfigLandingPageComponent, WebsiteConfigDashboardComponent],
  templateUrl: './website-config.component.html',
  styleUrl: './website-config.component.scss',
})
export class WebsiteConfigComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);

  protected form: FormGroup;
  protected dashboardData: TableCell[][] = [];

  protected dashboardCurrentPage = 1;
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

  private readonly subs: Subscription[] = [];

  private readonly projectService: ProjectService = inject(ProjectService);
  private readonly dateService: DateService = inject(DateService);

  get dashboardGroup(): FormGroup {
    return this.form.get('dashboard') as FormGroup;
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();

    if (this.sideNavItems[1]) {
      this.activeNav = this.sideNavItems[1].value;
    }

    // Load dashboard data
    this.getDashboardPeriod();

    // subs to dashboard date config changes

    this.dashboardGroup.valueChanges.subscribe((values) => {
      if (this.dashboardGroup.valid) {
        this.loadDashboardData();
      }
    });
  }

  private initForm() {
    this.form = new FormGroup({
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

  private loadDashboardData() {
    this.subs.push(
      this.projectService
        .getAdminDashboardDateConfigPreview(this.dashboardGroup.value, 1, 5)
        .subscribe((rows: AdminDashboardDateConfigPreviewRow[]) => {
          console.log('==rows', rows);
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
            this.dashboardData = data;
          }
        })
    );
  }

  onRequestDashboardPageChanged(currentPage: number) {
    if (currentPage >= 1) {
      this.dashboardCurrentPage = currentPage;
      this.loadDashboardData();
    }
  }

  onNavItemClick(item: WebsiteConfigSideNav) {
    if (item.value) {
      this.activeNav = item.value;
    }
  }

  onSave() {
    console.log('===onSave');
  }

  onCancel() {
    console.log('===onCancel');
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
      })
    );
  }
}
