import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AppComponent } from './app/app.component';
import routeConfig from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routeConfig, withComponentInputBinding()),
    // UserService,
    importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => console.error(err));
