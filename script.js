// Required top-level functions
function calculateItemAmount(price, quantity) {
    return price * quantity;
}

function calculateDiscount(subtotal) {
    if (subtotal >= 5000) {
        return subtotal * 0.10;
    } else if (subtotal >= 3000) {
        return subtotal * 0.07;
    } else if (subtotal >= 1000) {
        return subtotal * 0.05;
    } else {
        return 0;
    }
}

function getDeliveryFee(option) {
    switch (Number(option)) {
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

// DOM references
const customerNameInput = document.getElementById('customerName');
const productCountInput = document.getElementById('productCount');
const productsContainer = document.getElementById('productsContainer');
const deliveryOption = document.getElementById('deliveryOption');
const calculateBtn = document.getElementById('calculateBtn');
const validationMessage = document.getElementById('validationMessage');
const orderSummary = document.getElementById('orderSummary');

// Generate product input fields based on count
function generateProductFields(count) {
    productsContainer.innerHTML = '';
    
    if (!count || count < 1) {
        return;
    }
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        
        // Product name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Product Name';
        nameLabel.htmlFor = `productName-${i}`;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = `productName-${i}`;
        
        // Price
        const priceLabel = document.createElement('label');
        priceLabel.textContent = 'Price';
        priceLabel.htmlFor = `productPrice-${i}`;
        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.id = `productPrice-${i}`;
        priceInput.step = '0.01';
        priceInput.min = '0';
        
        // Quantity
        const qtyLabel = document.createElement('label');
        qtyLabel.textContent = 'Quantity';
        qtyLabel.htmlFor = `productQuantity-${i}`;
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.id = `productQuantity-${i}`;
        qtyInput.min = '1';
        qtyInput.step = '1';
        
        div.appendChild(nameLabel);
        div.appendChild(nameInput);
        div.appendChild(priceLabel);
        div.appendChild(priceInput);
        div.appendChild(qtyLabel);
        div.appendChild(qtyInput);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
        
        productsContainer.appendChild(div);
    }
}

// Initial generation
productCountInput.value = 2;
generateProductFields(2);

// Update products when count changes
productCountInput.addEventListener('input', function() {
    const count = parseInt(this.value, 10);
    if (!isNaN(count) && count > 0) {
        generateProductFields(count);
    }
    validationMessage.textContent = '';
    orderSummary.innerHTML = '';
});

// Calculate button click handler
calculateBtn.addEventListener('click', function() {
    // Reset validation message
    validationMessage.textContent = '';
    orderSummary.innerHTML = '';
    
    let errors = [];
    
    // Get customer name
    const customerName = customerNameInput.value.trim();
    if (customerName === '') {
        errors.push('Customer name is required.');
    }
    
    // Get product count
    const productCount = parseInt(productCountInput.value, 10);
    if (isNaN(productCount) || productCount < 1) {
        errors.push('Number of products must be a positive integer.');
        validationMessage.textContent = errors.join(' ');
        return;
    }
    
    // Process each product
    let subtotal = 0;
    let productDetails = [];
    let validProducts = true;
    
    for (let i = 0; i < productCount; i++) {
        const nameInput = document.getElementById(`productName-${i}`);
        const priceInput = document.getElementById(`productPrice-${i}`);
        const qtyInput = document.getElementById(`productQuantity-${i}`);
        
        if (!nameInput || !priceInput || !qtyInput) {
            errors.push(`Product ${i+1} inputs are missing.`);
            validProducts = false;
            continue;
        }
        
        const name = nameInput.value.trim() || `Product ${i+1}`;
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(qtyInput.value, 10);
        
        // Validate price
        if (isNaN(price) || price < 0) {
            errors.push(`Product "${name}" has an invalid price (must be 0 or greater).`);
            validProducts = false;
        }
        
        // Validate quantity
        if (isNaN(quantity) || quantity < 1) {
            errors.push(`Product "${name}" has an invalid quantity (must be 1 or greater).`);
            validProducts = false;
        }
        
        if (!isNaN(price) && price >= 0 && !isNaN(quantity) && quantity >= 1) {
            const amount = calculateItemAmount(price, quantity);
            subtotal += amount;
            productDetails.push({
                name: name,
                price: price,
                quantity: quantity,
                amount: amount
            });
        }
    }
    
    if (!validProducts || errors.length > 0) {
        validationMessage.textContent = errors.join(' ');
        return;
    }
    
    // Calculate discount
    const discountAmount = calculateDiscount(subtotal);
    let discountRate = '';
    if (subtotal >= 5000) {
        discountRate = '10%';
    } else if (subtotal >= 3000) {
        discountRate = '7%';
    } else if (subtotal >= 1000) {
        discountRate = '5%';
    } else {
        discountRate = '0%';
    }
    
    // Get delivery fee
    const deliveryOptionValue = deliveryOption.value;
    const deliveryFee = getDeliveryFee(deliveryOptionValue);
    let deliveryType = '';
    switch (Number(deliveryOptionValue)) {
        case 1:
            deliveryType = 'Store Pickup';
            break;
        case 2:
            deliveryType = 'Standard Delivery';
            break;
        case 3:
            deliveryType = 'Express Delivery';
            break;
        default:
            deliveryType = 'Standard Delivery';
    }
    
    // Calculate final amount
    const finalAmount = subtotal - discountAmount + deliveryFee;
    
    // Build order summary
    let summaryHTML = `<h3>ORDER SUMMARY</h3>`;
    summaryHTML += `<p><strong>Customer:</strong> ${customerName}</p>`;
    
    productDetails.forEach((item, index) => {
        summaryHTML += `
            <p>
                <strong>${index + 1}. ${item.name}</strong><br>
                Price: ₱${item.price.toFixed(2)}<br>
                Quantity: ${item.quantity}<br>
                Amount: ₱${item.amount.toFixed(2)}
            </p>
        `;
    });
    
    summaryHTML += `
        <p><strong>Subtotal:</strong> ₱${subtotal.toFixed(2)}</p>
        <p><strong>Discount Rate:</strong> ${discountRate}</p>
        <p><strong>Discount Amount:</strong> ₱${discountAmount.toFixed(2)}</p>
        <p><strong>Delivery Type:</strong> ${deliveryType}</p>
        <p><strong>Delivery Fee:</strong> ₱${deliveryFee.toFixed(2)}</p>
        <p><strong>Final Amount:</strong> ₱${finalAmount.toFixed(2)}</p>
    `;
    
    orderSummary.innerHTML = summaryHTML;
    validationMessage.textContent = 'Order calculated successfully!';
});