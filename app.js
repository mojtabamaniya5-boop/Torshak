const $ = id => document.getElementById(id);
const fa = n => n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const formatPrice = n => fa(n.toLocaleString('en-US'));
let cart = loadCart();
let currentCategory = 'all';
let currentProduct = null;
let currentQty = 1;
let searchQuery = '';
let checkInterval = null;
function loadCart(){try{const raw=localStorage.getItem('torshak.cart');return raw?JSON.parse(raw):{};}catch{return {};}}
function saveCart(){try{localStorage.setItem('torshak.cart',JSON.stringify(cart));}catch{}}
function cartCount(){return Object.values(cart).reduce((s,q)=>s+q,0);}
function cartTotal(){let t=0;for(const id in cart){const p=PRODUCTS.find(p=>p.id===id);if(p)t+=p.price*cart[id];}return t;}

function getRawBase(){
  const host = location.hostname;
  if (host.endsWith('.github.io')){
    const user = host.replace('.github.io', '');
    const parts = location.pathname.split('/').filter(Boolean);
    const repo = parts[0] || '';
    if (user && repo){
      return 'https://raw.githubusercontent.com/' + user + '/' + repo + '/main/';
    }
  }
  return './';
}

function init(){
  $('headerTagline').textContent = SHOP.tagline;
  $('shopAddress').textContent = SHOP.address || '—';
  if(SHOP.whatsapp){const p=SHOP.whatsapp.replace(/^98/,'0').replace(/^0/,'');$('shopPhoneDisplay').textContent=fa(p.replace(/(\d{4})(\d{3})(\d{4})/,'$1 $2 $3'));}
  renderCategories();renderProducts();renderDrawerCats();updateCartBadge();
  $('navHome').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  $('navCart').addEventListener('click',openCart);
  $('navWhatsapp').addEventListener('click',contactWhatsapp);
  $('navInstagram').addEventListener('click',contactInstagram);
  $('hamburgerBtn').addEventListener('click',openDrawer);
  $('closeDrawer').addEventListener('click',closeDrawer);
  $('drawerOverlay').addEventListener('click',closeDrawer);
  $('drawerWhatsapp').addEventListener('click',()=>{closeDrawer();contactWhatsapp();});
  $('drawerInstagram').addEventListener('click',()=>{closeDrawer();contactInstagram();});
  $('drawerPhone').addEventListener('click',()=>{closeDrawer();contactPhone();});
  $('closeCart').addEventListener('click',closeCart);
  $('cartSheet').addEventListener('click',e=>{if(e.target.id==='cartSheet')closeCart();});
  $('productSheet').addEventListener('click',e=>{if(e.target.id==='productSheet')closeProduct();});
  $('checkoutBtn').addEventListener('click',checkoutWhatsapp);
  const si=$('searchInput'),sc=$('searchClear');let st;
  si.addEventListener('input',e=>{clearTimeout(st);st=setTimeout(()=>{searchQuery=e.target.value.trim().toLowerCase();sc.style.display=searchQuery?'grid':'none';renderProducts();},200);});
  sc.addEventListener('click',()=>{si.value='';searchQuery='';sc.style.display='none';renderProducts();si.focus();});
  if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
  startAutoUpdate();
  renderFeatured();
  showWelcomeIfFirstTime();
}

async function checkForUpdates(){
  try{
    const base = getRawBase();
    const vRes = await fetch(base + 'version.json?_=' + Date.now(), { cache: 'no-store' });
    if (!vRes.ok) return false;
    const vData = await vRes.json();
    const sv = vData.v;
    const lv = localStorage.getItem('torshak.version');
    if (sv && sv !== lv){
      await loadNewProducts(sv, base);
      localStorage.setItem('torshak.version', sv);
      return true;
    }
    return false;
  } catch(e){
    return false;
  }
}

async function loadNewProducts(version, base){
  try{
    const url = (base || getRawBase()) + 'products.js?v=' + version + '&_=' + Date.now();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network');
    const text = await res.text();
    const blob = new Blob([text], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    await new Promise((resolve,reject)=>{
      const s = document.createElement('script');
      s.src = blobUrl;
      s.onload = () => { URL.revokeObjectURL(blobUrl); resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    renderCategories();
    renderProducts();
    renderDrawerCats();
    updateCartBadge();
    if (typeof SHOP !== 'undefined'){
      $('headerTagline').textContent = SHOP.tagline;
      $('shopAddress').textContent = SHOP.address || '—';
      if (SHOP.whatsapp){
        const p = SHOP.whatsapp.replace(/^98/,'0').replace(/^0/,'');
        $('shopPhoneDisplay').textContent = fa(p.replace(/(\d{4})(\d{3})(\d{4})/,'$1 $2 $3'));
      }
    }
    showUpdateBanner();
  } catch(e){
    console.warn('Load failed:', e);
  }
}

function showUpdateBanner(){
  const old=document.getElementById('updateBanner');if(old)old.remove();
  const banner=document.createElement('div');banner.id='updateBanner';banner.className='update-banner';banner.innerHTML='✨ محصولات جدید اضافه شد';document.body.appendChild(banner);
  requestAnimationFrame(()=>banner.classList.add('show'));
  setTimeout(()=>{banner.classList.remove('show');setTimeout(()=>banner.remove(),400);},3000);
}

function startAutoUpdate(){
  setTimeout(()=>checkForUpdates(),800);
  if(checkInterval)clearInterval(checkInterval);
  checkInterval=setInterval(()=>checkForUpdates(),5*60*1000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdates();});
  window.addEventListener('online',()=>checkForUpdates());
}

const drawer=$('drawer'),drawerOverlay=$('drawerOverlay');
function openDrawer(){drawer.classList.add('open');drawerOverlay.classList.add('open');document.body.style.overflow='hidden';}
function closeDrawer(){drawer.classList.remove('open');drawerOverlay.classList.remove('open');document.body.style.overflow='';}
function contactWhatsapp(){if(!SHOP.whatsapp)return;const msg=encodeURIComponent('سلام، از اپ کافه ترشی مزاحم شدم 🌶️');window.open('https://wa.me/'+SHOP.whatsapp+'?text='+msg,'_blank');}
function contactInstagram(){if(!SHOP.instagram)return;window.open('https://instagram.com/'+SHOP.instagram,'_blank');}
function contactPhone(){if(!SHOP.whatsapp)return;const phone=SHOP.whatsapp.replace(/^98/,'0');window.location.href='tel:'+phone;}
function setCategory(id){currentCategory=id;document.querySelectorAll('.cat-pill').forEach(x=>{x.classList.toggle('active',x.dataset.cat===id);});document.querySelectorAll('.drawer-cat').forEach(x=>{x.classList.toggle('active',x.dataset.cat===id);});renderProducts();}
function renderCategories(){const wrap=$('categories');wrap.innerHTML='';CATEGORIES.forEach(c=>{const btn=document.createElement('button');btn.className='cat-pill'+(c.id==='all'?' active':'');btn.dataset.cat=c.id;btn.innerHTML='<span>'+c.emoji+'</span><span>'+c.name+'</span>';btn.addEventListener('click',()=>setCategory(c.id));wrap.appendChild(btn);});}
function renderDrawerCats(){const wrap=$('drawerCats');wrap.innerHTML='';CATEGORIES.forEach(c=>{const btn=document.createElement('button');btn.className='drawer-cat'+(c.id===currentCategory?' active':'');btn.dataset.cat=c.id;btn.innerHTML='<span class="drawer-cat-emoji">'+c.emoji+'</span><span>'+c.name+'</span>';btn.addEventListener('click',()=>{setCategory(c.id);closeDrawer();setTimeout(()=>{$('products').scrollIntoView({behavior:'smooth',block:'start'});},350);});wrap.appendChild(btn);});}
function getFilteredProducts(){let list=currentCategory==='all'?PRODUCTS:PRODUCTS.filter(p=>p.category===currentCategory);if(searchQuery){list=list.filter(p=>{const hay=[p.name||'',p.description||'',p.ingredients||'',p.unit||''].join(' ').toLowerCase();return hay.includes(searchQuery);});}return list;}
function renderProducts(){const grid=$('productsGrid');const list=getFilteredProducts();grid.innerHTML='';
  if(!list.length){$('emptyState').style.display='block';$('productsCount').textContent='';$('emptyText').textContent=searchQuery?'محصولی با «'+searchQuery+'» پیدا نشد':'محصولی در این دسته پیدا نشد';return;}
  $('emptyState').style.display='none';$('productsCount').textContent=fa(list.length)+' محصول';
  list.forEach((p,i)=>{const card=document.createElement('div');card.className='product-card';card.style.animationDelay=(i*0.04)+'s';
    const hd=p.oldPrice&&p.oldPrice>p.price;const dp=hd?Math.round((1-p.price/p.oldPrice)*100):0;const out=p.inStock===false;const im=p.img||p.image;
    card.innerHTML='<div class="product-img" style="background:'+gradientFor(p.color)+'">'+(im?'<img src="'+im+'" alt="'+p.name+'" loading="lazy">':'<span>'+(p.emoji||'🫙')+'</span>')+(hd&&!out?'<span class="discount-badge">'+fa(dp)+'٪</span>':'')+(p.featured?'<span class="product-badge">پیشنهاد ویژه</span>':'')+(out?'<span class="product-badge out">ناموجود</span>':'')+'</div><div class="product-body"><div class="product-name">'+p.name+'</div><div class="product-unit">'+(p.unit||'—')+'</div><div class="product-price-row"><div class="product-prices">'+(hd?'<span class="product-old">'+formatPrice(p.oldPrice)+'</span>':'')+'<span class="product-price">'+formatPrice(p.price)+'<span>تومان</span></span></div><button class="add-btn" '+(out?'disabled':'')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button></div></div>';
    card.addEventListener('click',e=>{if(e.target.closest('.add-btn'))return;openProduct(p.id);});
    const ab=card.querySelector('.add-btn');if(!out){ab.addEventListener('click',e=>{e.stopPropagation();addToCart(p.id,1);bounceBtn(ab);});}
    grid.appendChild(card);});}
function gradientFor(color){const c=color||'#b8341e';return 'linear-gradient(135deg, '+c+'22 0%, '+c+'44 100%)';}
function openProduct(id){const p=PRODUCTS.find(p=>p.id===id);if(!p)return;currentProduct=p;currentQty=1;
  const hd=p.oldPrice&&p.oldPrice>p.price;const dp=hd?Math.round((1-p.price/p.oldPrice)*100):0;const out=p.inStock===false;const im=p.img||p.image;
  $('productSheetContent').innerHTML='<div class="sheet-handle"></div><div class="product-detail"><div class="detail-img" style="background:'+gradientFor(p.color)+'">'+(im?'<img src="'+im+'" alt="'+p.name+'">':'<span>'+(p.emoji||'🫙')+'</span>')+(hd&&!out?'<span class="detail-discount">'+fa(dp)+'٪ تخفیف</span>':'')+(p.featured?'<span class="detail-badge">⭐ پیشنهاد ویژه</span>':'')+(out?'<span class="detail-badge" style="background:#6b6b6b;color:#fff">ناموجود</span>':'')+'</div><div class="detail-body"><h2 class="detail-name">'+p.name+'</h2><div class="detail-unit">'+(p.unit||'—')+'</div><div class="detail-price-row"><span class="detail-price">'+formatPrice(p.price)+'<span>تومان</span></span>'+(hd?'<span class="detail-old">'+formatPrice(p.oldPrice)+'</span>':'')+'</div>'+(p.description?'<p class="detail-desc">'+p.description+'</p>':'')+(p.ingredients?'<div class="detail-ingredients"><h5>🧂 مواد اولیه</h5><p>'+p.ingredients+'</p></div>':'')+'</div><div class="detail-actions"><div class="qty-control"><button class="qty-btn" id="qtyMinus" '+(out?'disabled':'')+'>−</button><span class="qty-value" id="qtyValue">'+fa(currentQty)+'</span><button class="qty-btn" id="qtyPlus" '+(out?'disabled':'')+'>+</button></div><button class="detail-add" id="detailAdd" '+(out?'disabled':'')+'>'+(out?'ناموجود':'افزودن به سبد')+'</button></div></div>';
  if(!out){$('qtyMinus').addEventListener('click',()=>{if(currentQty>1){currentQty--;updateQtyUI();}});$('qtyPlus').addEventListener('click',()=>{if(currentQty<99){currentQty++;updateQtyUI();}});$('detailAdd').addEventListener('click',()=>{addToCart(p.id,currentQty);closeProduct();setTimeout(openCart,250);});}
  $('productSheet').classList.add('open');document.body.style.overflow='hidden';}
function updateQtyUI(){$('qtyValue').textContent=fa(currentQty);$('qtyMinus').disabled=currentQty<=1;}
function closeProduct(){$('productSheet').classList.remove('open');document.body.style.overflow='';}
function addToCart(id,qty){cart[id]=(cart[id]||0)+qty;saveCart();updateCartBadge();showToast('به سبد اضافه شد','🌶️');}
function updateCartBadge(){const count=cartCount();const badge=$('navBadge');const nav=$('navCart');if(count>0){badge.textContent=fa(count);badge.classList.add('show');nav.classList.add('active');setTimeout(()=>nav.classList.remove('active'),600);}else{badge.classList.remove('show');}}
function openCart(){renderCart();$('cartSheet').classList.add('open');document.body.style.overflow='hidden';}
function closeCart(){$('cartSheet').classList.remove('open');document.body.style.overflow='';}
function renderCart(){const body=$('cartBody');const footer=$('cartFooter');const ids=Object.keys(cart).filter(id=>cart[id]>0);
  if(!ids.length){body.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>سبد خرید خالیه</p><small>یه سر به محصولات ما بزن</small></div>';footer.style.display='none';return;}
  body.innerHTML='';footer.style.display='block';
  ids.forEach(id=>{const p=PRODUCTS.find(p=>p.id===id);if(!p)return;const qty=cart[id];const im=p.img||p.image;
    const row=document.createElement('div');row.className='cart-item';
    row.innerHTML='<div class="cart-item-img" style="background:'+gradientFor(p.color)+'">'+(im?'<img src="'+im+'" alt="">':'<span>'+(p.emoji||'🫙')+'</span>')+'</div><div class="cart-item-info"><div class="cart-item-name">'+p.name+'</div><div class="cart-item-price">'+formatPrice(p.price)+' × '+fa(qty)+'</div></div><div class="cart-item-qty"><button data-act="minus">−</button><span>'+fa(qty)+'</span><button data-act="plus">+</button></div>';
    row.querySelector('[data-act="minus"]').addEventListener('click',()=>{cart[id]--;if(cart[id]<=0)delete cart[id];saveCart();updateCartBadge();renderCart();});
    row.querySelector('[data-act="plus"]').addEventListener('click',()=>{cart[id]++;saveCart();updateCartBadge();renderCart();});
    body.appendChild(row);});
  $('cartTotal').textContent=formatPrice(cartTotal())+' تومان';}
function checkoutWhatsapp(){const ids=Object.keys(cart).filter(id=>cart[id]>0);if(!ids.length)return;
  let msg='🌶️ *سفارش جدید از '+SHOP.name+'*\n\n📦 *محصولات:*\n';
  ids.forEach(id=>{const p=PRODUCTS.find(p=>p.id===id);if(!p)return;const qty=cart[id];const sub=p.price*qty;msg+='• '+p.name+' × '+fa(qty)+' = '+formatPrice(sub)+' تومان\n';});
  msg+='\n💰 *جمع کل: '+formatPrice(cartTotal())+' تومان*\n\n📍 لطفاً آدرس و نحوه ارسال رو اعلام بفرمایید.';
  window.open('https://wa.me/'+SHOP.whatsapp+'?text='+encodeURIComponent(msg),'_blank');}
let toastTimer;
function showToast(text,icon){icon=icon||'✓';const t=$('toast');t.innerHTML='<span class="toast-icon">'+icon+'</span><span>'+text+'</span>';clearTimeout(toastTimer);t.classList.remove('show');requestAnimationFrame(()=>{requestAnimationFrame(()=>{t.classList.add('show');toastTimer=setTimeout(()=>t.classList.remove('show'),2000);});});}
function bounceBtn(btn){btn.style.transform='scale(1.25)';setTimeout(()=>{btn.style.transform='';},200);}
document.addEventListener('DOMContentLoaded',init);
document.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(!link)return;e.preventDefault();const target=document.querySelector(link.getAttribute('href'));if(target)target.scrollIntoView({behavior:'smooth',block:'start'});});
