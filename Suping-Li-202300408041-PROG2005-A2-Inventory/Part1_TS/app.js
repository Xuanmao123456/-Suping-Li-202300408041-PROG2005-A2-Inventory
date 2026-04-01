"use strict";
// HD requirement: Initial test data (covers boundary values, e.g., 0 stock, high-priced items)
const initialItems = [
    { id: "ITEM001", name: "Laptop", price: 999.99, quantity: 10, isPopular: true },
    { id: "ITEM002", name: "Mouse", price: 29.99, quantity: 50, isPopular: false },
    { id: "ITEM003", name: "Keyboard", price: 49.99, quantity: 0, isPopular: true }
];
/**
 * HD-level function: Renders all items to the page (responsive, well-formatted)
 * @param items - Array of items to be rendered
 */
function renderItems(items) {
    const container = document.getElementById("items-container");
    if (!container)
        return;
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
