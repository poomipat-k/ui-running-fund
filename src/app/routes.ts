import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReviewerFlowPagesComponent } from './reviewer-flow-pages/reviewer-flow-pages.component';
import { authGuard } from './shared/guard/auth.guard';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'review/project/:projectCode',
    component: ReviewerFlowPagesComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

export default routeConfig;
