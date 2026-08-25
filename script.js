// Required Top-Level Functions
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

// DOM Element References
const productCountInput = document.getElementById("productCount");
const generateFieldsBtn = document.getElementById("generateFieldsBtn");
const productsContainer = document.getElementById("productsContainer");
const calculateBtn = document.getElementById("calculateBtn");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// Event listener to dynamically create input fields using a for loop based on productCount
generateFieldsBtn.addEventListener("click", () => {
    productsContainer.innerHTML = "";
    validationMessage.textContent = "";
    
    const count = Number(productCountInput.value);
    
    if (isNaN(count) || count <= 0) {
        validationMessage.textContent = "Please enter a valid positive number for the Number of Products.";
        return;
    }

    // Required for loop for product generation
    for (let i = 0; i < count; i++) {
        const productDiv = document.createElement("div");
        productDiv.style.marginBottom = "10px";
        productDiv.style.padding = "10px";
        productDiv.style.border = "1px solid #ddd";
        productDiv.style.borderRadius = "4px";

        productDiv.innerHTML = `
            <strong>Product ${i + 1}</strong>
            <div class="form-group" style="margin-top:5px;">
                <label for="productName-${i}">Product Name</label>
                <input type="text" id="productName-${i}" placeholder="Product Name">
            </div>
            <div class="form-group">
                <label for="productPrice-${i}">Price</label>
                <input type="number" id="productPrice-${i}" step="0.01" min="0" placeholder="Price">
            </div>
            <div class="form-group">
                <label for="productQuantity-${i}">Quantity</label>
                <input type="number" id="productQuantity-${i}" min="1" placeholder="Quantity">
            </div>
        `;
        productsContainer.appendChild(productDiv);
    }
});

// Event listener for calculation and summary display
calculateBtn.addEventListener("click", () => {
    validationMessage.textContent = "";
    orderSummary.textContent = "";

    const customerName = document.getElementById("customerName").value.trim();
    const count = Number(productCountInput.value);
    const deliveryOption = document.getElementById("deliveryOption").value;

    // Input Validation
    if (customerName === "") {
        validationMessage.textContent = "Customer Name cannot be empty.";
        return;
    }
    if (isNaN(count) || count <= 0) {
        validationMessage.textContent = "Invalid product count.";
        return;
    }

    let subtotal = 0;
    let productDetailsText = "";

    // Required for loop for product processing and accumulation
    for (let i = 0; i < count; i++) {
        const nameEl = document.getElementById(`productName-${i}`);
        const priceEl = document.getElementById(`productPrice-${i}`);
        const quantityEl = document.getElementById(`productQuantity-${i}`);

        if (!nameEl || !priceEl || !quantityEl) {
            validationMessage.textContent = "Please generate the product fields first.";
            return;
        }

        const name = nameEl.value.trim();
        const price = parseFloat(priceEl.value);
        const quantity = parseInt(quantityEl.value);

        if (name === "" || isNaN(price) || price < 0 || isNaN(quantity) || quantity <= 0) {
            validationMessage.textContent = `Please provide valid inputs for Product #${i + 1}.`;
            return;
        }

        const itemAmount = calculateItemAmount(price, quantity);
        subtotal += itemAmount;

        productDetailsText += `${i + 1}. ${name}\n   Price: ₱${price.toFixed(2)}\n   Quantity: ${quantity}\n   Amount: ₱${itemAmount.toFixed(2)}\n`;
    }

    // Calculations using required functions and control structures
    const discountAmount = calculateDiscount(subtotal);
    
    let discountRateText = "No discount";
    if (subtotal >= 5000) discountRateText = "10%";
    else if (subtotal >= 3000) discountRateText = "7%";
    else if (subtotal >= 1000) discountRateText = "5%";

    const deliveryFee = getDeliveryFee(deliveryOption);

    let deliveryTypeText = "Store Pickup";
    if (deliveryOption === "2") deliveryTypeText = "Standard Delivery";
    else if (deliveryOption === "3") deliveryTypeText = "Express Delivery";

    const finalAmount = subtotal - discountAmount + deliveryFee;

    // Display Complete Order Summary via template literals
    const summaryOutput = `MINI STORE CHECKOUT SYSTEM
Customer: ${customerName}
${productDetailsText}
ORDER SUMMARY
Subtotal: ₱${subtotal.toFixed(2)}
Discount Rate: ${discountRateText}
Discount Amount: ₱${discountAmount.toFixed(2)}
Delivery Type: ${deliveryTypeText}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
Final Amount: ₱${finalAmount.toFixed(2)}`;

    orderSummary.textContent = summaryOutput;
});