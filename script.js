// --- REQUIRED TOP-LEVEL CALCULATION FUNCTIONS ---

/**
 * Calculates item total amount.
 * @param {number} price 
 * @param {number} quantity 
 * @returns {number}
 */
function calculateItemAmount(price, quantity) {
  return price * quantity;
}

/**
 * Calculates discount amount based on subtotal.
 * @param {number} subtotal 
 * @returns {number}
 */
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

/**
 * Returns delivery fee based on selected option.
 * @param {string|number} option 
 * @returns {number}
 */
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

// --- DOM EVENT LISTENERS AND GENERATION LOGIC ---

const productCountInput = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const calculateBtn = document.getElementById("calculateBtn");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// Event listener to dynamically generate input fields when productCount changes
productCountInput.addEventListener("input", function () {
  const count = parseInt(productCountInput.value, 10);
  productsContainer.innerHTML = ""; // Clear existing fields

  if (isNaN(count) || count <= 0) {
    return;
  }

  for (let i = 0; i < count; i++) {
    const productGroup = document.createElement("div");
    productGroup.style.marginBottom = "15px";

    productGroup.innerHTML = `
      <h4>Product ${i + 1}</h4>
      <label for="productName-${i}">Product Name</label>
      <input type="text" id="productName-${i}" placeholder="Product Name"><br><br>
      
      <label for="productPrice-${i}">Price</label>
      <input type="number" id="productPrice-${i}" step="0.01" placeholder="Price"><br><br>
      
      <label for="productQuantity-${i}">Quantity</label>
      <input type="number" id="productQuantity-${i}" placeholder="Quantity"><br>
    `;

    productsContainer.appendChild(productGroup);
  }
});

// Main Calculation Logic triggered on button click
calculateBtn.addEventListener("click", function () {
  // Clear previous output/messages
  validationMessage.textContent = "";
  orderSummary.textContent = "";

  const nameInput = document.getElementById("customerName").value.trim();
  const countInput = parseInt(productCountInput.value, 10);

  // 1. Validate customer name
  if (!nameInput) {
    validationMessage.textContent = "Please enter a valid Customer Name.";
    return;
  }

  // 2. Validate product count
  if (isNaN(countInput) || countInput <= 0) {
    validationMessage.textContent = "Please enter a valid number of products.";
    return;
  }

  let subtotal = 0;
  let itemsSummary = "";

  // 3. Process products using a for loop
  for (let i = 0; i < countInput; i++) {
    const pNameElem = document.getElementById(`productName-${i}`);
    const pPriceElem = document.getElementById(`productPrice-${i}`);
    const pQtyElem = document.getElementById(`productQuantity-${i}`);

    if (!pNameElem || !pPriceElem || !pQtyElem) {
      validationMessage.textContent = `Missing input fields for product ${i + 1}.`;
      return;
    }

    const pName = pNameElem.value.trim();
    const pPrice = parseFloat(pPriceElem.value);
    const pQty = parseInt(pQtyElem.value, 10);

    // Validate product fields
    if (!pName) {
      validationMessage.textContent = `Please enter a valid name for Product ${i + 1}.`;
      return;
    }
    if (isNaN(pPrice) || pPrice <= 0) {
      validationMessage.textContent = `Please enter a valid positive price for Product ${i + 1}.`;
      return;
    }
    if (isNaN(pQty) || pQty <= 0) {
      validationMessage.textContent = `Please enter a valid positive quantity for Product ${i + 1}.`;
      return;
    }

    // Accumulate total amount
    const itemAmount = calculateItemAmount(pPrice, pQty);
    subtotal += itemAmount;

    // Build product breakdown output block
    itemsSummary += `${i + 1}. ${pName}\n`;
    itemsSummary += `   Price: ₱${pPrice.toFixed(2)}\n`;
    itemsSummary += `   Quantity: ${pQty}\n`;
    itemsSummary += `   Amount: ₱${itemAmount.toFixed(2)}\n`;
  }

  // 4. Calculate discount
  const discountAmount = calculateDiscount(subtotal);
  
  // Determine discount rate label
  let discountRateStr = "No discount";
  if (subtotal >= 5000) {
    discountRateStr = "10%";
  } else if (subtotal >= 3000) {
    discountRateStr = "7%";
  } else if (subtotal >= 1000) {
    discountRateStr = "5%";
  }

  // 5. Calculate delivery fee
  const deliveryOptionVal = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOptionVal);

  let deliveryTypeStr = "";
  switch (Number(deliveryOptionVal)) {
    case 1:
      deliveryTypeStr = "Store Pickup";
      break;
    case 2:
      deliveryTypeStr = "Standard Delivery";
      break;
    case 3:
      deliveryTypeStr = "Express Delivery";
      break;
  }

  // 6. Calculate final total amount
  const finalAmount = subtotal - discountAmount + deliveryFee;

  // 7. Format final output matching required format
  const output = 
`MINI STORE CHECKOUT SYSTEM

Customer: ${nameInput}

${itemsSummary}
ORDER SUMMARY
Subtotal: ₱${subtotal.toFixed(2)}
Discount Rate: ${discountRateStr}
Discount Amount: ₱${discountAmount.toFixed(2)}
Delivery Type: ${deliveryTypeStr}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
Final Amount: ₱${finalAmount.toFixed(2)}`;

  orderSummary.textContent = output;
});