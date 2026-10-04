📘 سند مادر — ساخت فروشگاه اینترنتی موبایل‌فرست

بذار کاملش رو بنویسم. این سند همه چیز رو داره: معماری، اشتباهات، راه‌حل‌ها، اسکریپت‌ها، و راهنمای مشتری جدید.

---

📋 چیکار کن

1. برو GitHub → Torshak → MASTER.md → مداد (ویرایش)
2. کل محتوا رو پاک کن
3. متن زیر رو پیست کن
4. Commit changes

---

```markdown
# 📘 سند مادر — فروشگاه اینترنتی موبایل‌فرست

> راهنمای کامل ساخت، راه‌اندازی، و فروش فروشگاه اینترنتی
> برای کسبه محلی (بوشهر و بعداً جاهای دیگه)
> همه کارها از گوشی، بدون کامپیوتر

---

## 🎯 هدف پروژه

ساخت یه سیستم که با اون بشه:
1. برای هر کسبه یه فروشگاه موبایل‌فرست ساخت
2. فقط با تغییر رنگ، اسم و محصولات → سایت جدید
3. همه کارها از گوشی (بدون کامپیوتر)

**مدل کسب‌وکار:**
- راه‌اندازی: ۱.۵ میلیون تومان
- اشتراک ماهانه: ۲۵۰ هزار تومان
- پکیج حرفه‌ای: ۳ میلیون تومان

---

## 🏗️ معماری کلی

```

┌─────────────────────────────────────────┐
│  فرانت‌اند (PWA)                         │
│  - GitHub Pages (رایگان)                │
│  - HTML/CSS/JS خالص                     │
│  - نصب‌شدنی + آفلاین                     │
└──────────────┬──────────────────────────┘
│ API (HTTPS)
▼
┌─────────────────────────────────────────┐
│  بک‌اند (Node.js)                        │
│  - سرور Ubuntu (webdade - ایران)        │
│  - Express + PostgreSQL                  │
│  - Nginx + PM2                          │
└─────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│  دیتابیس PostgreSQL                      │
│  - جدول users (ثبت‌نام مشتری)             │
│  - جدول orders (سفارش‌ها)                 │
└─────────────────────────────────────────┘

```

---

## 🧰 تکنولوژی‌های استفاده‌شده

| لایه | تکنولوژی | چرا |
|---|---|---|
| فرانت‌اند | HTML/CSS/JS خالص | بدون build، سریع، سبک |
| PWA | Service Worker + Manifest | آفلاین + نصب‌شدنی |
| میزبانی فرانت | GitHub Pages | رایگان، راحت از گوشی |
| میزبانی بک‌اند | webdade (ایران) | بدون فیلترشکن |
| بک‌اند | Node.js + Express | ساده، سبک |
| دیتابیس | PostgreSQL | قدرتمند، رایگان |
| وب‌سرور | Nginx | پروکسی + SSL |
| پروسه‌منیجر | PM2 | همیشه روشن |
| DNS | آروان CDN | رایگان، ایرانی |
| فونت | Vazirmatn + Lalezar | فارسی زیبا |

---

## 🚨 اشتباهات و درس‌ها (مهم‌ترین بخش این سند)

### اشتباه ۱: انتخاب Supabase
- ❌ از Supabase استفاده کردیم
- 🎯 **مشکل:** برای کاربر ایرانی نیاز به VPN
- ✅ **درس:** برای ایران، اول لیارا/آروان/webdade رو چک کن

### اشتباه ۲: انتخاب لیارا
- ❌ خواستیم لیارا بگیریم
- 🎯 **مشکل:** پلن رایگان حذف شده، از ۷۵۰ هزار شروع
- ✅ **درس:** قبل از تصمیم، قیمت‌ها رو چک کن

### اشتباه ۳: هاست‌ایران رایگان
- ❌ خواستیم از هاست رایگان هاست‌ایران استفاده کنیم
- 🎯 **مشکل:** فقط ۱ ماه رایگان، دائمی نیست
- ✅ **درس:** رایگان‌های موقت رو به‌عنوان دائمی حساب نکن

### اشتباه ۴: اشتباه تایپی در یوزرنیم
- ❌ `mojtabamaniya5-boop` رو نوشتیم `boog`
- 🎯 **مشکل:** ۳۰ دقیقه وقت تلف شد
- ✅ **درس:** همیشه اسکرین‌شات بگیر و تأیید کن

### اشتباه ۵: توکن گیت‌هاب Read-only
- ❌ توکن با دسترسی فقط خواندن ساختیم
- 🎯 **مشکل:** آپلود کار نمی‌کرد
- ✅ **درس:** حتماً `Contents: Read and write` باشه

### اشتباه ۶: سوءتفاهم در مورد انقضای توکن
- ❌ فکر کردیم توکن ۹۰ روزه یه روزه خراب شد
- 🎯 **مشکل:** در واقع دسترسی کافی نبود، نه انقضا
- ✅ **درس:** فرق «انقضا» با «دسترسی» رو بدون

### اشتباه ۷: NS اشتباه آروان
- ❌ `m.ns.arvancloud.ir` رو گذاشتیم
- 🎯 **مشکل:** آروان CDN می‌خواد `m.ns.arvancdn.ir`
- ✅ **درس:** ابر آروان ≠ آروان CDN — دو تا سرویس جدان

### اشتباه ۸: nano توی گوشی
- ❌ خواستیم با nano فایل بسازیم
- 🎯 **مشکل:** کیبورد کوچیک، Ctrl نداره
- ✅ **درس:** از `cat > file << 'EOF'` استفاده کن

### اشتباه ۹: psql بدون su
- ❌ توی shell معمولی `psql` زدیم
- 🎯 **مشکل:** `role "root" does not exist`
- ✅ **درس:** اول `su - postgres`، بعد `psql`

### اشتباه ۱۰: کش ۱۰ دقیقه‌ای گیت‌هاب
- ❌ محصول جدید ۲ ساعت نمیومد
- 🎯 **مشکل:** CDN گیت‌هاب فایل‌ها رو کش می‌کنه
- ✅ **درس:** `version.json` + `raw.githubusercontent.com` + network-first

### اشتباه ۱۱: مدام setup.html ساختیم
- ❌ برای هر تغییر یه setup.html جدید
- 🎯 **مشکل:** وقت‌گیر، تکراری
- ✅ **درس:** یه `install.sh` یا سیستم آپدیت جامع بساز

### اشتباه ۱۲: کار با گوشی سخت شد
- ❌ همه کدها رو دستی توی گیت‌هاب آپدیت می‌کردیم
- 🎯 **مشکل:** خسته‌کننده، خطا زیاد
- ✅ **درس:** همیشه `setup.html` با یه دکمه بده

---

## 📋 مراحل راه‌اندازی از صفر (چک‌لیست کامل)

### 🔵 فاز ۱: فرانت‌اند (۳۰ دقیقه)

- [ ] ساخت ریپو `Torshak` (Public) روی گیت‌هاب
- [ ] آپلود فایل‌های اصلی:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `auth.js`
  - `auth.css`
  - `products.js`
  - `admin.html`
  - `manifest.json`
  - `icon.svg`
  - `sw.js`
  - `version.json`
- [ ] فعال‌سازی GitHub Pages (Settings → Pages → main → /)
- [ ] تست از مرورگر گوشی: `https://USERNAME.github.io/Torshak/`

### 🟢 فاز ۲: توکن گیت‌هاب (۵ دقیقه)

- [ ] برو `github.com/settings/tokens?type=beta`
- [ ] **Generate new token**
- [ ] Token name: `Torshak Admin`
- [ ] Expiration: `90 days`
- [ ] Resource owner: خودت
- [ ] Repository access: `Only select repositories` → `Torshak`
- [ ] Permissions → Repository permissions → **Contents: Read and write**
- [ ] Generate و کپی کن (فقط یه بار نشون داده می‌شه)

### 🟡 فاز ۳: پنل ادمین (۱۰ دقیقه)

- [ ] باز کن: `.../admin.html`
- [ ] رمز پیش‌فرض: `1234`
- [ ] تب ⚙️ تنظیمات → اطلاعات گیت‌هاب رو پر کن
- [ ] تست اتصال بزن
- [ ] محصولات نمونه اضافه کن

### 🟠 فاز ۴: سرور (۳۰ دقیقه)

- [ ] خرید سرور از `webdade.ir` (۲ CPU, 2GB RAM, 25GB SSD)
- [ ] سیستم: Ubuntu 24.04
- [ ] دریافت IP و رمز root
- [ ] نصب Termux روی گوشی
- [ ] `pkg update && pkg upgrade -y`
- [ ] `pkg install openssh dnsutils -y`
- [ ] `ssh root@IP`

### 🔴 فاز ۵: نصب نرم‌افزارهای سرور (۱ ساعت)

```bash
# آپدیت
apt update && apt upgrade -y

# نصب ابزارها
apt install -y curl git nginx postgresql postgresql-contrib ufw

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2
npm install -g pm2
```

🟣 فاز ۶: راه‌اندازی دیتابیس (۱۰ دقیقه)

```bash
su - postgres
psql
```

```sql
CREATE USER cafetorshi WITH PASSWORD 'رمز-قوی-اینجا';
CREATE DATABASE cafetorshi_db OWNER cafetorshi;
GRANT ALL PRIVILEGES ON DATABASE cafetorshi_db TO cafetorshi;
\q
exit
```

جدول‌ها:

```bash
su - postgres -c "psql -d cafetorshi_db << 'EOF'
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  address TEXT,
  note TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
EOF"
```

⚫ فاز ۷: کد بک‌اند (۳۰ دقیقه)

☐ mkdir -p /var/www/cafetorshi && cd /var/www/cafetorshi
☐ npm init -y
☐ npm install express pg cors bcryptjs jsonwebtoken dotenv
☐ ساخت .env (با اطلاعات دیتابیس)
☐ ساخت .gitignore
☐ ساخت index.js (کد API)
☐ pm2 start index.js --name cafetorshi-api
☐ pm2 save && pm2 startup

🟤 فاز ۸: Nginx و فایروال (۱۵ دقیقه)

```bash
ufw allow 22 && ufw allow 80 && ufw allow 443
ufw --force enable
```

کانفیگ Nginx:

```bash
cat > /etc/nginx/sites-available/cafetorshi << 'EOF'
server {
    listen 80;
    server_name api.example.com IP_ADDRESS;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/cafetorshi /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

🔵 فاز ۹: DNS و SSL (۲۴ ساعت صبر)

1. دامنه رو از ایرنیک بگیر (cafetorshi.ir)
2. توی آروان CDN، دامنه رو اضافه کن
3. NSهای آروان رو توی ایرنیک بذار:
   · m.ns.arvancdn.ir
   · r.ns.arvancdn.ir
4. ۲۴ ساعت صبر کن تا پخش شه
5. توی آروان، رکورد A برای api بساز:
   · Type: A
   · Name: api
   · Value: IP سرور
   · حالت ابر: روشن
6. SSL خودکار فعال می‌شه

🎨 فاز ۱۰: اتصال فرانت به بک (۵ دقیقه)

توی auth.js، متغیر API_URL رو عوض کن:

```javascript
var API_URL = 'https://api.cafetorshi.ir';
```

✅ فاز ۱۱: تست نهایی (۱۵ دقیقه)

☐ سایت باز می‌شه
☐ محصولات نمایش داده می‌شن
☐ ثبت‌نام کار می‌کنه
☐ ورود کار می‌کنه
☐ سبد خرید کار می‌کنه
☐ ثبت سفارش کار می‌کنه
☐ پنل کاربری سفارش‌ها رو نشون می‌ده

---

🔧 اسکریپت‌های خودکار (به‌زودی)

install.sh — نصب خودکار سرور جدید

```bash
#!/bin/bash
# این اسکریپت رو روی سرور جدید اجرا کن
# همه چیز رو خودکار راه می‌ندازه

echo "🚀 شروع نصب..."

# آپدیت
apt update && apt upgrade -y

# نصب پکیج‌ها
apt install -y curl git nginx postgresql postgresql-contrib ufw

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2
npm install -g pm2

# فایروال
ufw allow 22 && ufw allow 80 && ufw allow 443
ufw --force enable

# پوشه پروژه
mkdir -p /var/www/cafetorshi
cd /var/www/cafetorshi

echo "✅ نصب تمام شد!"
echo "حالا کدها رو آپلود کن و دیتابیس رو بساز."
```

new-client.sh — ساخت مشتری جدید

```bash
#!/bin/bash
# استفاده: bash new-client.sh CLIENT_NAME
# مثال: bash new-client.sh clothes-shop

CLIENT=$1
if [ -z "$CLIENT" ]; then
  echo "❌ نام مشتری رو بده"
  exit 1
fi

echo "📦 ساخت مشتری جدید: $CLIENT"

# کپی پروژه
cp -r /var/www/cafetorshi /var/www/$CLIENT

echo "✅ پوشه ساخته شد: /var/www/$CLIENT"
echo "حالا کدها رو آپدیت کن و دیتابیس جدید بساز."
```

backup.sh — بکاپ روزانه

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/root/backups"

mkdir -p $BACKUP_DIR

# بکاپ دیتابیس
su - postgres -c "pg_dump cafetorshi_db" > "$BACKUP_DIR/db-$DATE.sql"

# بکاپ کدها
tar -czf "$BACKUP_DIR/code-$DATE.tar.gz" /var/www/cafetorshi

# بکاپ Nginx config
cp /etc/nginx/sites-available/cafetorshi "$BACKUP_DIR/nginx-$DATE.conf"

# حذف بکاپ‌های قدیمی‌تر از ۷ روز
find $BACKUP_DIR -type f -mtime +7 -delete

echo "✅ بکاپ گرفته شد: $BACKUP_DIR"
```

---

🎨 راهنمای کاستومایز برای مشتری جدید

۱. تغییر رنگ

فایل styles.css، بخش :root:

```css
--primary: #b8341e;       /* رنگ اصلی */
--primary-light: #d44a30; /* رنگ روشن */
--primary-dark: #8b2415;  /* رنگ تیره */
--mustard: #e8a33d;       /* رنگ فرعی */
```

۲. تغییر اسم و لوگو

· index.html → هدر، footer
· manifest.json → name و short_name
· icon.svg → لوگوی جدید
· admin.html → عنوان

۳. تغییر محصولات

· ورود به پنل ادمین
· افزودن محصولات جدید
· حذف محصولات قدیمی

۴. تغییر اطلاعات فروشگاه

توی پنل ادمین → تب فروشگاه:

· اسم
· شعار
· شماره
· روبیکا / بله / اینستاگرام

---

💰 مدل کسب‌وکار

قیمت‌گذاری پیشنهادی

بسته قیمت شامل
راه‌اندازی ۱.۵ میلیون سایت + دامنه + ۱۰ محصول + آموزش
اشتراک ماهانه ۲۵۰ هزار پشتیبانی + آپدیت + میزبانی
حرفه‌ای ۳ میلیون همه چیز + پرداخت آنلاین + ۳ ماه پشتیبانی

هدف‌گیری مشتری

مناسب:

· ترشی و شوری خانگی
· شیرینی‌پزی خانگی
· آجیل و خشکبار
· گلفروشی
· پوشاک زنانه
· کیک و دسر
· لبنیات محلی

نامناسب:

· سوپرمارکت (نیاز نداره)
· رستوران بزرگ (اسنپ‌فود داره)
· زنجیره‌ای‌ها

---

⚠️ چک‌لیست قبل از تحویل به مشتری

☐ محصولات واقعی آپلود شده
☐ عکس‌ها با کیفیت
☐ اطلاعات فروشگاه درست
☐ شماره تماس تست شده
☐ روبیکا/بله لینک شده
☐ ثبت‌نام کار می‌کنه
☐ سفارش ثبت می‌شه
☐ SSL فعاله (قفل سبز)
☐ PWA روی گوشی نصب می‌شه
☐ آفلاین کار می‌کنه
☐ دامنه اختصاصی ست شده
☐ بکاپ گرفته شده

---

📊 هزینه‌ها

برای هر مشتری

مورد هزینه
دامنه ۱۰۰ هزار/سال
سرور ۸۰۰ هزار/ماه
جمع ~۹۰۰ هزار/ماه

برای خودت (کافه ترشی)

همون هزینه‌های بالا

درآمد پیش‌بینی‌شده

· ۱۰ مشتری × ۲۵۰ هزار = ۲.۵ میلیون/ماه
· ۲۰ مشتری × ۲۵۰ هزار = ۵ میلیون/ماه
· ۵۰ مشتری × ۲۵۰ هزار = ۱۲.۵ میلیون/ماه

---

🔄 مراحل مهاجرت (اگه سرور عوض شد)

1. بکاپ از سرور قدیم:
   ```bash
   bash backup.sh
   ```
2. خرید سرور جدید
3. اجرای install.sh
4. کپی فایل‌های بکاپ به سرور جدید
5. بازیابی:
   ```bash
   su - postgres -c "psql cafetorshi_db < /root/backups/db-DATE.sql"
   tar -xzf /root/backups/code-DATE.tar.gz -C /
   cp /root/backups/nginx-DATE.conf /etc/nginx/sites-available/cafetorshi
   ```
6. تغییر IP در DNS آروان
7. تست

زمان کل: ۳۰ دقیقه ⏱️

---

📝 لاگ کارها

روز ۱-۳: فرانت‌اند

· ساخت index.html, styles.css, app.js
· PWA، آفلاین، manifest

روز ۴-۵: پنل ادمین

· admin.html با GitHub API
· آپلود عکس + فشرده‌سازی

روز ۶: بهبود UX

· جستجو، ویژه، تخفیف، اشتراک‌گذاری

روز ۷: سرور

· خرید سرور webdade
· نصب Node.js, Nginx, PostgreSQL
· ساخت API

روز ۸: DNS

· ثبت دامنه
· آروان CDN
· NS در ایرنیک
· رکورد api

روز ۹: فرانت مشتری

· ثبت‌نام، ورود، پنل کاربری
· اتصال به API

---

🎓 درس‌های کلیدی برای دفعه بعد

۵ قانون طلایی:

1. اول DNS رو تنظیم کن، بعد سرور
   · چون ۲۴ ساعت باید صبر کرد
2. کش رو از روز اول هندل کن
   · version.json از ابتدا
   · sw.js با network-first
   · تست توی Incognito
3. همیشه setup.html بساز
   · کاربر فقط کپی/پیست و دکمه
   · نه ویرایش دستی
4. بک‌اند رو خودکار کن
   · install.sh و backup.sh
   · نه دستی
5. همه چیز رو مستند کن
   · همین سند مادر
   · هر تغییر، هر درس

---

📞 اطلاعات تماس پروژه

· دامنه اصلی: cafetorshi.ir
· دامنه API: api.cafetorshi.ir
· سرور: webdade (IP: 194.146.69.210)
· DNS: آروان CDN
· مخزن فرانت: github.com/mojtabamaniya5-boop/Torshak

---

🔗 لینک‌های مفید

· GitHub Pages
· آروان CDN
· ایرنیک
· webdade
· PM2 Docs

---

آخرین به‌روزرسانی: امروز
نسخه: ۱.۰

```

---

## 🎬 بعد از پیست

1. **Commit changes** بزن
2. بگو **«سند مادر ساخته شد»**

---

## 💡 این سند چیکار می‌کنه

| کاربرد | فایده |
|---|---|
| 📖 **برای خودت** | ۶ ماه بعد یادت نمی‌ره چیکار کردی |
| 🎓 **برای مشتری دوم** | فقط کپی/پیست، ۱ روز کار |
| 🐛 **برای حل باگ** | هر خطا رو ثبت کردی |
| 💰 **برای فروش** | مدرک حرفه‌ای بودن |

---

**پیست کن، Commit بزن، بگو «شد»** 🌶️

بعدش استراحت کن — واقعاً مستحقشی. 💪
