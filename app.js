/* ═══════════ ابزارها ═══════════ */
const $ = id => document.getElementById(id);
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const formatPrice = n => fa(Number(n || 0).toLocaleString('en-US'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const safeColor = c => /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#b8341e';

/* ═══════════ داده‌ها ═══════════
   توجه: عمداً اسم SHOP / CATEGORIES / PRODUCTS رو تعریف نمی‌کنیم،
   چون products.js (فایل قدیمی) همین اسم‌ها رو با const تعریف می‌کنه
   و تعریف دوباره‌شون خطا می‌ده. */
let catalog = { shop: {}, categories: [], products: [] };

function normalize(d){
  d = d || {};
  const categories = Array.isArray(d.CATEGORIES) ? d.CATEGORIES.slice() : [];
  if (!categories.some(c => c.id === 'all')){
    categories.unshift({ id: 'all', name: 'همه', emoji: '🌶️' });
  }
  return {
    shop: d.SHOP || {},
    categories,
    products: Array.isArray(d.PRODUCTS) ? d.PRODUCTS : []
  };
}
