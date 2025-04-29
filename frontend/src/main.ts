import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeMetrics } from './metrics';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Initialize metrics before bootstrapping the application
initializeMetrics();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err)); 