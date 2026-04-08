/**
 * Product interface defines the structure of inventory product data
 * Contains core properties for product identification and display
 */
export interface Product {
  /** Unique identifier for the product (e.g., "ITEM001") */
  id: string;
  /** Name/title of the product */
  name: string;
  /** Price of the product in currency (e.g., 19.99) */
  price: number;
  /** Quantity available in inventory */
  quantity: number;
  /** Optional image path for product display */
  imageUrl?: string;
  /** Product category for filtering */
  category?: string;
}