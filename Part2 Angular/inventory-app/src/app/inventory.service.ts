import { Injectable } from '@angular/core';

/**
 * Shared service to manage inventory data across components
 * Ensures data persistence between page navigation
 */
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Private inventory list storage
  private inventoryList: any[] = [];

  /**
   * Get a copy of current inventory list
   * @returns Copy of inventory array to prevent direct mutation
   */
  getItems(): any[] {
    return [...this.inventoryList];
  }

  /**
   * Update inventory list with new data
   * @param list - New inventory array to save
   */
  updateList(list: any[]): void {
    this.inventoryList = [...list];
  }
}