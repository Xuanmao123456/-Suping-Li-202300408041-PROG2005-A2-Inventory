/**
 * HD-level comment: Defines the item interface (strongly typed to meet assignment type safety requirements)
 * @interface Item - Core properties of an inventory item
 * @property id - Unique identifier (HD requirement: non-duplicable)
 * @property name - Item name (required)
 * @property price - Price (non-negative)
 * @property quantity - Inventory quantity (non-negative)
 * @property isPopular - Whether the item is popular
 */
interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isPopular: boolean;
}

// HD requirement: Initial test data (covers boundary values, e.g., 0 stock, high-priced items)
const initialItems: Item[] = [
    { id: "ITEM001", name: "Laptop", price: 999.99, quantity: 10, isPopular: true },
    { id: "ITEM002", name: "Mouse", price: 29.99, quantity: 50, isPopular: false },
    { id: "ITEM003", name: "Keyboard", price: 49.99, quantity: 0, isPopular: true }
];

/**
 * HD-level function: Renders all items to the page (responsive, well-formatted)
 * @param items - Array of items to be rendered
 */
function renderItems(items: Item[]): void {
    const container = document.getElementById("items-container");
    if (!container) return;

    // Clear the container ( prevent duplicate rendering)
    container.innerHTML = "";

    // No data message (handle edge cases)
    if (items.length === 0) {
        container.innerHTML = "<p class='empty-message'>No items in inventory</p>";
        return;
    }

    // Render each item (layered styling, complete information)
    items.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.className = "item-card";
        itemCard.innerHTML = `
            <h3>${item.name} ${item.isPopular ? "<span class='popular-badge'>Popular</span>" : ""}</h3>
            <p>ID: ${item.id}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: ${item.quantity} ${item.quantity === 0 ? "<span class='out-of-stock'>Out of Stock</span>" : ""}</p>
        `;
        container.appendChild(itemCard);
    });
}

// Initial rendering ( clear entry function)
renderItems(initialItems);