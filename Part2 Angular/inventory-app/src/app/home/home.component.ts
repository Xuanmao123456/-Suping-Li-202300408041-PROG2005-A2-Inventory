import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Home Component - System Introduction & Feature Showcase
 * Provides an overview of the Inventory Management System
 * Displays core purpose and key features
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /**
   * Feature cards array for display on the home page
   * Contains icons, titles and descriptions for main system features
   */
  features = [
    {
      title: 'Inventory Operation',
      description: 'Add, edit and delete items with full data validation',
      icon: '📦'
    },
    {
      title: 'Search & Filter',
      description: 'Fuzzy search by item name, filter popular items and categories',
      icon: '🔍'
    },
    {
      title: 'Responsive Design',
      description: 'Adapt to all mobile and desktop screen sizes seamlessly',
      icon: '📱'
    },
    {
      title: 'Privacy & Security',
      description: 'Comprehensive analysis of mobile app security requirements',
      icon: '🔒'
    },
    {
      title: 'Data Integrity',
      description: 'Strict validation rules to ensure accurate inventory data',
      icon: '✅'
    },
    {
      title: 'User-Friendly Help',
      description: 'Detailed documentation and FAQs for all operations',
      icon: '❓'
    }
  ];
}