import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Help Component
 * Provides user documentation, FAQs and operation guides
 * Implements expandable FAQ section with state management
 */
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  /**
   * Frequently Asked Questions list
   * Each item includes question, answer and expanded state for accordion
   */
  faqs = [
    {
      question: 'How do I add a new inventory item?',
      answer: 'Navigate to the Inventory Operation page, fill in all required fields (Item ID and Name are mandatory), then click the "Add Item" button. The item will be added to your inventory list immediately.',
      expanded: false
    },
    {
      question: 'Can I edit an existing inventory item?',
      answer: 'Yes. In the Inventory Operation page, find the item in the inventory list and click the "Edit" button. Make your changes and click "Save Edit" to update the item information.',
      expanded: false
    },
    {
      question: 'How do I search for specific inventory items?',
      answer: 'Use the Search & Filter page to search by Item ID, Name or Category. You can also filter items by category using the dropdown menu for more precise results.',
      expanded: false
    },
    {
      question: 'Is my inventory data secure?',
      answer: 'Yes. All inventory data is protected by industry-standard security measures including encryption, access control, and regular backups. See the Privacy & Security page for detailed security requirements.',
      expanded: false
    },
    {
      question: 'What happens if I delete an item by mistake?',
      answer: 'Deleted items cannot be recovered automatically. We recommend exporting your inventory list regularly as a backup before performing bulk delete operations.',
      expanded: false
    },
    {
      question: 'Does the system work on mobile devices?',
      answer: 'Yes. The application is fully responsive and works on all mobile devices, tablets and desktop computers with the same functionality and user experience.',
      expanded: false
    }
  ];

  /**
   * Quick Start Guide steps for new users
   * Provides step-by-step onboarding for system usage
   */
  quickStartSteps = [
    {
      step: 1,
      title: 'Add Your First Item',
      description: 'Go to Inventory Operation and add your first inventory item with unique ID and name.'
    },
    {
      step: 2,
      title: 'Explore Search Function',
      description: 'Use the Search & Filter page to find items quickly by different criteria.'
    },
    {
      step: 3,
      title: 'Manage Your Inventory',
      description: 'Edit or delete items as needed to keep your inventory up to date.'
    },
    {
      step: 4,
      title: 'Review Security Settings',
      description: 'Check the Privacy & Security page to understand data protection measures.'
    }
  ];
}