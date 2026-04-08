import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory.service';

/**
 * Inventory Operation Component
 * Handles add, edit, delete operations with ID validation, statistics and popular items
 */
@Component({
  selector: 'app-inventory-operation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-operation.component.html',
  styleUrls: ['./inventory-operation.component.css']
})
export class InventoryOperationComponent {
  // Form model for inventory item
  inventoryItem = {
    itemId: '',
    itemName: '',
    category: '',
    price: '',
    quantity: '',
    supplier: '',
    stockStatus: 'In Stock',
    popularItem: 'Yes',
    description: ''
  };

  // Local inventory list synced with shared service
  inventoryList: any[] = [];
  // Edit mode flags
  isEditMode = false;
  currentEditIndex: number = -1;

  constructor(private inventoryService: InventoryService) {
    // Initialize list from service on component load
    this.inventoryList = this.inventoryService.getItems();
  }

  /**
   * Check if item ID already exists in inventory
   * @param id - Item ID to validate
   * @returns True if ID exists, false otherwise
   */
  isIdExists(id: string): boolean {
    return this.inventoryList.some(item => item.itemId === id);
  }

  /**
   * Add new inventory item with ID validation
   */
  addItem(): void {
    // Required field validation
    if (!this.inventoryItem.itemId || !this.inventoryItem.itemName) {
      alert('Error: Item ID and Name are required fields!');
      return;
    }

    // Duplicate ID validation
    if (this.isIdExists(this.inventoryItem.itemId)) {
      alert('Error: Item ID already exists! Please use a unique ID.');
      return;
    }

    // Add item to list and sync to service
    this.inventoryList.push({ ...this.inventoryItem });
    this.inventoryService.updateList(this.inventoryList);
    this.resetForm();
    alert('Item added successfully!');
  }

  /**
   * Load item into form for editing
   * @param index - Index of item to edit
   */
  loadItemForEdit(index: number): void {
    this.isEditMode = true;
    this.currentEditIndex = index;
    this.inventoryItem = { ...this.inventoryList[index] };
  }

  /**
   * Save edited item back to inventory list
   */
  saveEdit(): void {
    // Required field validation
    if (!this.inventoryItem.itemId || !this.inventoryItem.itemName) {
      alert('Error: Item ID and Name cannot be empty!');
      return;
    }

    // Update item and sync to service
    this.inventoryList[this.currentEditIndex] = { ...this.inventoryItem };
    this.inventoryService.updateList(this.inventoryList);
    this.resetForm();
    this.isEditMode = false;
    alert('Item updated successfully!');
  }

  /**
   * Delete item from inventory list
   * @param index - Index of item to delete
   */
  deleteItem(index: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryList.splice(index, 1);
      this.inventoryService.updateList(this.inventoryList);
      alert('Item deleted successfully!');
    }
  }

  /**
   * Reset form to initial empty state
   */
  resetForm(): void {
    this.inventoryItem = {
      itemId: '',
      itemName: '',
      category: '',
      price: '',
      quantity: '',
      supplier: '',
      stockStatus: 'In Stock',
      popularItem: 'Yes',
      description: ''
    };
    this.isEditMode = false;
    this.currentEditIndex = -1;
  }

  /**
   * Get total number of unique items in inventory
   * @returns Total item count
   */
  getTotalItems(): number {
    return this.inventoryList.length;
  }

  /**
   * Get total quantity of all items in stock
   * @returns Sum of all item quantities
   */
  getTotalQuantity(): number {
    return this.inventoryList.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }

  /**
   * Get total value of all inventory items (price * quantity)
   * @returns Total inventory value
   */
  getTotalValue(): number {
    return this.inventoryList.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }

  /**
   * Get list of popular items (Popular Item = Yes)
   * @returns Array of popular items
   */
  getPopularItems(): any[] {
    return this.inventoryList.filter(item => item.popularItem === 'Yes');
  }
}