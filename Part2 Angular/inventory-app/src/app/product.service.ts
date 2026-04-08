import { Injectable } from '@angular/core';
import { Product } from './product';

/**
 * ProductService provides core data operations for inventory management
 * Handles product retrieval, addition, deletion, update and filtering operations
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock product data with standard asset paths
  private products: Product[] = [
    { 
      id: 'ITEM001', 
      name: 'Wireless Mouse', 
      price: 29.99, 
      quantity: 50, 
      imageUrl: 'assets/images/ITEM001.jpg',
      category: 'Peripherals'
    },
    { 
      id: 'ITEM002', 
      name: 'Mechanical Keyboard', 
      price: 89.99, 
      quantity: 30, 
      imageUrl: 'assets/images/ITEM002.jpg',
      category: 'Peripherals'
    },
    { 
      id: 'ITEM003', 
      name: '27" Monitor', 
      price: 249.99, 
      quantity: 15, 
      imageUrl: 'assets/images/ITEM003.jpg',
      category: 'Displays'
    }
  ];

  /**
   * Retrieves all products from inventory
   * @returns Copy of product array to prevent direct mutation
   */
  getProducts(): Product[] {
    return [...this.products];
  }

  /**
   * Finds a product by its unique ID
   * @param productId - Unique identifier of the product to find
   * @returns Matching Product object or undefined if not found
   */
  getProductById(productId: string): Product | undefined {
    return this.products.find(product => product.id === productId);
  }

  /**
   * Deletes a product from inventory by ID
   * @param productId - Unique identifier of the product to delete
   */
  deleteProduct(productId: string): void {
    const index = this.products.findIndex(product => product.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  /**
   * Updates an existing product's details
   * @param updatedProduct - Product object with updated values
   */
  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = { ...updatedProduct };
    }
  }

  /**
   * Adds a new product to inventory
   * @param newProduct - New Product object to add
   */
  addProduct(newProduct: Product): void {
    this.products.push({ ...newProduct });
  }

  /**
   * Filters products by category
   * @param category - Category to filter by
   * @returns Filtered array of products
   */
  getProductsByCategory(category: string): Product[] {
    if (!category) return this.getProducts();
    return this.products.filter(product => product.category === category);
  }

  /**
   * Gets all unique product categories
   * @returns Array of category names
   */
  getCategories(): string[] {
    return [...new Set(this.products.map(product => product.category || 'Uncategorized'))];
  }
}