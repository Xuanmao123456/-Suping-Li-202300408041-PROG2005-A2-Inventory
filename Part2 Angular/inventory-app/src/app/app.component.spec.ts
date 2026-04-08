import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Root component for Inventory Management System
 * Manages global navigation and route tracking
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inventory Manager';
  currentRoute: string = '';

  constructor(private router: Router) {
    // 监听路由变化，修复路由高亮逻辑
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  /**
   * Check if route is active (修复匹配逻辑，支持子路由)
   * @param route Route path to check
   * @returns Boolean indicating active state
   */
  isRouteActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }
}