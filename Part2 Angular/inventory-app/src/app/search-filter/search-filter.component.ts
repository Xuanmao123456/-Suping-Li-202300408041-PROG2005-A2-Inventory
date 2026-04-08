import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory.service';

/**
 * Search & Filter Component
 * Retrieves inventory data from shared service
 * Implements fuzzy search and category filtering
 */
@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent {
  // Search input value
  searchTerm: string = '';
  // Selected category for filtering
  selectedCategory: string = '';
  // Filtered results to display in template
  filteredResults: any[] = [];

  constructor(private inventoryService: InventoryService) {
    // Initialize with full inventory list on component load
    this.filteredResults = this.inventoryService.getItems();
  }

  /**
   * Filter inventory items based on search term and category
   */
  filterItems(): void {
    let items = this.inventoryService.getItems();

    // Apply fuzzy search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      items = items.filter(item =>
        item.itemId.toLowerCase().includes(term) ||
        item.itemName.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      items = items.filter(item => item.category === this.selectedCategory);
    }

    this.filteredResults = items;
  }

  /**
   * Reset all filters and show full inventory list
   */
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filteredResults = this.inventoryService.getItems();
  }

  /**
   * Get unique categories for filter dropdown
   * @returns Array of unique category names
   */
  getUniqueCategories(): string[] {
    const items = this.inventoryService.getItems();
    return Array.from(new Set(items.map(item => item.category)));
  }
}