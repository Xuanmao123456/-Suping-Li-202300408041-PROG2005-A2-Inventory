/**
 * Define the Item interface to standardize the data structure of inventory items
 * @interface Item - Core properties of each inventory item
 * @property id - Unique identifier for the item (format: ITEM + 3 digits)
 * @property name - Name of the item (cannot be empty, max 50 characters)
 * @property price - Selling price of the item (non-negative, max $10000)
 * @property quantity - Inventory quantity of the item (non-negative integer)
 * @property isPopular - Mark whether the item is a popular product
 */
interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isPopular: boolean;
}

// Global inventory array to store all items
let inventoryItems: Item[] = [
    { id: "ITEM001", name: "Laptop", price: 999.99, quantity: 10, isPopular: true },
    { id: "ITEM002", name: "Mouse", price: 29.99, quantity: 50, isPopular: false },
    { id: "ITEM003", name: "Keyboard", price: 49.99, quantity: 0, isPopular: true }
];

/**
 * Render all items in the inventory array to the page
 * @param items - The array of items that need to be rendered
 * Clear the container first to avoid duplicate rendering, then render each item
 */
function renderItems(items: Item[]): void {
    const container = document.getElementById("items-container");
    if (!container) return;

    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p class='empty-message'>No items match your search/filter criteria</p>";
        return;
    }

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

/**
 * Check if the item ID is unique in the inventory
 * @param id - The item ID to be checked
 * @returns boolean - true means the ID is unique, false means duplicate
 */
function isIdUnique(id: string): boolean {
    return !inventoryItems.some(item => item.id === id.trim());
}

/**
 * Form validation function: verify all input fields
 * Check the legality of each input and display corresponding error messages
 * @returns boolean - true means validation passed, false means failed
 */
function validateForm(): boolean {
    let isValid = true;
    const id = (document.getElementById("item-id") as HTMLInputElement).value.trim();
    const name = (document.getElementById("item-name") as HTMLInputElement).value.trim();
    const price = parseFloat((document.getElementById("item-price") as HTMLInputElement).value);
    const quantity = parseInt((document.getElementById("item-quantity") as HTMLInputElement).value);

    document.querySelectorAll(".error-message").forEach(el => (el as HTMLElement).textContent = "");

    if (!id) {
        (document.getElementById("id-error") as HTMLElement).textContent = "Item ID is required";
        isValid = false;
    } else if (!/^ITEM\d{3}$/.test(id)) {
        (document.getElementById("id-error") as HTMLElement).textContent = "ID must be format: ITEM000";
        isValid = false;
    } else if (!isIdUnique(id)) {
        (document.getElementById("id-error") as HTMLElement).textContent = "ID already exists (unique required)";
        isValid = false;
    }

    if (!name) {
        (document.getElementById("name-error") as HTMLElement).textContent = "Item name is required";
        isValid = false;
    } else if (name.length > 50) {
        (document.getElementById("name-error") as HTMLElement).textContent = "Name max length: 50 characters";
        isValid = false;
    }

    if (isNaN(price) || price < 0) {
        (document.getElementById("price-error") as HTMLElement).textContent = "Price must be a non-negative number";
        isValid = false;
    } else if (price > 10000) {
        (document.getElementById("price-error") as HTMLElement).textContent = "Price exceeds maximum limit ($10000)";
        isValid = false;
    }

    if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
        (document.getElementById("quantity-error") as HTMLElement).textContent = "Quantity must be a non-negative integer";
        isValid = false;
    }

    return isValid;
}

/**
 * Handle form submission event
 * Collect form data, validate, and add new item to inventory
 * @param e - Form submission event object
 */
function handleFormSubmit(e: Event): void {
    e.preventDefault();
    if (!validateForm()) return;

    const newItem: Item = {
        id: (document.getElementById("item-id") as HTMLInputElement).value.trim(),
        name: (document.getElementById("item-name") as HTMLInputElement).value.trim(),
        price: parseFloat((document.getElementById("item-price") as HTMLInputElement).value),
        quantity: parseInt((document.getElementById("item-quantity") as HTMLInputElement).value),
        isPopular: (document.getElementById("item-popular") as HTMLInputElement).checked
    };

    inventoryItems.push(newItem);
    renderItems(inventoryItems);
    (document.getElementById("add-item-form") as HTMLFormElement).reset();
    alert("Item added successfully!");
}

/**
 * Search items by ID or name (case-insensitive)
 * @param keyword - Search keyword entered by the user
 * @returns Filtered item array matching the keyword
 */
function searchItems(keyword: string): Item[] {
    if (!keyword.trim()) return inventoryItems; // Return all items if keyword is empty
    const lowerKeyword = keyword.toLowerCase();
    return inventoryItems.filter(item =>
        item.id.toLowerCase().includes(lowerKeyword) ||
        item.name.toLowerCase().includes(lowerKeyword)
    );
}

/**
 * Filter items by "popular" status
 * @param items - The item array to be filtered
 * @param showOnlyPopular - Whether to show only popular items
 * @returns Filtered item array based on popular status
 */
function filterPopularItems(items: Item[], showOnlyPopular: boolean): Item[] {
    if (!showOnlyPopular) return items; // Return original array if filter is off
    return items.filter(item => item.isPopular);
}

/**
 * Handle search button click event
 * Combine search and filter logic, then re-render items
 */
function handleSearch(): void {
    const keyword = (document.getElementById("search-input") as HTMLInputElement).value;
    const showPopular = (document.getElementById("filter-popular") as HTMLInputElement).checked;

    let filteredItems = searchItems(keyword);
    filteredItems = filterPopularItems(filteredItems, showPopular);
    renderItems(filteredItems);
}

/**
 * Reset search input and filter checkbox, re-render all items
 */
function handleReset(): void {
    (document.getElementById("search-input") as HTMLInputElement).value = "";
    (document.getElementById("filter-popular") as HTMLInputElement).checked = false;
    renderItems(inventoryItems);
}

// Bind events
document.getElementById("add-item-form")?.addEventListener("submit", handleFormSubmit);
document.getElementById("search-btn")?.addEventListener("click", handleSearch);
document.getElementById("reset-btn")?.addEventListener("click", handleReset);
document.getElementById("filter-popular")?.addEventListener("change", handleSearch); // Filter on checkbox change

// Initial render
renderItems(inventoryItems);