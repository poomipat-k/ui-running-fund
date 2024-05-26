import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import routeConfig from './app/routes';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routeConfig,
      inMemoryScrollingFeature,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
