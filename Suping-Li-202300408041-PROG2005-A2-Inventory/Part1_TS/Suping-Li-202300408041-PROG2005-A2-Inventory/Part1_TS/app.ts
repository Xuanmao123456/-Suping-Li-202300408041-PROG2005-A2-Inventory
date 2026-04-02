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
// Changed from const to let to support adding new items
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
    if (!container) return; // Exit if the container is not found

    container.innerHTML = ""; // Clear existing content

    // Display prompt when there are no items in the inventory
    if (items.length === 0) {
        container.innerHTML = "No items in inventory";
        return;
    }

    // Traverse the items array and render each item as a card
    items.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.className = "item-card";
        // Use template strings to splice item information, add popular badge and out-of-stock prompt
        itemCard.innerHTML = `
            ${item.name} ${item.isPopular ? "Popular" : ""}ID: ${item.id}Price: $${item.price.toFixed(2)}Quantity: ${item.quantity} ${item.quantity === 0 ? "Out of Stock" : ""}
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
    // Get input values and process (trim whitespace, type conversion)
    const id = (document.getElementById("item-id") as HTMLInputElement).value.trim();
    const name = (document.getElementById("item-name") as HTMLInputElement).value.trim();
    const price = parseFloat((document.getElementById("item-price") as HTMLInputElement).value);
    const quantity = parseInt((document.getElementById("item-quantity") as HTMLInputElement).value);

    // Clear all previous error messages before validation
    document.querySelectorAll(".error-message").forEach(el => (el as HTMLElement).textContent = "");

    // ID validation: non-empty, correct format, unique
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

    // Name validation: non-empty, max length 50 characters
    if (!name) {
        (document.getElementById("name-error") as HTMLElement).textContent = "Item name is required";
        isValid = false;
    } else if (name.length > 50) {
        (document.getElementById("name-error") as HTMLElement).textContent = "Name max length: 50 characters";
        isValid = false;
    }

    // Price validation: non-negative number, max $10000
    if (isNaN(price) || price < 0) {
        (document.getElementById("price-error") as HTMLElement).textContent = "Price must be a non-negative number";
        isValid = false;
    } else if (price > 10000) {
        (document.getElementById("price-error") as HTMLElement).textContent = "Price exceeds maximum limit ($10000)";
        isValid = false;
    }

    // Quantity validation: non-negative integer
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
    e.preventDefault(); // Prevent default form submission behavior

    // If form validation fails, exit the function
    if (!validateForm()) return;

    // Collect form data and convert to Item type
    const newItem: Item = {
        id: (document.getElementById("item-id") as HTMLInputElement).value.trim(),
        name: (document.getElementById("item-name") as HTMLInputElement).value.trim(),
        price: parseFloat((document.getElementById("item-price") as HTMLInputElement).value),
        quantity: parseInt((document.getElementById("item-quantity") as HTMLInputElement).value),
        isPopular: (document.getElementById("item-popular") as HTMLInputElement).checked
    };

    // Add the new item to the global inventory array
    inventoryItems.push(newItem);

    // Re-render the item list to display the new item
    renderItems(inventoryItems);

    // Reset the form to facilitate next input
    (document.getElementById("add-item-form") as HTMLFormElement).reset();

    // Pop up a prompt to inform the user that the item was added successfully
    alert("Item added successfully!");
}

// Bind the form submission event to the form element
document.getElementById("add-item-form")?.addEventListener("submit", handleFormSubmit);

// Render the initial item list when the page loads
renderItems(inventoryItems);