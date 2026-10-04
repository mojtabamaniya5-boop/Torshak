/* ═══════════════════════════════════════════
   اطلاعات فروشگاه — کافه ترشی
   ═══════════════════════════════════════════ */

var SHOP = {
  name: 'کافه ترشی',
  tagline: 'ترشی و خیارشور خونگی',
  phone: '09917756908',
  rubika: 'forosh48',
  bale: 'forosh48',
  instagram: 'cofetorshi.ir'
};

var CATEGORIES = [
  { id: 'all',        name: 'همه',     emoji: '🍽️' },
  { id: 'torshi',     name: 'ترشی',    emoji: '🌶️' },
  { id: 'khyarshoor', name: 'خیارشور', emoji: '🥒' },
  { id: 'lavashak',   name: 'لواشک',   emoji: '🍑' }
];

var PRODUCTS = [
  {
    id: 'torshi-bandari',
    name: 'ترشی بندری',
    category: 'torshi',
    price: 45000,
    oldPrice: 60000,
    unit: 'ظرف ۵۰۰ گرمی',
    emoji: '🌶️',
    color: '#b8341e',
    description: 'ترشی اصیل بندری با ادویه‌های مخصوص و سیر تازه.',
    ingredients: 'سیر، فلفل، ادویه بندری، سرکه طبیعی',
    featured: true,
    inStock: true
  },
  {
    id: 'khyarshoor-khanegi',
    name: 'خیارشور خونگی',
    category: 'khyarshoor',
    price: 35000,
    unit: 'ظرف ۵۰۰ گرمی',
    emoji: '🥒',
    color: '#4a7c59',
    description: 'خیارشور ترش و ترد، با ترخون و سیر تازه.',
    ingredients: 'خیار، سرکه، ترخون، سیر، نمک دریا',
    featured: true,
    inStock: true
  },
  {
    id: 'lavashak-alu',
    name: 'لواشک آلو',
    category: 'lavashak',
    price: 30000,
    unit: 'بسته ۲۵۰ گرمی',
    emoji: '🍑',
    color: '#c0392b',
    description: 'لواشک آلو با طعم ترش و ملس.',
    ingredients: 'آلو، نمک، ادویه مخصوص',
    featured: false,
    inStock: true
  }
];