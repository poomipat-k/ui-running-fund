import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { BackgroundColor } from '../shared/enums/background-color';
import { WebsiteConfigSideNav } from '../shared/models/website-config-side-nav';
import { WebsiteConfigDashboardComponent } from './website-config-dashboard/website-config-dashboard.component';

@Component({
  selector: 'app-website-config',
  standalone: true,
  imports: [WebsiteConfigDashboardComponent],
  templateUrl: './website-config.component.html',
  styleUrl: './website-config.component.scss',
})
export class WebsiteConfigComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);

  protected activeNav = '';
  protected sideNavItems: WebsiteConfigSideNav[] = [
    {
      display: 'Dashboard',
      value: 'dashboard',
    },
  ];

  ngOnInit(): void {
    this.themeService.changeBackgroundColor(BackgroundColor.white);

    if (this.sideNavItems[0]) {
      this.activeNav = this.sideNavItems[0].value;
    }
  }
}
