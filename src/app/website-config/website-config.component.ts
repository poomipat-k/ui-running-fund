import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
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
