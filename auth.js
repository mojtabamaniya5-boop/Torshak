/* ═══════════ API ═══════════ */
var API_URL = 'http://194.146.69.210';

/* ═══════════ وضعیت ═══════════ */
var currentUser = null;
var authToken = null;

function loadAuth(){
  try{
    var u = localStorage.getItem('torshak.user');
    var t = localStorage.getItem('torshak.token');
    if (u && t){ currentUser = JSON.parse(u); authToken = t; }
  }catch(e){}
}
function saveAuth(user, token){
  currentUser = user; authToken = token;
  localStorage.setItem('torshak.user', JSON.stringify(user));
  localStorage.setItem('torshak.token', token);
}
function clearAuth(){
  currentUser = null; authToken = null;
  localStorage.removeItem('torshak.user');
  localStorage.removeItem('torshak.token');
}

/* ═══════════ API Helper ═══════════ */
function api(path, opts){
  opts = opts || {};
  var headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
  if (opts.headers){
    for (var k in opts.headers) headers[k] = opts.headers[k];
  }
  return fetch(API_URL + path, {
    method: opts.method || 'GET',
    headers: headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  }).then(function(res){
    return res.json().catch(function(){ return {}; }).then(function(data){
      if (!res.ok) throw new Error(data.error || 'خطا در ارتباط');
      return data;
    });
  });
}

/* ═══════════ Toast Helper ═══════════ */
function showAuthToast(msg, icon){
  if (typeof showToast === 'function') showToast(msg, icon || '✓');
}

/* ═══════════ UI کاربر ═══════════ */
function updateUserUI(){
  var btn = document.getElementById('userBtn');
  if (!btn) return;
  if (currentUser){
    btn.classList.add('logged');
    btn.title = currentUser.name || currentUser.phone;
  } else {
    btn.classList.remove('logged');
    btn.title = 'ورود / ثبت‌نام';
  }
}

/* ═══════════ باز کردن شیت ═══════════ */
function openAuthSheet(){
  var sheet = document.getElementById('authSheet');
  renderAuthBody();
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAuthSheet(){
  var sheet = document.getElementById('authSheet');
  sheet.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════ رندر محتوای شیت ═══════════ */
function renderAuthBody(){
  var body = document.getElementById('authBody');
  var title = document.getElementById('authTitle');
  if (currentUser){
    title.textContent = 'حساب من';
    body.innerHTML = renderProfileHTML();
    bindProfileEvents();
  } else {
    title.textContent = 'ورود / ثبت‌نام';
    body.innerHTML = renderAuthFormHTML();
    bindAuthFormEvents();
  }
}

function renderAuthFormHTML(){
  return '' +
    '<div class="auth-tabs">' +
      '<button class="auth-tab active" data-atab="login">ورود</button>' +
      '<button class="auth-tab" data-atab="register">ثبت‌نام</button>' +
    '</div>' +
    '<div class="auth-form" id="authFormWrap">' +
      '<div class="err" id="authErr"></div>' +
      '<div id="authFormInner"></div>' +
    '</div>';
}

function renderLoginForm(){
  return '' +
    '<div class="f"><label>شماره موبایل</label><input type="tel" id="authPhone" dir="ltr" placeholder="09xxxxxxxxx" inputmode="numeric"></div>' +
    '<div class="f"><label>رمز عبور</label><input type="password" id="authPass" dir="ltr" placeholder="••••"></div>' +
    '<button id="doLoginBtn">ورود به حساب</button>' +
    '<div class="swap">حساب نداری؟ <a id="goRegister">ثبت‌نام کن</a></div>';
}

function renderRegisterForm(){
  return '' +
    '<div class="f"><label>نام</label><input type="text" id="authName" placeholder="اسم شما"></div>' +
    '<div class="f"><label>شماره موبایل</label><input type="tel" id="authPhone" dir="ltr" placeholder="09xxxxxxxxx" inputmode="numeric"></div>' +
    '<div class="f"><label>رمز عبور (حداقل ۴ رقم)</label><input type="password" id="authPass" dir="ltr" placeholder="••••"></div>' +
    '<button id="doRegisterBtn">ثبت‌نام</button>' +
    '<div class="swap">حساب داری؟ <a id="goLogin">وارد شو</a></div>';
}

function renderProfileHTML(){
  var initial = (currentUser.name || currentUser.phone || '؟').charAt(0);
  var phoneDisplay = (currentUser.phone || '').replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  return '' +
    '<div class="profile">' +
      '<div class="profile-head">' +
        '<div class="profile-avatar">' + initial + '</div>' +
        '<div class="profile-name">' + (currentUser.name || 'کاربر') + '</div>' +
        '<div class="profile-phone">' + phoneDisplay + '</div>' +
      '</div>' +
      '<div class="profile-stats">' +
        '<div class="profile-stat"><span class="num" id="statOrders">۰</span><span class="lbl">سفارش</span></div>' +
        '<div class="profile-stat"><span class="num" id="statTotal">۰</span><span class="lbl">مجموع خرید (تومان)</span></div>' +
      '</div>' +
      '<div class="profile-actions">' +
        '<button class="paction-btn" id="myOrdersBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>سفارش‌های من</button>' +
        '<button class="paction-btn logout" id="logoutBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>خروج از حساب</button>' +
      '</div>' +
    '</div>';
}

function bindAuthFormEvents(){
  document.querySelectorAll('.auth-tab').forEach(function(t){
    t.onclick = function(){
      document.querySelectorAll('.auth-tab').forEach(function(x){ x.classList.remove('active'); });
      t.classList.add('active');
      var inner = document.getElementById('authFormInner');
      if (t.dataset.atab === 'login'){
        inner.innerHTML = renderLoginForm();
        bindLoginForm();
      } else {
        inner.innerHTML = renderRegisterForm();
        bindRegisterForm();
      }
      document.getElementById('authErr').classList.remove('show');
    };
  });
  // پیش‌فرض: ورود
  document.getElementById('authFormInner').innerHTML = renderLoginForm();
  bindLoginForm();
}

function bindLoginForm(){
  var goReg = document.getElementById('goRegister');
  if (goReg) goReg.onclick = function(){ document.querySelector('.auth-tab[data-atab="register"]').click(); };
  var btn = document.getElementById('doLoginBtn');
  if (btn) btn.onclick = function(){
    var phone = document.getElementById('authPhone').value.trim();
    var pass = document.getElementById('authPass').value;
    if (!phone || !pass){ showErr('شماره و رمز را وارد کن'); return; }
    btn.disabled = true; btn.textContent = 'در حال ورود...';
    api('/api/auth/login', { method: 'POST', body: { phone: phone, password: pass } })
      .then(function(data){
        saveAuth(data.user, data.token);
        updateUserUI();
        showAuthToast('خوش آمدی ' + (data.user.name || ''), '👋');
        renderAuthBody();
      })
      .catch(function(err){
        showErr(err.message);
        btn.disabled = false; btn.textContent = 'ورود به حساب';
      });
  };
}

function bindRegisterForm(){
  var goLog = document.getElementById('goLogin');
  if (goLog) goLog.onclick = function(){ document.querySelector('.auth-tab[data-atab="login"]').click(); };
  var btn = document.getElementById('doRegisterBtn');
  if (btn) btn.onclick = function(){
    var name = document.getElementById('authName').value.trim();
    var phone = document.getElementById('authPhone').value.trim();
    var pass = document.getElementById('authPass').value;
    if (!phone || !pass){ showErr('شماره و رمز را وارد کن'); return; }
    if (pass.length < 4){ showErr('رمز باید حداقل ۴ رقم باشد'); return; }
    btn.disabled = true; btn.textContent = 'در حال ثبت‌نام...';
    api('/api/auth/register', { method: 'POST', body: { phone: phone, name: name, password: pass } })
      .then(function(data){
        saveAuth(data.user, data.token);
        updateUserUI();
        showAuthToast('ثبت‌نام موفق! خوش آمدی', '🎉');
        renderAuthBody();
      })
      .catch(function(err){
        showErr(err.message);
        btn.disabled = false; btn.textContent = 'ثبت‌نام';
      });
  };
}

function showErr(msg){
  var e = document.getElementById('authErr');
  if (!e) return;
  e.textContent = msg;
  e.classList.add('show');
}

function bindProfileEvents(){
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = function(){
    if (confirm('از حساب خارج می‌شوی؟')){
      clearAuth();
      updateUserUI();
      showAuthToast('خارج شدی', '👋');
      renderAuthBody();
    }
  };
  var ordersBtn = document.getElementById('myOrdersBtn');
  if (ordersBtn) ordersBtn.onclick = function(){
    openOrdersSheet();
  };
  // بارگذاری آمار
  loadStats();
}

function loadStats(){
  api('/api/orders').then(function(orders){
    var s1 = document.getElementById('statOrders');
    var s2 = document.getElementById('statTotal');
    if (s1) s1.textContent = fa(orders.length);
    if (s2){
      var total = orders.reduce(function(s, o){ return s + (o.total || 0); }, 0);
      s2.textContent = fa(total.toLocaleString('en-US'));
    }
  }).catch(function(){});
}

/* ═══════════ سفارش‌ها ═══════════ */
function openOrdersSheet(){
  var sheet = document.getElementById('ordersSheet');
  document.getElementById('ordersBody').innerHTML = '<div class="orders-empty"><div class="orders-empty-icon">⏳</div><p>در حال بارگذاری...</p></div>';
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
  api('/api/orders').then(function(orders){
    renderOrders(orders);
  }).catch(function(err){
    document.getElementById('ordersBody').innerHTML = '<div class="orders-empty"><div class="orders-empty-icon">❌</div><p>' + err.message + '</p></div>';
  });
}
function closeOrdersSheet(){
  document.getElementById('ordersSheet').classList.remove('open');
  document.body.style.overflow = '';
}
function renderOrders(orders){
  var body = document.getElementById('ordersBody');
  if (!orders.length){
    body.innerHTML = '<div class="orders-empty"><div class="orders-empty-icon">📦</div><p>هنوز سفارشی ثبت نکردی</p><small style="font-size:11.5px;opacity:.7">اولین سفارشت رو ثبت کن</small></div>';
    return;
  }
  var statusMap = { pending: 'در انتظار تأیید', confirmed: 'تأیید شده', sent: 'ارسال شده', delivered: 'تحویل داده شده' };
  var html = '<div class="orders-list">';
  orders.forEach(function(o){
    var date = new Date(o.created_at);
    var dateStr = date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
    var items = [];
    try { items = JSON.parse(o.items); } catch(e){}
    var itemsText = items.map(function(it){ return '• ' + it.name + ' × ' + it.qty; }).join('<br>');
    html += '<div class="order-card">' +
      '<div class="order-head">' +
        '<div><div class="order-id">سفارش #' + o.id + '</div><div class="order-date">' + dateStr + '</div></div>' +
        '<div class="order-status ' + (o.status || 'pending') + '">' + (statusMap[o.status] || 'در انتظار') + '</div>' +
      '</div>' +
      '<div class="order-items">' + (itemsText || '—') + '</div>' +
      '<div class="order-total">' + fa((o.total || 0).toLocaleString('en-US')) + ' تومان</div>' +
    '</div>';
  });
  html += '</div>';
  body.innerHTML = html;
}

/* ═══════════ ثبت سفارش ═══════════ */
function submitOrderToApi(){
  if (!currentUser){
    showAuthToast('اول وارد شو', '🔐');
    closeCart();
    setTimeout(openAuthSheet, 300);
    return;
  }
  var ids = Object.keys(cart).filter(function(id){ return cart[id] > 0; });
  if (!ids.length){ showAuthToast('سبد خالی است', '🛒'); return; }

  var items = ids.map(function(id){
    var p = PRODUCTS.find(function(x){ return x.id === id; });
    return { id: id, name: p ? p.name : '', price: p ? p.price : 0, qty: cart[id] };
  });
  var total = cartTotal();

  var btn = document.getElementById('checkoutApiBtn');
  if (btn){ btn.disabled = true; btn.textContent = 'در حال ثبت...'; }

  api('/api/orders', {
    method: 'POST',
    body: { items: items, total: total, address: '', note: '' }
  }).then(function(order){
    showAuthToast('سفارش #' + order.id + ' ثبت شد!', '✅');
    cart = {}; saveCart(); updateCartBadge(); closeCart();
    if (btn){ btn.disabled = false; btn.textContent = 'ثبت سفارش در سیستم'; }
  }).catch(function(err){
    showAuthToast(err.message, '❌');
    if (btn){ btn.disabled = false; btn.textContent = 'ثبت سفارش در سیستم'; }
  });
}

/* ═══════════ راه‌اندازی ═══════════ */
function initAuth(){
  loadAuth();
  updateUserUI();
  var btn = document.getElementById('userBtn');
  if (btn) btn.onclick = openAuthSheet;
  var closeAuth = document.getElementById('closeAuth');
  if (closeAuth) closeAuth.onclick = closeAuthSheet;
  var authSheet = document.getElementById('authSheet');
  if (authSheet) authSheet.onclick = function(e){ if (e.target === authSheet) closeAuthSheet(); };
  var closeOrders = document.getElementById('closeOrders');
  if (closeOrders) closeOrders.onclick = closeOrdersSheet;
  var ordersSheet = document.getElementById('ordersSheet');
  if (ordersSheet) ordersSheet.onclick = function(e){ if (e.target === ordersSheet) closeOrdersSheet(); };
  var apiBtn = document.getElementById('checkoutApiBtn');
  if (apiBtn) apiBtn.onclick = submitOrderToApi;
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(initAuth, 100);
});