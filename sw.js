/* ترشک بندری — Service Worker
   - کد و داده (html/js/json/css): اول شبکه، با تایم‌اوت ۵ ثانیه، بعد کش
   - عکس و آیکون: اول کش
   - فونت: اول کش
   - پنل ادمین و صفحه بررسی: اصلاً دست نمی‌خوره */

const CACHE = 'torshak-v9';
const FONT_CACHE = 'torshak-fonts-v9';
const NETWORK_TIMEOUT = 5000;

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './products.js',
  './manifest.json',
  './icon.svg'
];

const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Lalezar&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(u =>
      c.add(new Request(u, { cache: 'reload' })).catch(() => null)
    ));
    const f = await caches.open(FONT_CACHE);
    await Promise.all(FONT_URLS.map(u => f.add(u).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k !== CACHE && k !== FONT_CACHE)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const timeoutFetch = (req, ms) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('timeout')), ms);
  fetch(req).then(r => { clearTimeout(t); resolve(r); },
                 err => { clearTimeout(t); reject(err); });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // پنل مدیریت، صفحه بررسی و درخواست‌های غیر GET دست نخورده بمانند
  if (url.pathname.endsWith('/admin.html') || url.pathname.endsWith('/fix.html')) return;
  if (!url.protocol.startsWith('http')) return;

  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isImage = /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(url.pathname);

  // فونت و عکس: اول کش، بعد شبکه (و ذخیره در کش)
  if (isFont || isImage) {
    e.respondWith((async () => {
      const cacheName = isFont ? FONT_CACHE : CACHE;
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) {
          const c = await caches.open(cacheName);
          c.put(req, res.clone());
        }
        return res;
      } catch (err) {
        return cached || Response.error();
      }
    })());
    return;
  }

  // فقط درخواست‌های هم‌مبدا کش شوند
  if (url.origin !== self.location.origin) return;

  // کد و داده: اول شبکه (با تایم‌اوت)، بعد کش
  e.respondWith((async () => {
    try {
      const res = await timeoutFetch(new Request(req, { cache: 'no-cache' }), NETWORK_TIMEOUT);
      if (res && res.ok) {
        const c = await caches.open(CACHE);
        c.put(req, res.clone());
      }
      return res;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const home = await caches.match('./index.html');
        if (home) return home;
      }
      return Response.error();
    }
  })());
});
