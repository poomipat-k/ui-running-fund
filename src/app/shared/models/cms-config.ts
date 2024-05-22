import { DashboardConfig } from './dashboard-config';
import { FAQ } from './faq';
import { Footer } from './footer';
import { LandingPage } from './landing-page';

export class CmsConfig {
  landing: LandingPage;
  dashboard: DashboardConfig;
  faq: FAQ[];
  footer: Footer;

  constructor() {}
}
