import { DashboardConfig } from './dashboard-config';
import { FAQ } from './faq';
import { Footer } from './footer';
import { HowToCreate } from './how-to-create';
import { LandingPage } from './landing-page';

export class CmsConfig {
  landing: LandingPage;
  dashboard: DashboardConfig;
  faq: FAQ[];
  howToCreate: HowToCreate[];
  footer: Footer;

  constructor() {}
}
