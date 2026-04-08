import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Privacy & Security Component
 * Displays privacy policy and security information for the inventory system
 */
@Component({
  selector: 'app-privacy-security',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-security.component.html',
  styleUrls: ['./privacy-security.component.css']
})
export class PrivacySecurityComponent {
  // Component logic for privacy/security content
}