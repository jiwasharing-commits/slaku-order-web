const ADMIN_WHATSAPP_NUMBER = "6287865706644";
const STORAGE_KEY = "slaku_cart";

// Edit data menu Slaku di sini.
const products = [
  { id: 1, name: "Cheese Tart Original D20", category: "Cheese Tart", variant: "D20 Large", price: 170000, badge: "🔥 Best Seller", image: "https://drive.google.com/thumbnail?id=1CI2AMyqI5p38S2rFQuOUVmgoR81v-pUF&sz=w600", description: "Cheese tart ukuran besar dengan rasa original creamy cheese, cocok untuk sharing atau acara keluarga." },
  { id: 2, name: "Cheese Tart Matcha D20", category: "Cheese Tart", variant: "D20 Large", price: 195000, badge: "✨ Menu Baru", image: "https://drive.google.com/thumbnail?id=1JxU-8UTKpTWDjRvk9enV9ZZH9tAH54oL&sz=w600", description: "Cheese tart ukuran besar dengan varian matcha creamy, cocok untuk pecinta matcha." },
  { id: 3, name: "Cheese Tart Coklat D20", category: "Cheese Tart", variant: "D20 Large", price: 195000, badge: "✨ Menu Baru", image: "https://drive.google.com/thumbnail?id=1sT7hbyNJgBVMG0RcXNbXnV6eG2mmsY9D&sz=w600", description: "Cheese tart ukuran besar dengan varian chocolate creamy, cocok untuk pecinta coklat." },
  { id: 4, name: "Cheese Tart D18 Medium Original", category: "Cheese Tart", variant: "D18 Medium", price: 140000, image: "https://drive.google.com/thumbnail?id=1LUS--Zp6GiJRuppY_dS0pRAHPku1EvFL&sz=w600", description: "Ukuran medium dengan rasa original creamy cheese, cocok untuk hadiah atau makan bersama." },
  { id: 5, name: "Cheese Tart D10 Small Original", category: "Cheese Tart", variant: "D10 Small", price: 35000, image: "https://drive.google.com/thumbnail?id=1TAD8MxeJGOeNDWpLk3TebdHfofBhOhB_&sz=w600", description: "Ukuran kecil, cocok untuk porsi personal atau sharing kecil." },
  { id: 6, name: "Cheese Tart Slice Original", category: "Cheese Tart", variant: "Slice", price: 27000, image: "https://drive.google.com/thumbnail?id=1bZln_TTUEIzgsbHIH0cP-pBOmR3tOAHH&sz=w600", description: "Potongan cheese tart praktis untuk sekali makan." },
  { id: 7, name: "Matcha 1 Liter", category: "Matcha", variant: "1 Liter", price: 95000, badge: "Best Seller", image: "https://drive.google.com/thumbnail?id=1BFKgJdoJsICUtz6EQxa4QKZtjBjJ4YIo&sz=w600", description: "Matcha creamy ukuran besar, cocok untuk sharing atau stok di rumah." },
  { id: 8, name: "Matcha 200 ml", category: "Matcha", variant: "200 ml", price: 20000, badge: "Best Seller", image: "https://drive.google.com/thumbnail?id=1A-RGtxdxiCPVfVIM5Oa7R7Lz6Ab_Yolu&sz=w600", description: "Matcha creamy ukuran personal, praktis untuk sekali minum." },
  { id: 9, name: "Coklat 1 Liter", category: "Coklat", variant: "1 Liter", price: 80000, image: "https://drive.google.com/thumbnail?id=1nDnxfn1fSmpRgVxfT4seBecjjzjdOyBk&sz=w600", description: "Minuman coklat creamy ukuran besar dengan rasa rich dan lembut." },
  { id: 10, name: "Coklat 200 ml", category: "Coklat", variant: "200 ml", price: 17000, image: "https://drive.google.com/thumbnail?id=1TK7HmGGcBhwO3IXgYfm2O2n7O1nKuyfg&sz=w600", description: "Minuman coklat creamy ukuran personal." },
  { id: 11, name: "Kopi 1 Liter", category: "Kopi", variant: "1 Liter", price: 80000, image: "https://drive.google.com/thumbnail?id=1tEUhC9dIS5o76TsvWHMM2iDVjqeo_qrF&sz=w600", description: "Kopi susu creamy ukuran besar dengan rasa smooth dan seimbang." },
  { id: 12, name: "Kopi 200 ml", category: "Kopi", variant: "200 ml", price: 17000, image: "https://drive.google.com/thumbnail?id=1mveWc-Hkyl6algWld_rfzGP9_UaUdyx_&sz=w600", description: "Kopi susu creamy ukuran personal, praktis untuk sekali minum." }
];

const categories = ["Semua", "Cheese Tart", "Matcha", "Coklat", "Kopi"];
let activeCategory = "Semua";
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const PICKUP_ADDRESS = "Jalan Saribanon Blok H/5 Komplek Ciceri Indah Serang Banten (Masuk Dari Dokterlinda/Indomaret, gang ke dua belok kanan).";
const PICKUP_MAPS = "https://bit.ly/425QLnw";

const el = {
  productList: document.getElementById("product-list"),
  filters: document.getElementById("category-filters"),
  cartItems: document.getElementById("cart-items"),
  total: document.getElementById("cart-total-price"),
  form: document.getElementById("order-form")
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
      <article class="product-item product-card">
        <div class="product-main">
          <img src="${p.image}" alt="${p.name}" class="product-thumb" loading="lazy" />
          <div class="product-info">
            <div class="product-header">
              <strong class="product-title product-name">${p.name}</strong>
              ${p.badge ? `<span class="badge product-badge ${p.badge.includes("Best Seller") ? "badge-best" : "badge-new"}">${p.badge}</span>` : ""}
            </div>
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
  el.total.textContent = rupiah(total);
}

function checkoutMessage(data) {
  const detail = cart.map((i, idx) => `${idx + 1}. ${i.name} x${i.quantity} = ${rupiah(i.price * i.quantity)}`).join("\n");
  const total = rupiah(totalPrice());
  return `Halo Slaku, saya mau pesan:\n\nNama: ${data.name}\nNo HP: ${data.phone}\nMetode: ${data.method}\nAlamat Pickup: ${PICKUP_ADDRESS}\nGoogle Maps: ${PICKUP_MAPS}\nJam Pickup: ${data.time}\n\nDetail Pesanan:\n${detail}\n\nSubtotal: ${total}\nTotal: ${total}\n\nTerima kasih.`;
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

el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cart.length) return alert("Keranjang masih kosong.");
  const formData = {
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    method: "Pickup Mandiri / Pickup Kurir (Gojek/Maxim)",
    time: document.getElementById("order-time").value
  };
  const url = `https://wa.me/${waNumber(ADMIN_WHATSAPP_NUMBER)}?text=${encodeURIComponent(checkoutMessage(formData))}`;
  window.open(url, "_blank");
});

renderFilters();
renderProducts();
renderCart();
