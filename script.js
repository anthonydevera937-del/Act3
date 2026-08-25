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
    switch (parseInt(option)) {
        case 1:
            return 0;
        case 2:
            return 80;
        case 3:
            return 150;
        default:
            return 0;
    }
}

// DOM Elements
const productCountInput = document.getElementById('productCount');
const productsContainer = document.getElementById('productsContainer');
const calculateBtn = document.getElementById('calculateBtn');
const validationMessage = document.getElementById('validationMessage');
const orderSummary = document.getElementById('orderSummary');

// Dynamically generate product input fields using a for loop and required ID pattern
productCountInput.addEventListener('input', () => {
    productsContainer.innerHTML = '';
    const count = parseInt(productCountInput.value);

    if (count > 0) {
        for (let i = 0; i < count; i++) {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <h4>Product ${i + 1}</h4>
                <div>
                    <label for="productName-${i}">Product Name</label>
                    <input type="text" id="productName-${i}">
                </div>
                <div>
                    <label for="productPrice-${i}">Price</label>
                    <input type="number" id="productPrice-${i}" step="0.01" min="0">
                </div>
                <div>
                    <label for="productQuantity-${i}">Quantity</label>
                    <input type="number" id="productQuantity-${i}" min="1">
                </div>
            `;
            productsContainer.appendChild(productDiv);
        }
    }
});

// Calculate Button Event Listener
calculateBtn.addEventListener('click', () => {
    validationMessage.textContent = '';
    orderSummary.textContent = '';

    const customerName = document.getElementById('customerName').value.trim();
    const productCount = parseInt(productCountInput.value);
    const deliveryOption = document.getElementById('deliveryOption').value;

    // Input Validation
    if (!customerName) {
        validationMessage.textContent = 'Customer Name cannot be empty.';
        return;
    }
    if (isNaN(productCount) || productCount <= 0) {
        validationMessage.textContent = 'Please enter a valid number of products.';
        return;
    }

    let subtotal = 0;
    let summaryText = `MINI STORE CHECKOUT SYSTEM\nCustomer: ${customerName}\n`;
    let itemsArray = [];

    // Process products using a for loop
    for (let i = 0; i < productCount; i++) {
        const nameEl = document.getElementById(`productName-${i}`);
        const priceEl = document.getElementById(`productPrice-${i}`);
        const quantityEl = document.getElementById(`productQuantity-${i}`);

        if (!nameEl || !priceEl || !quantityEl) {
            validationMessage.textContent = `Missing fields for product ${i + 1}.`;
            return;
        }

        const name = nameEl.value.trim();
        const price = parseFloat(priceEl.value);
        const quantity = parseInt(quantityEl.value);

        if (!name) {
            validationMessage.textContent = `Product Name for item ${i + 1} cannot be empty.`;
            return;
        }
        if (isNaN(price) || price < 0) {
            validationMessage.textContent = `Invalid price for product "${name}".`;
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            validationMessage.textContent = `Invalid quantity for product "${name}".`;
            return;
        }

        const itemAmount = calculateItemAmount(price, quantity);
        subtotal += itemAmount;

        itemsArray.push({
            name: name,
            price: price,
            quantity: quantity,
            amount: itemAmount
        });
    }

    // Format output matching the sample layout exactly
    itemsArray.forEach((item, index) => {
        summaryText += `${index + 1}. ${item.name}\n`;
        summaryText += `   Price: ₱${item.price.toFixed(2)}\n`;
        summaryText += `   Quantity: ${item.quantity}\n`;
        summaryText += `   Amount: ₱${item.amount.toFixed(2)}\n`;
    });

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

    summaryText += `ORDER SUMMARY\n`;
    summaryText += `Subtotal: ₱${subtotal.toFixed(2)}\n`;
    summaryText += `Discount Rate: ${discountRateText}\n`;
    summaryText += `Discount Amount: ₱${discountAmount.toFixed(2)}\n`;
    summaryText += `Delivery Type: ${deliveryTypeText}\n`;
    summaryText += `Delivery Fee: ₱${deliveryFee.toFixed(2)}\n`;
    summaryText += `Final Amount: ₱${finalAmount.toFixed(2)}`;

    orderSummary.textContent = summaryText;
});