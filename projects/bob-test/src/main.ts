import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideBob } from '../../bob/src/lib/bob.provider';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideBob({
      endpointUrl: environment.endpoint,
      bobStorageKey: 'bob',
      welcomeMessage: '👋 Hi! I\'m Bob, an AI assistant. I can find you apps, install apps to devices or even download them.'
    }),
    provideHttpClient(),
    provideAnimationsAsync(),
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
