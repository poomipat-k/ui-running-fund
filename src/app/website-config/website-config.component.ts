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
import { WebsiteConfigFaqComponent } from './website-config-faq/website-config-faq.component';
import { WebsiteConfigFooterComponent } from './website-config-footer/website-config-footer.component';
import { WebsiteConfigHowToCreateComponent } from './website-config-how-to-create/website-config-how-to-create.component';
import { WebsiteConfigLandingPageComponent } from './website-config-landing-page/website-config-landing-page.component';

@Component({
  selector: 'app-website-config',
  standalone: true,
  imports: [
    WebsiteConfigLandingPageComponent,
    WebsiteConfigDashboardComponent,
    SuccessPopupComponent,
    CommonModule,
    WebsiteConfigFaqComponent,
    WebsiteConfigFooterComponent,
    WebsiteConfigHowToCreateComponent,
  ],
  templateUrl: './website-config.component.html',
  styleUrl: './website-config.component.scss',
})
export class WebsiteConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('dashboard') dashboardComponent: WebsiteConfigDashboardComponent;
  @ViewChild('FAQ') faqConfigComponent: WebsiteConfigFaqComponent;

  private readonly themeService: ThemeService = inject(ThemeService);

  private readonly PAGE_SIZE = 5;

  protected form: FormGroup;
  protected dashboardActivePage = 1;

  protected bannerFilesSubject = new BehaviorSubject<File[]>([]);
  protected footerLogoFilesSubject = new BehaviorSubject<File[]>([]);

  protected originalFormValue: AdminUpdateWebsiteConfig;
  protected dashboardData: TableCell[][] = [];
  protected dashboardItemCount = 0;
  protected activeNav = '';
  protected sideNavItems: WebsiteConfigSideNav[] = [
    {
      display: 'Landing Page',
      value: 'landing',
    },
    {
      display: 'Dashboard',
      value: 'dashboard',
    },
    {
      display: 'คำถามที่พบบ่อย (FAQ)',
      value: 'faq',
    },
    {
      display: 'วิธีสร้างใบขอทุน',
      value: 'howToCreate',
    },
    {
      display: 'Footer',
      value: 'footer',
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

  get bannerFormArray(): FormArray {
    return this.form.get('landing.banner') as FormArray;
  }

  get dashboardGroup(): FormGroup {
    return this.form.get('dashboard') as FormGroup;
  }

  get faqFormArray(): FormArray {
    return this.form.get('faq') as FormArray;
  }

  get footerFormGroup(): FormGroup {
    return this.form.get('footer') as FormGroup;
  }

  get footerLogoFormArray(): FormArray {
    return this.form.get('footer.logo') as FormArray;
  }

  get howToCreateFormArray(): FormArray {
    return this.form.get('howToCreate') as FormArray;
  }

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);
    this.initForm();

    if (this.sideNavItems[0]) {
      // Todo
      this.activeNav = this.sideNavItems[3].value;
    }

    // Load dashboard data
    this.loadCmsData();
  }

  ngAfterViewInit(): void {
    // subs to dashboard date config changes
    this.dashboardGroup.valueChanges.subscribe(() => {
      if (this.dashboardGroup.valid) {
        this.onDashboardPageChanged(1);
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
      faq: new FormArray([
        // new FormGroup({
        //   id: new FormControl(null),
        //   question: new FormControl(null, Validators.required),
        //   answer: new FormControl(null, Validators.required),
        // }),
      ]),
      howToCreate: new FormArray([
        // new FormGroup({
        //   header: new FormControl(null, Validators.required),
        //   content: new FormControl(null, Validators.required),
        // }),
      ]),
      footer: new FormGroup({
        logo: new FormArray([
          // new FormGroup({
          //   id: new FormControl(null),
          //   objectKey: new FormControl(null),
          //   linkTo: new FormControl(null),
          //   fullPath: new FormControl(null),
          // }),
        ]),
        contact: new FormGroup({
          email: new FormControl(null, Validators.required),
          phoneNumber: new FormControl(null, Validators.required),
          fromHour: new FormControl(null, Validators.required),
          fromMinute: new FormControl(null, Validators.required),
          toHour: new FormControl(null, Validators.required),
          toMinute: new FormControl(null, Validators.required),
        }),
      }),
    });
    this.originalFormValue = this.form.value;
  }

  private loadCmsData() {
    this.subs.push(
      this.websiteConfigService.getCmsData().subscribe((result) => {
        console.log('==result', result);
        if (result) {
          this.form.patchValue({
            landing: {
              content: result.landing.content,
            },
            dashboard: {
              fromYear: result.dashboard.fromYear,
              fromMonth: result.dashboard.fromMonth,
              fromDay: result.dashboard.fromDay,
              toYear: result.dashboard.toYear,
              toMonth: result.dashboard.toMonth,
              toDay: result.dashboard.toDay,
            },
            footer: {
              contact: result.footer.contact,
            },
          });
          // banners
          result.landing.banner?.forEach((b) => {
            this.bannerFormArray.push(
              new FormGroup({
                id: new FormControl(b.id ?? null),
                objectKey: new FormControl(b.objectKey ?? null),
                linkTo: new FormControl(b.linkTo ?? null),
                fullPath: new FormControl(b.fullPath ?? null),
              })
            );
          });
          // faq list
          result.faq?.forEach((faq) => {
            this.faqFormArray.push(
              new FormGroup({
                id: new FormControl(faq.id ?? null),
                question: new FormControl(faq.question ?? null),
                answer: new FormControl(faq.answer ?? null),
              })
            );
          });
          // footer logos
          result.footer.logo?.forEach((logo) => {
            this.footerLogoFormArray.push(
              new FormGroup({
                id: new FormControl(logo?.id),
                objectKey: new FormControl(logo?.objectKey),
                linkTo: new FormControl(logo?.linkTo),
                fullPath: new FormControl(logo?.fullPath),
              })
            );
          });

          this.originalFormValue = this.form.value;
        }
      })
    );
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
    // FAQ edit mode
    if (this.activeNav === 'faq' && this.faqConfigComponent.isEdit) {
      // add a new faq item to faq formArray
      if (this.faqConfigComponent.validToBeAdded()) {
        this.faqConfigComponent.addToFaqFormArray();
        this.faqConfigComponent.changeIsEdit(false);
        console.log('===added item', this.form.value);
      }
      return;
    }

    console.log('==submitting');
    this.markFieldsTouched();

    if (!this.form.valid) {
      console.error(this.form);

      const errorId = this.getFirstErrorIdWithPrefix(this.form, '');
      console.error('errorId', errorId);
      const errorNav = errorId.split('.')[0];
      this.activeNav = errorNav;
      return;
    }
    console.log(
      '===isForm changed',
      !isEqual(this.originalFormValue, this.form.value)
    );
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

  private markFieldsTouched() {
    this.form.markAllAsTouched();
  }

  // DFS to get formControl error first then check formGroup
  private getFirstErrorIdWithPrefix(
    rootGroup: FormGroup,
    prefix: string
  ): string {
    const keys = Object.keys(rootGroup.controls);
    for (const k of keys) {
      if ((rootGroup.controls[k] as FormGroup)?.controls) {
        const val = this.getFirstErrorIdWithPrefix(
          rootGroup.controls[k] as FormGroup,
          prefix ? `${prefix}.${k}` : k
        );
        if (val) {
          return val;
        }
      }
      if (!rootGroup.controls[k].valid) {
        return prefix ? `${prefix}.${k}` : k;
      }
    }
    return '';
  }

  onCancel() {
    if (this.activeNav === 'faq' && this.faqConfigComponent.isEdit) {
      this.faqConfigComponent.changeIsEdit(false);
      return;
    }
    this.redirectToDashboardPage();
  }

  private redirectToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  private getStatusDisplay(row: AdminDashboardDateConfigPreviewRow): string {
    return `standard__${row.projectStatus}`;
  }
}
