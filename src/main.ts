import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import routeConfig from './app/routes';
import { UserService } from './app/services/user.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routeConfig),
    UserService,
    importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => console.error(err));
