// Required Top-Level Calculation Functions

function calculateItemAmount(price, quantity) {
    return price * quantity;
}

function calculateDiscount(subtotal) {
    let discountRate = 0;
    if (subtotal >= 5000) {
        discountRate = 0.10;
    } else if (subtotal >= 3000) {
        discountRate = 0.07;
    } else if (subtotal >= 1000) {
        discountRate = 0.05;
    } else {
        discountRate = 0;
    }
    return subtotal * discountRate;
}

function getDeliveryFee(option) {
    let fee = 0;
    switch (Number(option)) {
        case 1:
            fee = 0;
            break;
        case 2:
            fee = 80;
            break;
        case 3:
            fee = 150;
            break;
        default:
            fee = 0;
    }
    return fee;
}

// Dynamic Field Generation based on productCount
function generateProductFields() {
    const productCountInput = document.getElementById("productCount");
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    const count = parseInt(productCountInput.value);
    if (isNaN(count) || count <= 0) return;

    // Required for loop for product generation
    for (let n = 0; n < count; n++) {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
            <p><strong>Product ${n + 1}</strong></p>
            <div>
                <label>Product Name</label>
                <input type="text" id="productName-${n}">
            </div>
            <div>
                <label>Price</label>
                <input type="number" id="productPrice-${n}" step="any">
            </div>
            <div>
                <label>Quantity</label>
                <input type="number" id="productQuantity-${n}">
            </div>
            <hr>
        `;
        productsContainer.appendChild(productDiv);
    }
}

// Event Listener for Calculation and Validation
document.getElementById("calculateBtn").addEventListener("click", function() {
    const customerName = document.getElementById("customerName").value.trim();
    const productCountVal = document.getElementById("productCount").value;
    const validationMessage = document.getElementById("validationMessage");
    const orderSummary = document.getElementById("orderSummary");

    validationMessage.textContent = "";
    orderSummary.textContent = "";

    // Input Validation
    if (customerName === "") {
        validationMessage.textContent = "Error: Customer name cannot be empty.";
        return;
    }

    const productCount = parseInt(productCountVal);
    if (isNaN(productCount) || productCount <= 0) {
        validationMessage.textContent = "Error: Number of products must be a valid positive number.";
        return;
    }

    let subtotal = 0;
    let productDetailsText = "";

    // Process products using a for loop (Accumulator pattern)
    for (let n = 0; n < productCount; n++) {
        const nameInput = document.getElementById(`productName-${n}`);
        const priceInput = document.getElementById(`productPrice-${n}`);
        const quantityInput = document.getElementById(`productQuantity-${n}`);

        if (!nameInput || !priceInput || !quantityInput) {
            validationMessage.textContent = `Error: Missing fields for product index ${n}.`;
            return;
        }

        const name = nameInput.value.trim();
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);

        if (name === "" || isNaN(price) || price < 0 || isNaN(quantity) || quantity <= 0) {
            validationMessage.textContent = `Error: Please enter a valid name, positive price, and positive quantity for Product ${n + 1}.`;
            return;
        }

        const itemAmount = calculateItemAmount(price, quantity);
        subtotal += itemAmount;

        productDetailsText += `${n + 1}. ${name}\n   Price: ₱${price.toFixed(2)}\n   Quantity: ${quantity}\n   Amount: ₱${itemAmount.toFixed(2)}\n`;
    }

    // Discount Calculation
    const discountAmount = calculateDiscount(subtotal);
    let discountRatePercent = "No discount";
    if (subtotal >= 5000) {
        discountRatePercent = "10%";
    } else if (subtotal >= 3000) {
        discountRatePercent = "7%";
    } else if (subtotal >= 1000) {
        discountRatePercent = "5%";
    }

    // Delivery Fee Calculation
    const deliveryOptionVal = document.getElementById("deliveryOption").value;
    const deliveryFee = getDeliveryFee(deliveryOptionVal);
    
    let deliveryTypeName = "Store Pickup";
    if (deliveryOptionVal === "2") deliveryTypeName = "Standard Delivery";
    if (deliveryOptionVal === "3") deliveryTypeName = "Express Delivery";

    // Final Amount Calculation
    const finalAmount = subtotal - discountAmount + deliveryFee;

    // Display Output Summary
    const summaryOutput = `MINI STORE CHECKOUT SYSTEM
Customer: ${customerName}

${productDetailsText}
ORDER SUMMARY
Subtotal: ₱${subtotal.toFixed(2)}
Discount Rate: ${discountRatePercent}
Discount Amount: ₱${discountAmount.toFixed(2)}
Delivery Type: ${deliveryTypeName}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
Final Amount: ₱${finalAmount.toFixed(2)}`;

    orderSummary.textContent = summaryOutput;
});