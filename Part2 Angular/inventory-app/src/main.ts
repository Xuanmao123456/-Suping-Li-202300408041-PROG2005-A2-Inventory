import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

/**
 * Bootstrap the Angular application
 * Provides routing configuration and initializes root component
 * @param AppComponent - Root application component
 * @param provideRouter - Router provider with route configuration
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // Inject routing configuration
  ]
}).catch(err => console.error(err)); // Handle bootstrap errors