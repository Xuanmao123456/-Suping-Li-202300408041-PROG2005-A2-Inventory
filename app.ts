/**
 * Core interface for inventory items - standardizes data structure
 * Ensures type safety and consistent data handling across the application
 */
interface InventoryItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isPopular: boolean;
}

// Global inventory data - initial sample items for demonstration
const INITIAL_INVENTORY: InventoryItem[] = [
    { id: "ITEM001", name: "Laptop", price: 999.99, quantity: 10, isPopular: true },
    { id: "ITEM002", name: "Wireless Mouse", price: 29.99, quantity: 50, isPopular: false },
    { id: "ITEM003", name: "Mechanical Keyboard", price: 49.99, quantity: 0, isPopular: true }
];

// State management - reactive inventory data
let inventoryItems: InventoryItem[] = [...INITIAL_INVENTORY];
// Track current edit item ID (Day4 New Feature)
let currentEditItemId: string = "";

/**
 * DOM Element References - centralized for better maintainability
 */
const DOM_ELEMENTS = {
    // Form Elements
    form: document.getElementById("add-item-form") as HTMLFormElement,
    submitBtn: document.getElementById("submit-btn") as HTMLButtonElement,
    submitSpinner: document.getElementById("submit-spinner") as HTMLSpanElement,
    cancelEditBtn: document.getElementById("cancel-edit-btn") as HTMLButtonElement,
    formTitle: document.getElementById("form-title") as HTMLHeadingElement,
    editItemIdInput: document.getElementById("edit-item-id") as HTMLInputElement,

    // Inputs
    idInput: document.getElementById("item-id") as HTMLInputElement,
    nameInput: document.getElementById("item-name") as HTMLInputElement,
    priceInput: document.getElementById("item-price") as HTMLInputElement,
    quantityInput: document.getElementById("item-quantity") as HTMLInputElement,
    popularInput: document.getElementById("item-popular") as HTMLInputElement,

    // Error Messages
    idError: document.getElementById("id-error") as HTMLSpanElement,
    nameError: document.getElementById("name-error") as HTMLSpanElement,
    priceError: document.getElementById("price-error") as HTMLSpanElement,
    quantityError: document.getElementById("quantity-error") as HTMLSpanElement,

    // Search & Filter
    searchInput: document.getElementById("search-input") as HTMLInputElement,
    searchBtn: document.getElementById("search-btn") as HTMLButtonElement,
    resetBtn: document.getElementById("reset-btn") as HTMLButtonElement,
    filterPopular: document.getElementById("filter-popular") as HTMLInputElement,

    // Inventory List
    itemsContainer: document.getElementById("items-container") as HTMLDivElement,
    emptyState: document.getElementById("empty-state") as HTMLDivElement,
    clearInventoryBtn: document.getElementById("clear-inventory-btn") as HTMLButtonElement,

    // Modal (Day4 New Feature)
    confirmationModal: document.getElementById("confirmation-modal") as HTMLDivElement,
    modalTitle: document.getElementById("modal-title") as HTMLHeadingElement,
    modalMessage: document.getElementById("modal-message") as HTMLParagraphElement,
    modalCancelBtn: document.getElementById("modal-cancel-btn") as HTMLButtonElement,
    modalConfirmBtn: document.getElementById("modal-confirm-btn") as HTMLButtonElement
};

/**
 * Render inventory items to the DOM with visual hierarchy
 * Handles empty state and item card styling based on stock/popularity
 * Adds edit/delete buttons for each item (Day4 New Feature)
 * @param items - Filtered inventory items to render
 */
function renderInventory(items: InventoryItem[]): void {
    // Clear existing content
    DOM_ELEMENTS.itemsContainer.innerHTML = "";

    // Handle empty state
    if (items.length === 0) {
        DOM_ELEMENTS.emptyState.classList.remove("hidden");
        return;
    }
    DOM_ELEMENTS.emptyState.classList.add("hidden");

    // Render item cards
    items.forEach(item => {
        const itemCard = document.createElement("div");
        // Add conditional classes for visual feedback
        itemCard.className = `item-card ${item.quantity === 0 ? "out-of-stock-card" : ""} ${item.isPopular ? "popular-card" : ""}`;

        // Card content with edit/delete buttons (Day4 New)
        itemCard.innerHTML = `
            <div class="item-header">
                <h3 class="item-name">${item.name}</h3>
                ${item.isPopular ? '<span class="badge popular-badge">Popular</span>' : ""}
            </div>
            <div class="item-details">
                <p class="item-id"><strong>ID:</strong> ${item.id}</p>
                <p class="item-price"><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                <p class="item-quantity">
                    <strong>Quantity:</strong> ${item.quantity}
                    ${item.quantity === 0 ? '<span class="badge out-of-stock-badge">Out of Stock</span>' : ""}
                </p>
            </div>
            <div class="item-actions">
                <button class="btn edit-btn" data-id="${item.id}">Edit</button>
                <button class="btn delete-btn" data-id="${item.id}">Delete</button>
            </div>
        `;

        // Add smooth fade-in animation
        itemCard.style.opacity = "0";
        DOM_ELEMENTS.itemsContainer.appendChild(itemCard);
        // Trigger reflow before animation
        setTimeout(() => itemCard.style.opacity = "1", 10);

        // Add event listeners for edit/delete buttons (Day4 New)
        itemCard.querySelector<HTMLButtonElement>(".edit-btn")?.addEventListener("click", () => handleEditItem(item.id));
        itemCard.querySelector<HTMLButtonElement>(".delete-btn")?.addEventListener("click", () => handleDeleteItem(item.id));
    });
}

/**
 * Validate item ID format and uniqueness
 * Real-time validation on input blur
 * Skips uniqueness check when editing existing item (Day4 Adjustment)
 * @param id - Item ID to validate
 * @returns Validation result with error message (if any)
 */
function validateItemId(id: string): { valid: boolean; message: string } {
    const trimmedId = id.trim();

    // Required check
    if (!trimmedId) {
        return { valid: false, message: "Item ID is required" };
    }

    // Format check (ITEM + 3 digits)
    const idPattern = /^ITEM\d{3}$/;
    if (!idPattern.test(trimmedId)) {
        return { valid: false, message: "ID must follow format: ITEM000 (e.g. ITEM004)" };
    }

    // Uniqueness check - skip if editing existing item (Day4 Adjustment)
    if (currentEditItemId !== trimmedId && inventoryItems.some(item => item.id === trimmedId)) {
        return { valid: false, message: "This ID already exists (must be unique)" };
    }

    return { valid: true, message: "" };
}

/**
 * Validate item name (required + length constraint)
 * @param name - Item name to validate
 * @returns Validation result with error message (if any)
 */
function validateItemName(name: string): { valid: boolean; message: string } {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return { valid: false, message: "Item name is required" };
    }

    if (trimmedName.length > 50) {
        return { valid: false, message: "Name cannot exceed 50 characters" };
    }

    return { valid: true, message: "" };
}

/**
 * Validate item price (non-negative + max limit)
 * @param price - Price value to validate
 * @returns Validation result with error message (if any)
 */
function validateItemPrice(price: string): { valid: boolean; message: string } {
    const priceNum = parseFloat(price);

    if (isNaN(priceNum)) {
        return { valid: false, message: "Price must be a valid number" };
    }

    if (priceNum < 0) {
        return { valid: false, message: "Price cannot be negative" };
    }

    if (priceNum > 10000) {
        return { valid: false, message: "Price cannot exceed $10,000" };
    }

    return { valid: true, message: "" };
}

/**
 * Validate item quantity (non-negative integer)
 * @param quantity - Quantity value to validate
 * @returns Validation result with error message (if any)
 */
function validateItemQuantity(quantity: string): { valid: boolean; message: string } {
    const quantityNum = parseInt(quantity);

    if (isNaN(quantityNum)) {
        return { valid: false, message: "Quantity must be a valid number" };
    }

    if (quantityNum < 0) {
        return { valid: false, message: "Quantity cannot be negative" };
    }

    if (!Number.isInteger(quantityNum)) {
        return { valid: false, message: "Quantity must be a whole number" };
    }

    return { valid: true, message: "" };
}

/**
 * Real-time form validation for individual fields
 * Attaches blur event listeners to all form inputs
 */
function initRealTimeValidation(): void {
    // ID validation on blur
    DOM_ELEMENTS.idInput.addEventListener("blur", () => {
        const { valid, message } = validateItemId(DOM_ELEMENTS.idInput.value);
        DOM_ELEMENTS.idError.textContent = message;
        DOM_ELEMENTS.idInput.classList.toggle("invalid-input", !valid);
    });

    // Name validation on blur
    DOM_ELEMENTS.nameInput.addEventListener("blur", () => {
        const { valid, message } = validateItemName(DOM_ELEMENTS.nameInput.value);
        DOM_ELEMENTS.nameError.textContent = message;
        DOM_ELEMENTS.nameInput.classList.toggle("invalid-input", !valid);
    });

    // Price validation on blur
    DOM_ELEMENTS.priceInput.addEventListener("blur", () => {
        const { valid, message } = validateItemPrice(DOM_ELEMENTS.priceInput.value);
        DOM_ELEMENTS.priceError.textContent = message;
        DOM_ELEMENTS.priceInput.classList.toggle("invalid-input", !valid);
    });

    // Quantity validation on blur
    DOM_ELEMENTS.quantityInput.addEventListener("blur", () => {
        const { valid, message } = validateItemQuantity(DOM_ELEMENTS.quantityInput.value);
        DOM_ELEMENTS.quantityError.textContent = message;
        DOM_ELEMENTS.quantityInput.classList.toggle("invalid-input", !valid);
    });
}

/**
 * Full form validation (called on submit)
 * @returns True if all fields are valid, false otherwise
 */
function validateForm(): boolean {
    let isFormValid = true;

    // Validate all fields
    const idValidation = validateItemId(DOM_ELEMENTS.idInput.value);
    const nameValidation = validateItemName(DOM_ELEMENTS.nameInput.value);
    const priceValidation = validateItemPrice(DOM_ELEMENTS.priceInput.value);
    const quantityValidation = validateItemQuantity(DOM_ELEMENTS.quantityInput.value);

    // Update error messages and input styles
    DOM_ELEMENTS.idError.textContent = idValidation.message;
    DOM_ELEMENTS.idInput.classList.toggle("invalid-input", !idValidation.valid);

    DOM_ELEMENTS.nameError.textContent = nameValidation.message;
    DOM_ELEMENTS.nameInput.classList.toggle("invalid-input", !nameValidation.valid);

    DOM_ELEMENTS.priceError.textContent = priceValidation.message;
    DOM_ELEMENTS.priceInput.classList.toggle("invalid-input", !priceValidation.valid);

    DOM_ELEMENTS.quantityError.textContent = quantityValidation.message;
    DOM_ELEMENTS.quantityInput.classList.toggle("invalid-input", !quantityValidation.valid);

    // Check overall validity
    isFormValid = idValidation.valid && nameValidation.valid && priceValidation.valid && quantityValidation.valid;

    return isFormValid;
}

/**
 * Handle form submission (Add/Edit Mode)
 * Supports both adding new items and updating existing items (Day4 Core Feature)
 * @param e - Form submit event
 */
async function handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) return;

    // Show loading state
    DOM_ELEMENTS.submitBtn.disabled = true;
    DOM_ELEMENTS.submitSpinner.classList.remove("hidden");
    const originalBtnText = DOM_ELEMENTS.submitBtn.querySelector(".btn-text")!.textContent;
    DOM_ELEMENTS.submitBtn.querySelector(".btn-text")!.textContent = currentEditItemId ? "Updating..." : "Adding...";

    try {
        // Simulate API delay (for realistic loading feedback)
        await new Promise(resolve => setTimeout(resolve, 800));

        const newItem: InventoryItem = {
            id: DOM_ELEMENTS.idInput.value.trim(),
            name: DOM_ELEMENTS.nameInput.value.trim(),
            price: parseFloat(DOM_ELEMENTS.priceInput.value),
            quantity: parseInt(DOM_ELEMENTS.quantityInput.value),
            isPopular: DOM_ELEMENTS.popularInput.checked
        };

        if (currentEditItemId) {
            // Edit Mode: Update existing item (Day4 New)
            const itemIndex = inventoryItems.findIndex(item => item.id === currentEditItemId);
            if (itemIndex !== -1) {
                // Preserve ID if user didn't change it (prevent duplicate ID issues)
                newItem.id = currentEditItemId;
                inventoryItems[itemIndex] = newItem;
                alert(`Item ${currentEditItemId} updated successfully!`);
            }
            // Exit edit mode
            cancelEditMode();
        } else {
            // Add Mode: Create new item
            inventoryItems.push(newItem);
            alert("Item added successfully to inventory!");
        }

        // Re-render inventory
        applySearchAndFilter();

        // Reset form
        DOM_ELEMENTS.form.reset();
        // Clear error states
        document.querySelectorAll(".error-message").forEach(el => (el as HTMLSpanElement).textContent = "");
        document.querySelectorAll(".invalid-input").forEach(el => el.classList.remove("invalid-input"));

    } catch (error) {
        console.error("Error processing item:", error);
        alert(currentEditItemId ? "Failed to update item. Please try again." : "Failed to add item. Please try again.");
    } finally {
        // Hide loading state
        DOM_ELEMENTS.submitBtn.disabled = false;
        DOM_ELEMENTS.submitSpinner.classList.add("hidden");
        DOM_ELEMENTS.submitBtn.querySelector(".btn-text")!.textContent = originalBtnText;
    }
}

/**
 * Enter edit mode for selected item (Day4 Core Feature)
 * Populates form with item data and updates UI for edit state
 * @param itemId - ID of the item to edit
 */
function handleEditItem(itemId: string): void {
    const itemToEdit = inventoryItems.find(item => item.id === itemId);
    if (!itemToEdit) return;

    // Set current edit state
    currentEditItemId = itemId;
    DOM_ELEMENTS.editItemIdInput.value = itemId;

    // Populate form with item data
    DOM_ELEMENTS.idInput.value = itemToEdit.id;
    DOM_ELEMENTS.nameInput.value = itemToEdit.name;
    DOM_ELEMENTS.priceInput.value = itemToEdit.price.toString();
    DOM_ELEMENTS.quantityInput.value = itemToEdit.quantity.toString();
    DOM_ELEMENTS.popularInput.checked = itemToEdit.isPopular;

    // Update UI for edit mode
    DOM_ELEMENTS.formTitle.textContent = `Edit Item: ${itemId}`;
    DOM_ELEMENTS.submitBtn.querySelector(".btn-text")!.textContent = "Update Item";
    DOM_ELEMENTS.cancelEditBtn.style.display = "inline-block";

    // Disable ID input to prevent changing (optional but recommended)
    DOM_ELEMENTS.idInput.disabled = true;

    // Scroll to form for better UX
    DOM_ELEMENTS.form.scrollIntoView({ behavior: "smooth" });
}

/**
 * Exit edit mode and reset form to add mode (Day4 New Feature)
 */
function cancelEditMode(): void {
    currentEditItemId = "";
    DOM_ELEMENTS.editItemIdInput.value = "";

    // Reset form UI
    DOM_ELEMENTS.formTitle.textContent = "Add New Inventory Item";
    DOM_ELEMENTS.submitBtn.querySelector(".btn-text")!.textContent = "Add Item";
    DOM_ELEMENTS.cancelEditBtn.style.display = "none";

    // Re-enable ID input
    DOM_ELEMENTS.idInput.disabled = false;

    // Clear form and errors
    DOM_ELEMENTS.form.reset();
    document.querySelectorAll(".error-message").forEach(el => (el as HTMLSpanElement).textContent = "");
    document.querySelectorAll(".invalid-input").forEach(el => el.classList.remove("invalid-input"));
}

/**
 * Handle item deletion with confirmation (Day4 Core Feature)
 * Shows modal to confirm deletion before removing item
 * @param itemId - ID of the item to delete
 */
function handleDeleteItem(itemId: string): void {
    // Configure confirmation modal
    DOM_ELEMENTS.modalTitle.textContent = "Confirm Deletion";
    DOM_ELEMENTS.modalMessage.textContent = `Are you sure you want to delete item ${itemId}? This action cannot be undone.`;

    // Show modal
    DOM_ELEMENTS.confirmationModal.classList.remove("hidden");

    // Set up confirm action
    const confirmDelete = () => {
        // Remove item from inventory
        inventoryItems = inventoryItems.filter(item => item.id !== itemId);
        // Re-render inventory
        applySearchAndFilter();
        // Hide modal
        DOM_ELEMENTS.confirmationModal.classList.add("hidden");
        // Success feedback
        alert(`Item ${itemId} deleted successfully!`);

        // Clean up event listeners
        DOM_ELEMENTS.modalConfirmBtn.removeEventListener("click", confirmDelete);
    };

    // Add confirm listener
    DOM_ELEMENTS.modalConfirmBtn.addEventListener("click", confirmDelete);
}

/**
 * Handle bulk clear inventory with confirmation (Day4 New Feature)
 */
function handleClearInventory(): void {
    // Configure confirmation modal
    DOM_ELEMENTS.modalTitle.textContent = "Confirm Clear All";
    DOM_ELEMENTS.modalMessage.textContent = "Are you sure you want to delete ALL inventory items? This action cannot be undone.";

    // Show modal
    DOM_ELEMENTS.confirmationModal.classList.remove("hidden");

    // Set up confirm action
    const confirmClear = () => {
        // Clear all items
        inventoryItems = [];
        // Re-render inventory
        applySearchAndFilter();
        // Hide modal
        DOM_ELEMENTS.confirmationModal.classList.add("hidden");
        // Success feedback
        alert("All inventory items have been cleared!");

        // Clean up event listeners
        DOM_ELEMENTS.modalConfirmBtn.removeEventListener("click", confirmClear);
    };

    // Add confirm listener
    DOM_ELEMENTS.modalConfirmBtn.addEventListener("click", confirmClear);
}

/**
 * Close confirmation modal without action (Day4 New Feature)
 */
function closeModal(): void {
    DOM_ELEMENTS.confirmationModal.classList.add("hidden");
    // Remove any existing confirm listeners
    DOM_ELEMENTS.modalConfirmBtn.replaceWith(DOM_ELEMENTS.modalConfirmBtn.cloneNode(true));
}

/**
 * Search items by ID or name (case-insensitive, partial match) - Day3 Core Feature
 * @param keyword - Search term entered by user
 * @returns Filtered inventory array
 */
function searchInventory(keyword: string): InventoryItem[] {
    if (!keyword.trim()) return [...inventoryItems];

    const lowerKeyword = keyword.toLowerCase().trim();
    return inventoryItems.filter(item =>
        item.id.toLowerCase().includes(lowerKeyword) ||
        item.name.toLowerCase().includes(lowerKeyword)
    );
}

/**
 * Filter inventory by popular status - Day3 Core Feature
 * @param items - Inventory array to filter
 * @param showOnlyPopular - Whether to show only popular items
 * @returns Filtered inventory array
 */
function filterByPopular(items: InventoryItem[], showOnlyPopular: boolean): InventoryItem[] {
    if (!showOnlyPopular) return [...items];
    return items.filter(item => item.isPopular);
}

/**
 * Apply both search and filter, then re-render inventory - Day3 Core Logic
 */
function applySearchAndFilter(): void {
    const searchTerm = DOM_ELEMENTS.searchInput.value;
    const showPopular = DOM_ELEMENTS.filterPopular.checked;

    let filteredItems = searchInventory(searchTerm);
    filteredItems = filterByPopular(filteredItems, showPopular);

    renderInventory(filteredItems);
}

/**
 * Reset search/filter to default state - Day3 Feature
 */
function resetSearchAndFilter(): void {
    DOM_ELEMENTS.searchInput.value = "";
    DOM_ELEMENTS.filterPopular.checked = false;
    applySearchAndFilter();
}

/**
 * Initialize all event listeners and render initial inventory
 */
function initApp(): void {
    // Initial render
    renderInventory(inventoryItems);

    // Real-time validation
    initRealTimeValidation();

    // Form submission (Add/Edit)
    DOM_ELEMENTS.form.addEventListener("submit", handleFormSubmit);

    // Edit mode cancel
    DOM_ELEMENTS.cancelEditBtn.addEventListener("click", cancelEditMode);

    // Search/filter events (Day3 Core)
    DOM_ELEMENTS.searchBtn.addEventListener("click", applySearchAndFilter);
    DOM_ELEMENTS.resetBtn.addEventListener("click", resetSearchAndFilter);
    DOM_ELEMENTS.filterPopular.addEventListener("change", applySearchAndFilter);
    // Search on Enter key
    DOM_ELEMENTS.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") applySearchAndFilter();
    });

    // Day4 New Events
    DOM_ELEMENTS.clearInventoryBtn.addEventListener("click", handleClearInventory);
    DOM_ELEMENTS.modalCancelBtn.addEventListener("click", closeModal);
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);