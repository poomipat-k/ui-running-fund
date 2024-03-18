import { Routes } from '@angular/router';
import { EmailActivateSuccessComponent } from './email-activate-success/email-activate-success.component';
import { ForgotPasswordEmailSentComponent } from './forgot-password-email-sent/forgot-password-email-sent.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResetPasswordSuccessComponent } from './reset-password-success/reset-password-success.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { adminAuthGuard } from './shared/guard/admin-auth.guard';
import { applicantAuthGuard } from './shared/guard/applicant-auth.guard';
import { authGuard } from './shared/guard/auth.guard';
import { reviewerAuthGuard } from './shared/guard/reviewer-auth.guard';
import { SignupSuccessComponent } from './signup-success/signup-success.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Login',
  },
  {
    path: 'proposal/create',
    loadComponent: () =>
      import('./applicant-flow-pages/applicant-flow-pages.component').then(
        (mod) => mod.ApplicantFlowPagesComponent
      ),
    title: 'Create a proposal',
    canActivate: [applicantAuthGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (mod) => mod.DashboardComponent
      ),
    title: 'Dashboard',
    canActivate: [authGuard],
  },
  {
    path: 'project/review/:projectCode',
    loadComponent: () =>
      import('./reviewer-flow-pages/reviewer-flow-pages.component').then(
        (mod) => mod.ReviewerFlowPagesComponent
      ),
    canActivate: [reviewerAuthGuard],
  },
  {
    path: 'applicant/project/:projectCode',
    loadComponent: () =>
      import(
        './applicant-project-details/applicant-project-details.component'
      ).then((mod) => mod.ApplicantProjectDetailsComponent),
    canActivate: [applicantAuthGuard],
  },
  {
    path: 'admin/project/:projectCode',
    loadComponent: () =>
      import(
        './applicant-project-details/applicant-project-details.component'
      ).then((mod) => mod.ApplicantProjectDetailsComponent),
    canActivate: [adminAuthGuard],
  },
  {
    path: 'project/applicant/review-details/:projectCode/:reviewerId',
    loadComponent: () =>
      import('./reviewer-flow-pages/reviewer-flow-pages.component').then(
        (mod) => mod.ReviewerFlowPagesComponent
      ),
    canActivate: [applicantAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then((mod) => mod.SignupComponent),
    title: 'Signup',
  },
  {
    path: 'signup/success',
    component: SignupSuccessComponent,
    title: 'Signup success',
  },
  {
    path: 'signup/activate/:activateCode',
    component: EmailActivateSuccessComponent,
    title: 'Activate Email',
  },
  {
    path: 'password/forgot',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (mod) => mod.ForgotPasswordComponent
      ),
    title: 'Forgot Password',
  },
  {
    path: 'password/forgot/sent',
    component: ForgotPasswordEmailSentComponent,
    title: 'Reset password email sent',
  },
  {
    path: 'password/reset/success',
    component: ResetPasswordSuccessComponent,
    title: 'Reset password successfully',
  },
  {
    path: 'password/reset/:resetPasswordCode',
    component: ResetPasswordComponent,
    title: 'Reset password',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

export default routeConfig;
