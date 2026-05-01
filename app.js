const ADMIN_WHATSAPP_NUMBER = "6281210907159"; // 081210907159
const STORAGE_KEY = "slaku_cart";

// Edit data menu Slaku di sini.
const products = [
  { id: 1, name: "Cheese Tart D20 Large Original", category: "Cheese Tart", variant: "D20 Large", price: 170000, description: "Cheese tart ukuran besar dengan rasa original creamy cheese, cocok untuk sharing atau acara keluarga." },
  { id: 2, name: "Cheese Tart D20 Large Matcha", category: "Cheese Tart", variant: "D20 Large", price: 195000, description: "Cheese tart ukuran besar dengan varian matcha creamy, cocok untuk pecinta matcha." },
  { id: 3, name: "Cheese Tart D18 Medium Original", category: "Cheese Tart", variant: "D18 Medium", price: 140000, description: "Ukuran medium dengan rasa original creamy cheese, cocok untuk hadiah atau makan bersama." },
  { id: 4, name: "Cheese Tart D10 Small Original", category: "Cheese Tart", variant: "D10 Small", price: 35000, description: "Ukuran kecil, cocok untuk porsi personal atau sharing kecil." },
  { id: 5, name: "Cheese Tart Slice Original", category: "Cheese Tart", variant: "Slice", price: 27000, description: "Potongan cheese tart praktis untuk sekali makan." },
  { id: 6, name: "Matcha 1 Liter", category: "Matcha", variant: "1 Liter", price: 95000, description: "Matcha creamy ukuran besar, cocok untuk sharing atau stok di rumah." },
  { id: 7, name: "Matcha 200 ml", category: "Matcha", variant: "200 ml", price: 20000, description: "Matcha creamy ukuran personal, praktis untuk sekali minum." },
  { id: 8, name: "Coklat 1 Liter", category: "Coklat", variant: "1 Liter", price: 80000, description: "Minuman coklat creamy ukuran besar dengan rasa rich dan lembut." },
  { id: 9, name: "Coklat 200 ml", category: "Coklat", variant: "200 ml", price: 17000, description: "Minuman coklat creamy ukuran personal." },
  { id: 10, name: "Kopi 1 Liter", category: "Kopi", variant: "1 Liter", price: 80000, description: "Kopi susu creamy ukuran besar dengan rasa smooth dan seimbang." },
  { id: 11, name: "Kopi 200 ml", category: "Kopi", variant: "200 ml", price: 17000, description: "Kopi susu creamy ukuran personal, praktis untuk sekali minum." }
];

const categories = ["Semua", "Cheese Tart", "Matcha", "Coklat", "Kopi"];
let activeCategory = "Semua";
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const el = {
  productList: document.getElementById("product-list"),
  filters: document.getElementById("category-filters"),
  cartItems: document.getElementById("cart-items"),
  subtotal: document.getElementById("cart-subtotal-price"),
  total: document.getElementById("cart-total-price"),
  form: document.getElementById("order-form"),
  addressWrap: document.getElementById("address-wrapper"),
  address: document.getElementById("customer-address")
};

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const waNumber = (n) => n.replace(/\D/g, "").replace(/^0/, "62");
const saveCart = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

function renderFilters() {
  el.filters.innerHTML = categories
    .map((c) => `<button class="filter-btn ${c === activeCategory ? "is-active" : ""}" data-category="${c}">${c}</button>`)
    .join("");
}

function renderProducts() {
  const list = activeCategory === "Semua" ? products : products.filter((p) => p.category === activeCategory);
  el.productList.innerHTML = list
    .map((p) => `
      <article class="product-item">
        <div class="product-main">
          <div>
            <strong>${p.name}</strong>
            <span class="product-meta">${p.category} • ${p.variant}</span>
            <p class="product-desc">${p.description}</p>
            <p class="product-price">${rupiah(p.price)}</p>
          </div>
        </div>
        <button class="btn btn-outline" data-add-id="${p.id}">Tambah ke Keranjang</button>
      </article>
    `)
    .join("");
}

function addToCart(productId) {
  const item = cart.find((i) => i.id === productId);
  if (item) item.quantity += 1;
  else {
    const p = products.find((x) => x.id === productId);
    cart.push({ ...p, quantity: 1 });
  }
  saveCart();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function totalPrice() { return cart.reduce((sum, i) => sum + i.price * i.quantity, 0); }

function renderCart() {
  if (!cart.length) {
    el.cartItems.innerHTML = '<p class="empty-state">Keranjang masih kosong.</p>';
    el.subtotal.textContent = rupiah(0);
    el.total.textContent = rupiah(0);
    return;
  }
  el.cartItems.innerHTML = cart.map((i) => `
    <div class="cart-row">
      <h4>${i.name}</h4>
      <small>${rupiah(i.price)} x ${i.quantity} = ${rupiah(i.price * i.quantity)}</small>
      <div class="qty-controls">
        <button class="qty-btn" data-qty-id="${i.id}" data-delta="-1">-</button>
        <span>${i.quantity}</span>
        <button class="qty-btn" data-qty-id="${i.id}" data-delta="1">+</button>
        <button class="remove-btn" data-remove-id="${i.id}">Hapus</button>
      </div>
    </div>
  `).join("");
  const total = totalPrice();
  el.subtotal.textContent = rupiah(total);
  el.total.textContent = rupiah(total);
}

function toggleAddress() {
  const isDelivery = document.querySelector('input[name="order-method"]:checked').value === "Delivery";
  el.addressWrap.classList.toggle("hidden", !isDelivery);
  el.address.required = isDelivery;
}

function checkoutMessage(data) {
  const detail = cart.map((i, idx) => `${idx + 1}. ${i.name} x${i.quantity} = ${rupiah(i.price * i.quantity)}`).join("\n");
  const total = rupiah(totalPrice());
  return `Halo Slaku, saya mau pesan:\n\nNama: ${data.name}\nNo HP: ${data.phone}\nMetode: ${data.method}\nAlamat: ${data.address || "-"}\nCatatan: ${data.notes || "-"}\nJam ${data.method}: ${data.time}\n\nDetail Pesanan:\n${detail}\n\nSubtotal: ${total}\nTotal: ${total}\n\nTerima kasih.`;
}

el.filters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderFilters();
  renderProducts();
});

el.productList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add-id]");
  if (btn) addToCart(Number(btn.dataset.addId));
});

el.cartItems.addEventListener("click", (e) => {
  const qty = e.target.closest("[data-qty-id]");
  const remove = e.target.closest("[data-remove-id]");
  if (qty) updateQty(Number(qty.dataset.qtyId), Number(qty.dataset.delta));
  if (remove) removeItem(Number(remove.dataset.removeId));
});

el.form.addEventListener("change", (e) => { if (e.target.name === "order-method") toggleAddress(); });

el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cart.length) return alert("Keranjang masih kosong.");
  const formData = {
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    method: document.querySelector('input[name="order-method"]:checked').value,
    address: el.address.value.trim(),
    notes: document.getElementById("order-notes").value.trim(),
    time: document.getElementById("order-time").value
  };
  const url = `https://wa.me/${waNumber(ADMIN_WHATSAPP_NUMBER)}?text=${encodeURIComponent(checkoutMessage(formData))}`;
  window.open(url, "_blank");
});

renderFilters();
renderProducts();
renderCart();
toggleAddress();
