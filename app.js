/* ═══════════════════════════════════════════════
   ترشک بندری — منطق اصلی فروشگاه
   ═══════════════════════════════════════════════ */

/* ═══════════ ابزارها ═══════════ */
const $ = id => document.getElementById(id);
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const formatPrice = n => fa(Number(n || 0).toLocaleString('en-US'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const safeColor = c => /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#b8341e';
const safeUrl = u => /^(\.\/|\/|images\/|https?:\/\/)/i.test(u || '') ? u : null;

/* ═══════════ داده‌ها ═══════════ */
let catalog = { shop: {}, categories: [], products: [] };
let activeCat = 'all';
let cart = {};            // { productId: qty }
let sheetQty = 1;
let sheetProduct = null;

function normalize(d) {
  d = d || {};
  const categories = Array.isArray(d.CATEGORIES) ? d.CATEGORIES.slice() : [];
  if (!categories.some(c => c.id === 'all')) {
    categories.unshift({ id: 'all', name: 'همه', emoji: '🍽️' });
  }
  return {
    shop: d.SHOP || {},
    categories,
    products: Array.isArray(d.PRODUCTS) ? d.PRODUCTS : []
  };
}

function loadCatalog() {
  // اولویت با داده‌ای است که پنل مدیریت در localStorage ذخیره کرده
  let d = {
    SHOP: typeof SHOP !== 'undefined' ? SHOP : {},
    CATEGORIES: typeof CATEGORIES !== 'undefined' ? CATEGORIES : [],
    PRODUCTS: typeof PRODUCTS !== 'undefined' ? PRODUCTS : []
  };
  try {
    const saved = JSON.parse(localStorage.getItem('torshak_data') || 'null');
    if (saved && Array.isArray(saved.PRODUCTS)) d = saved;
  } catch (e) { /* نادیده بگیر */ }
  catalog = normalize(d);
}

/* ═══════════ سبد خرید ═══════════ */
function loadCart() {
  try { cart = JSON.parse(localStorage.getItem('torshak_cart') || '{}') || {}; }
  catch (e) { cart = {}; }
}
function saveCart() {
  localStorage.setItem('torshak_cart', JSON.stringify(cart));
}
function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = catalog.products.find(x => x.id === id);
    return sum + (p ? Number(p.price) * qty : 0);
  }, 0);
}
function addToCart(id, qty = 1) {
  cart[id] = (cart[id] || 0) + qty;
  if (cart[id] <= 0) delete cart[id];
  saveCart(); updateBadge();
}
function setCartQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  saveCart(); updateBadge(); renderCart();
}
function updateBadge() {
  const n = cartCount();
  const badge = $('navBadge');
  badge.textContent = fa(n);
  badge.classList.toggle('show', n > 0);
}

/* ═══════════ Toast ═══════════ */
let toastTimer = null;
function toast(msg, icon = '✅') {
  const t = $('toast');
  t.innerHTML = '<span class="toast-icon">' + icon + '</span>' + esc(msg);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ═══════════ رندر دسته‌بندی‌ها ═══════════ */
function renderCategories() {
  const pills = $('categories');
  const drawer = $('drawerCats');
  pills.innerHTML = '';
  drawer.innerHTML = '';
  catalog.categories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-pill' + (c.id === activeCat ? ' active' : '');
    btn.textContent = (c.emoji ? c.emoji + ' ' : '') + c.name;
    btn.onclick = () => { activeCat = c.id; renderCategories(); renderProducts(); };
    pills.appendChild(btn);

    const dbtn = document.createElement('button');
    dbtn.className = 'drawer-cat' + (c.id === activeCat ? ' active' : '');
    dbtn.innerHTML = '<span class="drawer-cat-emoji">' + (c.emoji || '🍽️') + '</span>' + esc(c.name);
    dbtn.onclick = () => { activeCat = c.id; renderCategories(); renderProducts(); closeDrawerFn(); scrollToProducts(); };
    drawer.appendChild(dbtn);
  });
}

/* ═══════════ رندر محصولات ═══════════ */
function productMedia(p, cls) {
  const url = safeUrl(p.img);
  if (url) return '<div class="' + cls + '" style="background:#f3e7d3"><img src="' + esc(url) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.parentNode.textContent=\'' + esc(p.emoji || '🫙') + '\'"></div>';
  return '<div class="' + cls + '" style="background:' + safeColor(p.color) + '22">' + (p.emoji || '🫙') + '</div>';
}

function renderProducts() {
  const grid = $('productsGrid');
  const list = catalog.products.filter(p => activeCat === 'all' || p.cat === activeCat);
  $('productsCount').textContent = fa(list.length) + ' محصول';
  $('emptyState').style.display = list.length ? 'none' : 'block';
  grid.innerHTML = '';

  list.forEach((p, i) => {
    const out = p.stock === false;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML =
      productMedia(p, 'product-img') +
      (p.badge ? '<span class="product-badge' + (out ? ' out' : '') + '">' + (out ? 'ناموجود' : esc(p.badge)) + '</span>' : (out ? '<span class="product-badge out">ناموجود</span>' : '')) +
      '<div class="product-body">' +
        '<div class="product-name">' + esc(p.name) + '</div>' +
        '<div class="product-unit">' + esc(p.unit || '') + '</div>' +
        '<div class="product-price-row">' +
          '<div class="product-prices">' +
            (p.oldPrice ? '<span class="product-old">' + formatPrice(p.oldPrice) + '</span>' : '') +
            '<span class="product-price">' + formatPrice(p.price) + '<span>تومان</span></span>' +
          '</div>' +
          '<button class="add-btn" aria-label="افزودن" ' + (out ? 'disabled' : '') + ' data-add="' + esc(p.id) + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    card.onclick = e => {
      if (e.target.closest('[data-add]')) return;
      openProductSheet(p);
    };
    grid.appendChild(card);
  });

  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.onclick = () => {
      addToCart(btn.dataset.add, 1);
      toast('به سبد اضافه شد', '🛒');
    };
  });
}

/* ═══════════ شیت جزئیات محصول ═══════════ */
function openProductSheet(p) {
  sheetProduct = p;
  sheetQty = 1;
  const out = p.stock === false;
  const discount = p.oldPrice && p.oldPrice > p.price
    ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  $('productSheetContent').innerHTML =
    '<div class="sheet-handle"></div>' +
    '<div class="sheet-header">' +
      '<h3>جزئیات محصول</h3>' +
      '<button class="icon-close" id="closeProductSheet" aria-label="بستن">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="product-detail">' +
      productMedia(p, 'detail-img') +
      '<div class="detail-body">' +
        '<div class="detail-name">' + esc(p.name) + '</div>' +
        '<div class="detail-unit">' + esc(p.unit || '') + (p.badge ? ' · ' + esc(p.badge) : '') + '</div>' +
        '<div class="detail-price-row">' +
          '<span class="detail-price">' + formatPrice(p.price) + '<span>تومان</span></span>' +
          (p.oldPrice ? '<span class="detail-old">' + formatPrice(p.oldPrice) + '</span>' : '') +
          (discount ? '<span class="detail-discount">٪' + fa(discount) + ' تخفیف</span>' : '') +
        '</div>' +
        (p.desc ? '<p class="detail-desc">' + esc(p.desc) + '</p>' : '') +
        (p.ingredients ? '<div class="detail-ingredients"><h5>مواد تشکیل‌دهنده</h5><p>' + esc(p.ingredients) + '</p></div>' : '') +
      '</div>' +
      '<div class="detail-actions">' +
        '<div class="qty-control">' +
          '<button class="qty-btn" id="qtyPlus">+</button>' +
          '<span class="qty-value" id="qtyValue">' + fa(1) + '</span>' +
          '<button class="qty-btn" id="qtyMinus">−</button>' +
        '</div>' +
        '<button class="detail-add" id="detailAdd" ' + (out ? 'disabled' : '') + '>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
          (out ? 'ناموجود' : 'افزودن به سبد') +
        '</button>' +
      '</div>' +
    '</div>';

  openOverlay('productSheet');

  $('closeProductSheet').onclick = () => closeOverlay('productSheet');
  $('qtyPlus').onclick = () => { sheetQty++; $('qtyValue').textContent = fa(sheetQty); };
  $('qtyMinus').onclick = () => { if (sheetQty > 1) { sheetQty--; $('qtyValue').textContent = fa(sheetQty); } };
  if (!out) $('detailAdd').onclick = () => {
    addToCart(p.id, sheetQty);
    closeOverlay('productSheet');
    toast('به سبد اضافه شد', '🛒');
  };
}

/* ═══════════ شیت سبد خرید ═══════════ */
function renderCart() {
  const body = $('cartBody');
  const footer = $('cartFooter');
  const ids = Object.keys(cart);

  if (!ids.length) {
    footer.style.display = 'none';
    body.innerHTML =
      '<div class="cart-empty">' +
        '<div class="cart-empty-icon">🛒</div>' +
        '<p>سبد خرید شما خالی است</p>' +
        '<small>از لیست محصولات، چیزی خوشمزه انتخاب کنید</small>' +
      '</div>';
    return;
  }

  footer.style.display = 'block';
  body.innerHTML = '';
  ids.forEach(id => {
    const p = catalog.products.find(x => x.id === id);
    if (!p) return;
    const qty = cart[id];
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML =
      productMedia(p, 'cart-item-img') +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + esc(p.name) + '</div>' +
        '<div class="cart-item-price">' + formatPrice(p.price * qty) + ' تومان</div>' +
      '</div>' +
      '<div class="cart-item-qty">' +
        '<button data-inc="' + esc(id) + '">+</button>' +
        '<span>' + fa(qty) + '</span>' +
        '<button data-dec="' + esc(id) + '">−</button>' +
      '</div>';
    body.appendChild(row);
  });

  body.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => setCartQty(b.dataset.inc, cart[b.dataset.inc] + 1));
  body.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => setCartQty(b.dataset.dec, cart[b.dataset.dec] - 1));
  $('cartTotal').textContent = formatPrice(cartTotal()) + ' تومان';
}

function checkout() {
  if (!cartCount()) return;
  const shop = catalog.shop;
  const wa = String(shop.whatsapp || '').replace(/\D/g, '');
  if (!wa) { toast('شماره واتساپ تنظیم نشده است', '⚠️'); return; }

  let msg = 'سلام، سفارش من از ترشک بندری:\n\n';
  Object.keys(cart).forEach(id => {
    const p = catalog.products.find(x => x.id === id);
    if (p) msg += '▪️ ' + p.name + ' × ' + fa(cart[id]) + ' — ' + formatPrice(p.price * cart[id]) + ' تومان\n';
  });
  msg += '\n💰 جمع کل: ' + formatPrice(cartTotal()) + ' تومان';

  window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(msg), '_blank');
}

/* ═══════════ اورلی‌ها و دراور ═══════════ */
function openOverlay(id) { $(id).classList.add('open'); }
function closeOverlay(id) { $(id).classList.remove('open'); }
function openDrawerFn() { $('drawerOverlay').classList.add('open'); $('drawer').classList.add('open'); }
function closeDrawerFn() { $('drawerOverlay').classList.remove('open'); $('drawer').classList.remove('open'); }
function scrollToProducts() {
  const el = $('products');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ═══════════ اطلاعات فروشگاه ═══════════ */
function renderShopInfo() {
  const s = catalog.shop;
  if (s.tagline) $('headerTagline').textContent = s.tagline;
  if (s.phone) $('shopPhoneDisplay').textContent = fa(s.phone);
  if (s.address) $('shopAddress').textContent = s.address;
}

function openWhatsapp() {
  const wa = String(catalog.shop.whatsapp || '').replace(/\D/g, '');
  if (!wa) { toast('شماره واتساپ تنظیم نشده است', '⚠️'); return; }
  window.open('https://wa.me/' + wa, '_blank');
}
function openInstagram() {
  const ig = String(catalog.shop.instagram || '').replace(/^@/, '');
  if (!ig) { toast('اینستاگرام تنظیم نشده است', '⚠️'); return; }
  window.open('https://instagram.com/' + ig, '_blank');
}
function callPhone() {
  const ph = String(catalog.shop.phone || catalog.shop.whatsapp || '').replace(/\D/g, '');
  if (!ph) { toast('شماره تماس تنظیم نشده است', '⚠️'); return; }
  location.href = 'tel:+' + (ph.startsWith('98') ? ph : '98' + ph.replace(/^0/, ''));
}

/* ═══════════ رویدادها ═══════════ */
function bindEvents() {
  $('hamburgerBtn').onclick = openDrawerFn;
  $('closeDrawer').onclick = closeDrawerFn;
  $('drawerOverlay').onclick = closeDrawerFn;

  $('navHome').onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  $('navCart').onclick = () => { renderCart(); openOverlay('cartSheet'); };
  $('navWhatsapp').onclick = openWhatsapp;
  $('navInstagram').onclick = openInstagram;

  $('drawerWhatsapp').onclick = () => { closeDrawerFn(); openWhatsapp(); };
  $('drawerInstagram').onclick = () => { closeDrawerFn(); openInstagram(); };
  $('drawerPhone').onclick = () => { closeDrawerFn(); callPhone(); };

  $('closeCart').onclick = () => closeOverlay('cartSheet');
  $('cartSheet').onclick = e => { if (e.target === $('cartSheet')) closeOverlay('cartSheet'); };
  $('productSheet').onclick = e => { if (e.target === $('productSheet')) closeOverlay('productSheet'); };
  $('checkoutBtn').onclick = checkout;
}

/* ═══════════ شروع ═══════════ */
function init() {
  loadCatalog();
  loadCart();
  renderShopInfo();
  renderCategories();
  renderProducts();
  updateBadge();
  bindEvents();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
