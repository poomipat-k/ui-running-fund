import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReviewerFlowPagesComponent } from './reviewer-flow-pages/reviewer-flow-pages.component';
import { reviewerAuthGuard } from './shared/guard/reviewer-auth.guard';
import { SignupComponent } from './signup/signup.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    canActivate: [reviewerAuthGuard],
  },
  {
    path: 'project/review/:projectCode',
    component: ReviewerFlowPagesComponent,
    canActivate: [reviewerAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Signup',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

export default routeConfig;
