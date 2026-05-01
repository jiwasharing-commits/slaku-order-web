diff --git a/app.js b/app.js
new file mode 100644
index 0000000000000000000000000000000000000000..461ce2da9395d6f2a1560170713514dece98428a
--- /dev/null
+++ b/app.js
@@ -0,0 +1,206 @@
+// ===== EDIT DI SINI: Nomor WhatsApp tujuan checkout =====
+const ADMIN_WHATSAPP_NUMBER = "6281210907159"; // 081210907159
+
+// ===== EDIT DI SINI: Daftar produk katalog =====
+const products = [
+  { id: 1, name: "Kopi Susu Slaku 250ml", price: 15000, category: "Coffee" },
+  { id: 2, name: "Matcha Latte 250ml", price: 18000, category: "Matcha" },
+  { id: 3, name: "Chocolate Creamy 250ml", price: 17000, category: "Chocolate" },
+  { id: 4, name: "Brown Butter Dark Chocolate Cookies", price: 12000, category: "Cookies" },
+  { id: 5, name: "Hokkaido Cheese Tart", price: 15000, category: "Dessert" },
+  { id: 6, name: "Tiramisu Cup", price: 20000, category: "Dessert" }
+];
+
+const STORAGE_KEY = "slaku_cart";
+
+const productListEl = document.getElementById("product-list");
+const cartItemsEl = document.getElementById("cart-items");
+const totalPriceEl = document.getElementById("cart-total-price");
+const orderForm = document.getElementById("order-form");
+const addressWrapper = document.getElementById("address-wrapper");
+const addressInput = document.getElementById("customer-address");
+
+let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
+
+const formatRupiah = (value) =>
+  new Intl.NumberFormat("id-ID", {
+    style: "currency",
+    currency: "IDR",
+    maximumFractionDigits: 0
+  }).format(value);
+
+function normalizeWhatsAppNumber(number) {
+  const digits = number.replace(/\D/g, "");
+
+  if (digits.startsWith("0")) {
+    return `62${digits.slice(1)}`;
+  }
+
+  if (digits.startsWith("62")) {
+    return digits;
+  }
+
+  return digits;
+}
+
+function saveCart() {
+  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
+}
+
+function renderProducts() {
+  productListEl.innerHTML = "";
+
+  products.forEach((product) => {
+    const productCard = document.createElement("article");
+    productCard.className = "product-item";
+    productCard.innerHTML = `
+      <strong>${product.name}</strong>
+      <span class="product-meta">${product.category} • ${formatRupiah(product.price)}</span>
+      <button class="btn btn-outline" data-add-id="${product.id}">Tambah ke Keranjang</button>
+    `;
+
+    productListEl.appendChild(productCard);
+  });
+}
+
+function addToCart(productId) {
+  const existingItem = cart.find((item) => item.id === productId);
+
+  if (existingItem) {
+    existingItem.quantity += 1;
+  } else {
+    const product = products.find((item) => item.id === productId);
+    cart.push({ ...product, quantity: 1 });
+  }
+
+  saveCart();
+  renderCart();
+}
+
+function updateQuantity(productId, delta) {
+  const item = cart.find((cartItem) => cartItem.id === productId);
+  if (!item) return;
+
+  item.quantity += delta;
+
+  if (item.quantity <= 0) {
+    cart = cart.filter((cartItem) => cartItem.id !== productId);
+  }
+
+  saveCart();
+  renderCart();
+}
+
+function removeFromCart(productId) {
+  cart = cart.filter((item) => item.id !== productId);
+  saveCart();
+  renderCart();
+}
+
+function calculateTotal() {
+  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
+}
+
+function renderCart() {
+  cartItemsEl.innerHTML = "";
+
+  if (cart.length === 0) {
+    cartItemsEl.innerHTML = '<p class="empty-state">Keranjang masih kosong.</p>';
+    totalPriceEl.textContent = formatRupiah(0);
+    return;
+  }
+
+  cart.forEach((item) => {
+    const subtotal = item.price * item.quantity;
+    const row = document.createElement("div");
+    row.className = "cart-row";
+    row.innerHTML = `
+      <h4>${item.name}</h4>
+      <small>${formatRupiah(item.price)} x ${item.quantity} = ${formatRupiah(subtotal)}</small>
+      <div class="qty-controls">
+        <button class="qty-btn" data-qty-id="${item.id}" data-delta="-1">-</button>
+        <span>${item.quantity}</span>
+        <button class="qty-btn" data-qty-id="${item.id}" data-delta="1">+</button>
+        <button class="remove-btn" data-remove-id="${item.id}">Hapus</button>
+      </div>
+    `;
+    cartItemsEl.appendChild(row);
+  });
+
+  totalPriceEl.textContent = formatRupiah(calculateTotal());
+}
+
+function toggleAddressField() {
+  const selectedMethod = document.querySelector('input[name="order-method"]:checked').value;
+  const isDelivery = selectedMethod === "Delivery";
+
+  addressWrapper.classList.toggle("hidden", !isDelivery);
+  addressInput.required = isDelivery;
+}
+
+function generateWhatsAppMessage(formData) {
+  const itemsText = cart
+    .map(
+      (item, index) =>
+        `${index + 1}. ${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
+    )
+    .join("\n");
+
+  const total = formatRupiah(calculateTotal());
+  const addressText = formData.method === "Delivery" ? formData.address : "-";
+  const notesText = formData.notes?.trim() ? formData.notes : "-";
+
+  return `Halo Slaku! Saya mau order:\n\n${itemsText}\n\nTotal: ${total}\n\nData Pemesan:\nNama: ${formData.name}\nNo. WA: ${formData.phone}\nMetode: ${formData.method}\nAlamat: ${addressText}\nCatatan: ${notesText}`;
+}
+
+productListEl.addEventListener("click", (event) => {
+  const addButton = event.target.closest("[data-add-id]");
+  if (!addButton) return;
+
+  addToCart(Number(addButton.dataset.addId));
+});
+
+cartItemsEl.addEventListener("click", (event) => {
+  const qtyButton = event.target.closest("[data-qty-id]");
+  const removeButton = event.target.closest("[data-remove-id]");
+
+  if (qtyButton) {
+    updateQuantity(Number(qtyButton.dataset.qtyId), Number(qtyButton.dataset.delta));
+  }
+
+  if (removeButton) {
+    removeFromCart(Number(removeButton.dataset.removeId));
+  }
+});
+
+orderForm.addEventListener("change", (event) => {
+  if (event.target.name === "order-method") {
+    toggleAddressField();
+  }
+});
+
+orderForm.addEventListener("submit", (event) => {
+  event.preventDefault();
+
+  if (cart.length === 0) {
+    alert("Keranjang masih kosong. Tambahkan produk terlebih dahulu.");
+    return;
+  }
+
+  const formData = {
+    name: document.getElementById("customer-name").value.trim(),
+    phone: document.getElementById("customer-phone").value.trim(),
+    method: document.querySelector('input[name="order-method"]:checked').value,
+    address: addressInput.value.trim(),
+    notes: document.getElementById("order-notes").value.trim()
+  };
+
+  const message = generateWhatsAppMessage(formData);
+  const targetNumber = normalizeWhatsAppNumber(ADMIN_WHATSAPP_NUMBER);
+  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
+  window.open(whatsappUrl, "_blank");
+});
+
+renderProducts();
+renderCart();
+toggleAddressField();
