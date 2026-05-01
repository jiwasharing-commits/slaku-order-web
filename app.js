const ADMIN_WHATSAPP_NUMBER = "6281210907159"; // 081210907159
const STORAGE_KEY = "slaku_cart";

// Edit data menu Slaku di sini.
const products = [
  { id: 1, name: "Cheese Tart D20 Large Original", category: "Cheese Tart", variant: "D20 Large", price: 170000, image: "https://drive.google.com/thumbnail?id=1bjkst44Rf_xfi4OZKdoGVp4PtXt-vRpC&sz=w600", description: "Cheese tart ukuran besar dengan rasa original creamy cheese, cocok untuk sharing atau acara keluarga." },
  { id: 2, name: "Cheese Tart D20 Large Matcha", category: "Cheese Tart", variant: "D20 Large", price: 195000, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=80", description: "Cheese tart ukuran besar dengan varian matcha creamy, cocok untuk pecinta matcha." },
  { id: 3, name: "Cheese Tart D18 Medium Original", category: "Cheese Tart", variant: "D18 Medium", price: 140000, image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=500&q=80", description: "Ukuran medium dengan rasa original creamy cheese, cocok untuk hadiah atau makan bersama." },
  { id: 4, name: "Cheese Tart D10 Small Original", category: "Cheese Tart", variant: "D10 Small", price: 35000, image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=500&q=80", description: "Ukuran kecil, cocok untuk porsi personal atau sharing kecil." },
  { id: 5, name: "Cheese Tart Slice Original", category: "Cheese Tart", variant: "Slice", price: 27000, image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=500&q=80", description: "Potongan cheese tart praktis untuk sekali makan." },
  { id: 6, name: "Matcha 1 Liter", category: "Matcha", variant: "1 Liter", price: 95000, image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=500&q=80", description: "Matcha creamy ukuran besar, cocok untuk sharing atau stok di rumah." },
  { id: 7, name: "Matcha 200 ml", category: "Matcha", variant: "200 ml", price: 20000, image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=500&q=80", description: "Matcha creamy ukuran personal, praktis untuk sekali minum." },
  { id: 8, name: "Coklat 1 Liter", category: "Coklat", variant: "1 Liter", price: 80000, image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=500&q=80", description: "Minuman coklat creamy ukuran besar dengan rasa rich dan lembut." },
  { id: 9, name: "Coklat 200 ml", category: "Coklat", variant: "200 ml", price: 17000, image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f88c?auto=format&fit=crop&w=500&q=80", description: "Minuman coklat creamy ukuran personal." },
  { id: 10, name: "Kopi 1 Liter", category: "Kopi", variant: "1 Liter", price: 80000, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80", description: "Kopi susu creamy ukuran besar dengan rasa smooth dan seimbang." },
  { id: 11, name: "Kopi 200 ml", category: "Kopi", variant: "200 ml", price: 17000, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80", description: "Kopi susu creamy ukuran personal, praktis untuk sekali minum." }
];

const categories = ["Semua", "Cheese Tart", "Matcha", "Coklat", "Kopi"];
let activeCategory = "Semua";
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const PICKUP_ADDRESS = "Jalan Saribanon Blok H/5 Komplek Ciceri Indah Serang Banten (Masuk Dari Dokterlinda/Indomaret, gang ke dua belok kanan).";
const PICKUP_MAPS = "https://www.google.com/maps/@-6.1236109,106.1695275,3a,75y,15.56h,91.43t/data=!3m7!1e1!3m5!1sXPcLbsiYoNQ0tajxKJ062g!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-1.4286645527671311%26panoid%3DXPcLbsiYoNQ0tajxKJ062g%26yaw%3D15.562582619847838!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDQyOC4wIKXMDSoASAFQAw%3D%3D";

const el = {
  productList: document.getElementById("product-list"),
  filters: document.getElementById("category-filters"),
  cartItems: document.getElementById("cart-items"),
  subtotal: document.getElementById("cart-subtotal-price"),
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
      <article class="product-item">
        <div class="product-main">
          <img src="${p.image}" alt="${p.name}" class="product-thumb" loading="lazy" />
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
