/* ═══════════════════════════════════════════════
   ترشک بندری — داده‌های فروشگاه
   این فایل را می‌توانید دستی یا از پنل مدیریت (admin.html) ویرایش کنید.
   ═══════════════════════════════════════════════ */

const SHOP = {
  name: "ترشک بندری",
  tagline: "ترشی و ترشک خانگی بوشهر",
  whatsapp: "989121234567",      // شماره واتساپ با کد کشور، بدون +
  instagram: "torshak_bandari",  // آیدی اینستاگرام بدون @
  phone: "09121234567",          // شماره تماس
  address: "بوشهر"
};

const CATEGORIES = [
  { id: "all",        name: "همه",      emoji: "🍽️" },
  { id: "torshi",     name: "ترشی",     emoji: "🌶️" },
  { id: "khyarshoor", name: "خیارشور",  emoji: "🥒" },
  { id: "lavashak",   name: "لواشک",    emoji: "🍇" },
  { id: "mahi",       name: "ترشی ماهی", emoji: "🐟" }
];

/*
  راهنمای فیلدهای هر محصول:
  id         : شناسه یکتا (انگلیسی، بدون فاصله)
  cat        : id دسته‌بندی (از لیست بالا)
  name       : نام محصول
  unit       : واحد فروش (مثلاً «ظرف ۷۰۰ گرمی»)
  price      : قیمت به تومان (عدد)
  oldPrice   : قیمت قبل از تخفیف (عدد یا null)
  badge      : برچسب روی کارت (مثلاً «پرفروش») یا null
  stock      : موجودی؛ true = موجود، false = ناموجود
  emoji      : ایموجی جایگزین وقتی عکس ندارید
  color      : رنگ پس‌زمینه ایموجی (کد HEX)
  img        : مسیر عکس (مثل "images/product.jpg") یا null
  desc       : توضیح محصول
  ingredients: مواد تشکیل‌دهنده
*/
const PRODUCTS = [
  {
    id: "torshi-makhlut",
    cat: "torshi",
    name: "ترشی مخلوط بندری",
    unit: "ظرف ۷۰۰ گرمی",
    price: 185000,
    oldPrice: 220000,
    badge: "پرفروش",
    stock: true,
    emoji: "🌶️",
    color: "#e8a33d",
    img: "images/img-mupz9nho-ejixg.jpg",
    desc: "ترشی مخلوط اصیل بندری با سرکه انگور و ادویه‌های تند و معطر جنوبی. تند، خوش‌عطر و مقوی.",
    ingredients: "گل‌کلم، هویج، خیار، فلفل، سیر، سرکه انگور، ادویه بندری"
  },
  {
    id: "torshi-liteh",
    cat: "torshi",
    name: "ترشی لیته",
    unit: "ظرف ۷۰۰ گرمی",
    price: 160000,
    oldPrice: null,
    badge: null,
    stock: true,
    emoji: "🍆",
    color: "#7c5cbf",
    img: null,
    desc: "لیته بادمجان خانگی با سبزی معطر و سیر فراوان، طعم کلاسیک و محبوب سفره ایرانی.",
    ingredients: "بادمجان، سیر، سبزی معطر، سرکه، نمک، ادویه"
  },
  {
    id: "torshi-bandemjan",
    cat: "torshi",
    name: "ترشی بادمجان بندری",
    unit: "ظرف ۷۰۰ گرمی",
    price: 175000,
    oldPrice: null,
    badge: "جدید",
    stock: true,
    emoji: "🍆",
    color: "#5b7fa6",
    img: null,
    desc: "بادمجان کبابی با ادویه تند بندری؛ مزه‌ای دودی و تند که عاشقش می‌شوید.",
    ingredients: "بادمجان، فلفل تند، سیر، سرکه، ادویه بندری"
  },
  {
    id: "torshi-sir",
    cat: "torshi",
    name: "ترشی سیر",
    unit: "ظرف ۵۰۰ گرمی",
    price: 195000,
    oldPrice: null,
    badge: null,
    stock: true,
    emoji: "🧄",
    color: "#c9b37e",
    img: null,
    desc: "سیر ترشی رسیده در سرکه، خوش‌طعم و مفید؛ هرچه بماند بهتر می‌شود.",
    ingredients: "سیر تازه، سرکه، نمک، کمی شکر"
  },
  {
    id: "khyarshoor-ktk",
    cat: "khyarshoor",
    name: "خیارشور کوچک",
    unit: "ظرف ۷۰۰ گرمی",
    price: 140000,
    oldPrice: 165000,
    badge: "تخفیف",
    stock: true,
    emoji: "🥒",
    color: "#4a7c59",
    img: "images/img-mupzd5e8-1o3lp.jpg",
    desc: "خیارشور ریز و ترد با آب‌نمک طبیعی و شوید تازه، بدون سرکه و مواد نگهدارنده.",
    ingredients: "خیار، آب، نمک، شوید، سیر"
  },
  {
    id: "khyarshoor-torsh",
    cat: "khyarshoor",
    name: "خیارشور شور و ترش",
    unit: "ظرف ۷۰۰ گرمی",
    price: 145000,
    oldPrice: null,
    badge: null,
    stock: true,
    emoji: "🥒",
    color: "#6b8f4e",
    img: null,
    desc: "خیارشور با ترشی بیشتر برای کسانی که طعم ترش را دوست دارند.",
    ingredients: "خیار، سرکه، نمک، شوید، تخم گشنیز"
  },
  {
    id: "lavashak-aloo",
    cat: "lavashak",
    name: "لواشک آلو",
    unit: "ورق ۱۵۰ گرمی",
    price: 75000,
    oldPrice: null,
    badge: "خانگی",
    stock: true,
    emoji: "🍑",
    color: "#b8341e",
    img: "images/img-mupzap5t-pysbg.jpg",
    desc: "لواشک آلو خالص بدون افزودنی، ترش و طبیعی؛ طعم واقعی آلو در هر ورق.",
    ingredients: "آلو خالص — فقط همین!"
  },
  {
    id: "lavashak-haftcanar",
    cat: "lavashak",
    name: "لواشک هفت‌چنار",
    unit: "ورق ۱۵۰ گرمی",
    price: 95000,
    oldPrice: 110000,
    badge: "ویژه",
    stock: true,
    emoji: "🍇",
    color: "#8b3a5c",
    img: null,
    desc: "ترکیب هفت میوه جنگلی؛ لواشک ترش و لعاب‌دار با عطر بی‌نظیر.",
    ingredients: "آلو، زرشک، آلبالو، انار، سیب، به، تمشک"
  },
  {
    id: "mahi-torshak",
    cat: "mahi",
    name: "ترشک ماهی جنوبی",
    unit: "بسته ۴۰۰ گرمی",
    price: 250000,
    oldPrice: null,
    badge: "محلی",
    stock: true,
    emoji: "🐟",
    color: "#3e7a8c",
    img: null,
    desc: "ترشک ماهی سنتی بوشهر با تمرهندی و ادویه بندری؛ کنار برنج و ماهی، عالی است.",
    ingredients: "ماهی، تمرهندی، سیر، فلفل، ادویه جنوبی"
  },
  {
    id: "torshi-anbeh",
    cat: "torshi",
    name: "ترشی انبه هندی",
    unit: "ظرف ۵۰۰ گرمی",
    price: 210000,
    oldPrice: null,
    badge: null,
    stock: false,
    emoji: "🥭",
    color: "#e8a33d",
    img: null,
    desc: "انبه تند و ترش با ادویه هندی؛ فعلاً فصلی است و ناموجود.",
    ingredients: "انبه، فلفل، خردل، روغن، ادویه"
  }
];
