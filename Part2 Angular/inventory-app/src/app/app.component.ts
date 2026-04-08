import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Root component for the Inventory Management System
 * Manages global navigation bar and application layout
 * Implements route tracking for active navigation highlighting
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // Required for routing directives
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Application main title
  title = 'Inventory Management System';
  // Current active route path
  currentRoute: string = '';

  /**
   * Constructor initializes router and subscribes to route changes
   * @param router - Angular Router service for navigation management
   */
  constructor(private router: Router) {
    // Subscribe to router events to track current route
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  /**
   * Checks if a specific route is currently active
   * Used to apply active style to navigation links
   * @param route - Route path to check (e.g., '/home')
   * @returns Boolean indicating if route is active
   */
  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }
}