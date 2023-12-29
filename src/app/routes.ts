import { Routes } from '@angular/router';
import { EmailActivateSuccessComponent } from './email-activate-success/email-activate-success.component';
import { ForgotPasswordEmailSentComponent } from './forgot-password-email-sent/forgot-password-email-sent.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResetPasswordSuccessComponent } from './reset-password-success/reset-password-success.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReviewerFlowPagesComponent } from './reviewer-flow-pages/reviewer-flow-pages.component';
import { reviewerAuthGuard } from './shared/guard/reviewer-auth.guard';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
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
    component: ForgotPasswordComponent,
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
