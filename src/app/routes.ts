import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReviewDetailsComponent } from './review-details/review-details.component';

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
    component: ReviewDetailsComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

export default routeConfig;
