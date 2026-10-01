/* ترشک بندری — Service Worker
   - کد و داده (html/js/json/css): اول شبکه، با تایم‌اوت ۵ ثانیه، بعد کش
   - عکس و آیکون: اول کش
   - فونت: اول کش
   - پنل ادمین و API گیت‌هاب: اصلاً دست نمی‌خوره */

const CACHE = 'torshak-v7';
const FONT_CACHE = 'torshak-fonts-v6';
const NETWORK_TIMEOUT = 5000;

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './products.json',
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
    // cache:'reload' یعنی از کش HTTP مرورگر نخون و نسخه‌ی تازه رو بگیر
    await Promise.all(ASSETS.map(u =>
