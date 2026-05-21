const productList = document.getElementById("product-list");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const orderForm = document.getElementById("order-form");
const orderMessage = document.getElementById("order-message");
const whatsappLink = document.getElementById("whatsapp-link");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

const phoneNumber = "2348037207813";
let cart = JSON.parse(localStorage.getItem("vimaCart")) || [];
let filteredProducts = [...products];

function saveCart() {
  localStorage.setItem("vimaCart", JSON.stringify(cart));
}

function formatPrice(value) {
  return value.toLocaleString();
}

function populateCategories() {
  const categories = [...new Set(products.map(product => product.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function displayProducts(items) {
  productList.innerHTML = "";

  if (items.length === 0) {
    productList.innerHTML = `<div class="empty-cart">No products found.</div>`;
    return;
  }

  items.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-badge">${product.category}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-meta">${product.category}</p>
        <p>${product.description}</p>
        <div class="price-row">
          <span class="price">₦${formatPrice(product.price)}</span>
          <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;

    productList.appendChild(card);
  });
}

function filterProducts() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function increaseQuantity(productId) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;
  item.quantity += 1;
  saveCart();
  renderCart();
}

function decreaseQuantity(productId) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="empty-cart">Your cart is empty. Add beautiful hair products to begin your order.</div>`;
    cartTotal.textContent = "0";
    updateWhatsAppLink();
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.category}</p>
      </div>

      <div class="quantity-controls">
        <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
      </div>

      <strong>₦${formatPrice(itemTotal)}</strong>

      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = formatPrice(total);
  updateWhatsAppLink();
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (cart.length === 0) {
    orderMessage.textContent = "Please add at least one product before submitting your order.";
    orderMessage.style.color = "crimson";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const note = document.getElementById("note").value.trim();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = `Hello Vima Beauty Salon,%0A%0AMy name is ${name}.%0AI want to place an order:%0A`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.category}) x${item.quantity} - ₦${formatPrice(item.price * item.quantity)}%0A`;
  });

  message += `%0ATotal: ₦${formatPrice(total)}%0A`;
  message += `Phone: ${phone}%0A`;
  message += `Address: ${address}%0A`;

  if (note) {
    message += `Note: ${note}%0A`;
  }

  message += `%0AThank you.`;

  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");

  orderMessage.textContent = "Your order has been prepared for WhatsApp. Please send the message in WhatsApp to complete your order.";
  orderMessage.style.color = "#2e7d32";

  orderForm.reset();
});

function updateWhatsAppLink() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = "Hello Vima Beauty Salon,%0A%0AI would like to place an order:%0A";

  if (cart.length === 0) {
    message += "No items selected yet.%0A";
  } else {
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.category}) x${item.quantity} - ₦${formatPrice(item.price * item.quantity)}%0A`;
    });
    message += `%0ATotal: ₦${formatPrice(total)}%0A`;
  }

  message += "%0AI need assistance too.";

  whatsappLink.href = `https://wa.me/${phoneNumber}?text=${message}`;
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

populateCategories();
displayProducts(products);
renderCart();