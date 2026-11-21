import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './App.css';
import ProductCard from './ProductCard';

const CATEGORIES = [
  { id: 'all', name: 'Barcha mahsulotlar', icon: 'grid' },
  { id: 'cement', name: 'Sement va Quruq aralashmalar', icon: 'layers' },
  { id: 'bricks', name: "G'isht va Gazobloklar", icon: 'box' },
  { id: 'metal', name: 'Metall va Armatura', icon: 'shield' },
  { id: 'tools', name: 'Elektr asboblari', icon: 'tool' },
  { id: 'paints', name: "Bo'yoq va Laklar", icon: 'droplet' },
  { id: 'plumbing', name: 'Santexnika va Quvurlar', icon: 'sliders' },
  { id: 'drywall', name: 'Gipsokarton va Profillar', icon: 'layout' },
  { id: 'tiles', name: 'Kafel va Pol qoplamalari', icon: 'compass' }
];

const BRANDS = [
  'Knauf',
  'Bosch',
  'Makita',
  'Qizilqumsement',
  'Bekobod Metall',
  'Weber',
  'Tikkurila',
  'Grohe',
  'DeWalt',
  'Basf'
];

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%231e293b'/%3E%3Cpath d='M220 290 L300 170 L380 290 Z' fill='%23ea580c' opacity='0.85'/%3E%3Ccircle cx='355' cy='165' r='24' fill='%23f8fafc' opacity='0.3'/%3E%3Ctext x='300' y='345' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23f8fafc' text-anchor='middle'%3ENSTROY QURILISH MOLLARI%3C/text%3E%3C/svg%3E";

const PRODUCTS_DATA = [
  {
    id: 1,
    sku: 'NST-CM-101',
    name: 'Qizilqumsement Portlendsement M-400 D20 (50 kg)',
    brand: 'Qizilqumsement',
    category: 'cement',
    price: 46000,
    oldPrice: 52000,
    unit: 'qop (50 kg)',
    stock: 480,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Xit savdo',
    bulkMinQty: 50,
    bulkDiscountPercent: 8,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description:
      "Yuqori mustahkamlikka ega M-400 markali portlendsement. Fundament quyish, temir-beton konstruksiyalar va mas'uliyatli suvoq ishlari uchun mo'ljallangan.",
    specs: {
      Markasi: 'M-400 D20',
      "Og'irligi": '50 kg (±0.5 kg)',
      'Qotish vaqti': '45 daqiqadan boshlanadi',
      'Ishlab chiqaruvchi': "O'zbekiston (Navoiy)"
    }
  },
  {
    id: 2,
    sku: 'NST-CM-102',
    name: 'Knauf Rotband Gipsli Universal Suvoq (30 kg)',
    brand: 'Knauf',
    category: 'cement',
    price: 78000,
    oldPrice: 86000,
    unit: 'qop (30 kg)',
    stock: 310,
    rating: 5.0,
    reviewsCount: 218,
    badge: 'Pro tanlov',
    bulkMinQty: 30,
    bulkDiscountPercent: 7,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    description:
      "Ichki devor va shiftlarni qo'lda tekislash uchun yuqori yopishqoqlikka ega gipsli suvoq aralashmasi. Shpaklyovkasiz silliq yuza beradi.",
    specs: {
      Asosi: 'Tabiiy gips va polimerlar',
      Sarfi: '8.5 kg / m² (10 mm qatlam)',
      "Qatlam qalinligi": '5 - 50 mm',
      Kafolat: 'Original Knauf sertifikati'
    }
  },
  {
    id: 3,
    sku: 'NST-TL-201',
    name: 'Bosch GBH 2-26 DRE Professional Perforator (800 Vt)',
    brand: 'Bosch',
    category: 'tools',
    price: 2150000,
    oldPrice: 2490000,
    unit: 'komplekt',
    stock: 24,
    rating: 4.9,
    reviewsCount: 89,
    badge: 'Chegirma -14%',
    bulkMinQty: 3,
    bulkDiscountPercent: 5,
    deliveryText: '2 soat ichida',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    description:
      "Beton, g'isht va metallni burg'ulash hamda o'yish uchun 3 rejimli afsonaviy SDS-plus perforator. Revers va tezlikni elektron boshqarish tizimiga ega.",
    specs: {
      Quvvati: '800 Vt',
      'Zarba kuchi': '2.7 Joul',
      Patron: 'SDS-Plus',
      Kafolat: '24 oy rasmiy servis'
    }
  },
  {
    id: 4,
    sku: 'NST-BR-301',
    name: 'Avtoklav Gazoblok D500 (600x300x200 mm)',
    brand: 'Basf',
    category: 'bricks',
    price: 19500,
    oldPrice: 22000,
    unit: 'dona',
    stock: 1450,
    rating: 4.8,
    reviewsCount: 95,
    badge: 'Issiqlik tejovchi',
    bulkMinQty: 100,
    bulkDiscountPercent: 10,
    deliveryText: 'Manipulyator bilan',
    image: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&w=800&q=80',
    description:
      "Aniq geometrik o'lchamli avtoklav gazobeton bloki. Uy devorlarini tez ko'tarish va qishda issiqlikni 40% gacha saqlash imkonini beradi.",
    specs: {
      "O'lchami": '600 x 300 x 200 mm',
      Zichligi: 'D500 (B2.5)',
      '1 m³ hajmda': '27.7 dona',
      'Sovuqqa chidamliligi': 'F50'
    }
  },
  {
    id: 5,
    sku: 'NST-MT-401',
    name: 'Armatura A500C Ø12 mm (Bekobod Metall, 11.7 m)',
    brand: 'Bekobod Metall',
    category: 'metal',
    price: 10800,
    oldPrice: 11900,
    unit: 'metr',
    stock: 3200,
    rating: 4.9,
    reviewsCount: 164,
    badge: 'GOST standart',
    bulkMinQty: 200,
    bulkDiscountPercent: 6,
    deliveryText: 'Uzun o‘lchamli avto',
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80',
    description:
      "Monolit temir-beton karkaslar, kolonna va poydevorlarni mustahkamlash uchun davriy profilli po'lat armatura. Sertifikatlangan zavod mahsuloti.",
    specs: {
      Diametri: '12 mm',
      "Po'lat markasi": 'A500C / 35GS',
      "1 metr og'irligi": '0.888 kg',
      Uzunligi: '11.7 m (kesib beriladi)'
    }
  },
  {
    id: 6,
    sku: 'NST-PT-501',
    name: 'Tikkurila Euro Power 7 Yuviladigan Interyer Bo‘yog‘i (9 L)',
    brand: 'Tikkurila',
    category: 'paints',
    price: 685000,
    oldPrice: 760000,
    unit: 'chelak (9 L)',
    stock: 42,
    rating: 4.9,
    reviewsCount: 73,
    badge: 'Eco sertifikat',
    bulkMinQty: 5,
    bulkDiscountPercent: 7,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    description:
      "Hidsiz, tez quriydigan va ko'p marta yuvishga chidamli mat akrilat bo'yoq. Mehmonxona, bolalar xonasi va ofis devorlari uchun ideal tanlov.",
    specs: {
      Hajmi: '9 Litr (12.2 kg)',
      Sarfi: '10 - 12 m² / litr',
      Yaltiroqligi: 'To‘liq mat (7 daraja)',
      Ranglash: '10,000+ tusga kompyuterda'
    }
  },
  {
    id: 7,
    sku: 'NST-DW-601',
    name: 'Knauf Gipsokarton Namlikka Chidamli GKLV 12.5 mm (2500x1200)',
    brand: 'Knauf',
    category: 'drywall',
    price: 94000,
    oldPrice: 105000,
    unit: 'list (3 m²)',
    stock: 260,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'Namlikka chidamli',
    bulkMinQty: 25,
    bulkDiscountPercent: 8,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80',
    description:
      "Oshxona, hammom va namligi yuqori bo'lgan xonalarda osma shift hamda to'siq devorlar o'rnatish uchun maxsus yashil gipsokarton listi.",
    specs: {
      "O'lchami": '2500 x 1200 x 12.5 mm',
      Maydoni: '3.0 m²',
      "Og'irligi": '29 kg',
      Turi: 'GKLV (Yashil)'
    }
  },
  {
    id: 8,
    sku: 'NST-TL-202',
    name: 'Makita DDF482RFE Akkumulyatorli Shurupovert 18V (2x3.0Ah)',
    brand: 'Makita',
    category: 'tools',
    price: 2690000,
    oldPrice: 3100000,
    unit: 'komplekt',
    stock: 16,
    rating: 5.0,
    reviewsCount: 64,
    badge: 'Top Usta',
    bulkMinQty: 2,
    bulkDiscountPercent: 5,
    deliveryText: '2 soat ichida',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    description:
      "62 Nm aylanish momentiga ega ixcham va kuchli 2 tezlikli shurupovert. To'plamda 2 ta Li-Ion batareya, tezkor quvvatlagich va keys mavjud.",
    specs: {
      Kuchlanish: '18V Li-Ion',
      'Aylanish momenti': '62 / 36 Nm',
      Tezlik: '0-600 / 0-1900 ayl/daq',
      "To'plam": '2x 3.0Ah batareya + Keys'
    }
  },
  {
    id: 9,
    sku: 'NST-PL-701',
    name: 'Grohe Eurosmart Cosmopolitan Oshxona Smesiteli (Xrom)',
    brand: 'Grohe',
    category: 'plumbing',
    price: 1420000,
    oldPrice: 1650000,
    unit: 'dona',
    stock: 35,
    rating: 4.9,
    reviewsCount: 51,
    badge: 'Germaniya sifati',
    bulkMinQty: 4,
    bulkDiscountPercent: 6,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description:
      "GROHE SilkMove 35 mm keramik kartrijli va StarLight xrom qoplamali ishonchli oshxona kran-smesiteli. 360° aylanuvchi baland trubkali.",
    specs: {
      Kartrij: 'GROHE SilkMove 35 mm',
      Qoplama: 'GROHE StarLight Xrom',
      Material: 'Latuń (mis qotishmasi)',
      Kafolat: '5 yil'
    }
  },
  {
    id: 10,
    sku: 'NST-CM-103',
    name: 'Weber Vetonit LR+ Polimer Finish Shpaklyovka (20 kg)',
    brand: 'Weber',
    category: 'cement',
    price: 118000,
    oldPrice: 132000,
    unit: 'qop (20 kg)',
    stock: 195,
    rating: 4.9,
    reviewsCount: 130,
    badge: 'O‘ta silliq',
    bulkMinQty: 20,
    bulkDiscountPercent: 8,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description:
      "Bo'yash va gulqog'oz (oboy) yopishtirishdan oldin devor va shiftlarni ideal oq va silliq holatga keltiruvchi polimer finish shpaklyovka.",
    specs: {
      Rangi: 'Oq',
      Sarfi: '1.2 kg / m² (1 mm qatlam)',
      "Qatlam qalinligi": '1 - 5 mm',
      "Yashash vaqti": '24 soat (tayyor qorishma)'
    }
  },
  {
    id: 11,
    sku: 'NST-TL-203',
    name: 'DeWalt DWE4157 Burchakli Silliqlash Mashinasi Bolgarka (900 Vt)',
    brand: 'DeWalt',
    category: 'tools',
    price: 1190000,
    oldPrice: 1380000,
    unit: 'dona',
    stock: 29,
    rating: 4.8,
    reviewsCount: 47,
    badge: 'Xit savdo',
    bulkMinQty: 3,
    bulkDiscountPercent: 6,
    deliveryText: '2 soat ichida',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80',
    description:
      "125 mm diskli ixcham korpusga ega professional bolgarka. Elektr uzilib qayta yonganda tasodifiy ishga tushishdan himoya tizimiga ega.",
    specs: {
      Quvvati: '900 Vt',
      'Disk diametri': '125 mm',
      Aylanishlar: '11,800 ayl/daq',
      Vazni: '2.05 kg'
    }
  },
  {
    id: 12,
    sku: 'NST-TS-801',
    name: 'Keramogranit Marmar Effektli Calacatta Gold (600x1200 mm)',
    brand: 'Weber',
    category: 'tiles',
    price: 185000,
    oldPrice: 215000,
    unit: 'm²',
    stock: 420,
    rating: 4.9,
    reviewsCount: 84,
    badge: 'Premium dizayn',
    bulkMinQty: 40,
    bulkDiscountPercent: 9,
    deliveryText: 'Ertalabki reys',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description:
      "Tabiiy italyan marmarini takrorlovchi yaltiroq rektifikatsiyalangan keramogranit. Issiq pol tizimlari va katta zallar uchun mos.",
    specs: {
      "O'lchami": '600 x 1200 x 10 mm',
      Sirti: 'Polirovka qilingan (Glossy)',
      '1 qutida': '1.44 m² (2 dona)',
      Chidamlilik: 'PEI IV (yuqori yuklama)'
    }
  },
  {
    id: 13,
    sku: 'NST-BR-302',
    name: 'Pishiq Qizil G‘isht M-150 (250x120x65 mm)',
    brand: 'Qizilqumsement',
    category: 'bricks',
    price: 2400,
    oldPrice: 2800,
    unit: 'dona',
    stock: 15000,
    rating: 4.7,
    reviewsCount: 205,
    badge: 'Mustahkam',
    bulkMinQty: 1000,
    bulkDiscountPercent: 10,
    deliveryText: 'ZIL / KamAZ yetkazish',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80',
    description:
      "Yuqori haroratda pishirilgan to'liq tanali keramik g'isht. Podval devorlari, mo'rilar, ustunlar va yuk ko'taruvchi devorlar uchun.",
    specs: {
      Markasi: 'M-150',
      "O'lchami": '250 x 120 x 65 mm',
      "Suv shimishi": '8-10%',
      '1 m³ da': '512 dona'
    }
  },
  {
    id: 14,
    sku: 'NST-DW-602',
    name: 'Knauf Profil CD 60/27 Qalinligi 0.6 mm (3 metr)',
    brand: 'Knauf',
    category: 'drywall',
    price: 24500,
    oldPrice: 28000,
    unit: 'dona (3 m)',
    stock: 840,
    rating: 4.9,
    reviewsCount: 91,
    badge: '0.6 mm haqiqiy qalinlik',
    bulkMinQty: 50,
    bulkDiscountPercent: 7,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    description:
      "Ruxlangan po'latdan yasalgan mustahkam shift va devor karkas profili. Qattiqlik qovurg'alari tufayli egilib ketmaydi.",
    specs: {
      Kesimi: '60 x 27 mm',
      "Po'lat qalinligi": '0.60 mm',
      Uzunligi: '3000 mm',
      Qoplama: 'Korroziyaga qarshi rux'
    }
  },
  {
    id: 15,
    sku: 'NST-PL-702',
    name: 'Polipropilen Quvur PPR PN20 Ø25 mm Issiq/Sovuq Suv (4 m)',
    brand: 'Basf',
    category: 'plumbing',
    price: 14500,
    oldPrice: 17000,
    unit: 'metr',
    stock: 1800,
    rating: 4.8,
    reviewsCount: 68,
    badge: '20 Bar bosim',
    bulkMinQty: 100,
    bulkDiscountPercent: 9,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80',
    description:
      "Ichimlik suvi va isitish tizimlari uchun shisha tolali mustahkamlangan PPR quvur. Zanglamaydi va ichki diametri kichraymaydi.",
    specs: {
      Diametri: '25 mm (3/4")',
      Bosim: 'PN20 (20 atmosferagacha)',
      Harorat: '+95°C gacha',
      "Xizmat muddati": '50 yil'
    }
  },
  {
    id: 16,
    sku: 'NST-PT-502',
    name: 'Tikkurila Euro Extra 20 Fasad va Nam Xonalar Bo‘yog‘i (9 L)',
    brand: 'Tikkurila',
    category: 'paints',
    price: 790000,
    oldPrice: 870000,
    unit: 'chelak (9 L)',
    stock: 27,
    rating: 4.9,
    reviewsCount: 39,
    badge: 'Namlikka 100% himoya',
    bulkMinQty: 4,
    bulkDiscountPercent: 8,
    deliveryText: 'Bugun 18:00 gacha',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    description:
      "Hammom, basseyn atrofi, oshxona va tashqi fasadlar uchun mo'ljallangan yarim mat akril bo'yoq. Mog'or va zamburug'larga qarshi qo'shimchali.",
    specs: {
      Hajmi: '9 Litr',
      Yaltiroqligi: 'Yarim mat (20 daraja)',
      'Qayta bo‘yash': '2 soatdan so‘ng',
      Xususiyati: 'Antibakterial himoya'
    }
  }
];

const BRANCHES_DATA = [
  {
    id: 'chilonzor',
    name: 'Nstroy Chilonzor Markaziy Ombor',
    address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi, 42-uy',
    hours: '08:00 – 21:00 (Dam olish kunlarisiz)',
    phone: '+998 (71) 205-88-99',
    features: ['Drive-thru yuklash', 'Rang tanlash studiyasi', 'Usta maslahati']
  },
  {
    id: 'yunusobod',
    name: 'Nstroy Yunusobod Savdo Majmuasi',
    address: 'Toshkent sh., Yunusobod tumani, Ahmad Donish ko‘chasi, 18A',
    hours: '08:30 – 20:30 (Har kuni)',
    phone: '+998 (71) 205-88-77',
    features: ['Shourum 1200 m²', 'Kafel va santexnika zali', 'Bepul avtoturargoh']
  },
  {
    id: 'sergeli',
    name: 'Nstroy Sergeli Qurilish Bazasi',
    address: 'Toshkent sh., Sergeli tumani, TXAY yo‘li, Qurilish bozori 4-blok',
    hours: '07:30 – 20:00 (Har kuni)',
    phone: '+998 (71) 205-88-55',
    features: ['Metall va armatura kesish', 'Manipulyator xizmati', 'Optom bo‘lim']
  }
];

const FAQ_DATA = [
  {
    question: "Toshkent shahri bo'ylab yetkazib berish qancha vaqt oladi va narxi qanday?",
    answer:
      "14:00 gacha rasmiylashtirilgan buyurtmalar shu kunning o'zida 2-4 soat ichida yetkazib beriladi. 2 500 000 so'mdan yuqori buyurtmalar uchun Toshkent shahri ichida yetkazib berish mutlaqo bepul."
  },
  {
    question: "Qurilish kompaniyalari uchun pul o'tkazish (perechisleniye) va QQS hujjatlari bormi?",
    answer:
      "Albatta. Nstroy yuridik shaxslar va qurilish pudratchilari bilan shartnoma asosida ishlaydi. Didox / Faktura.uz orqali barcha elektron hisob-fakturalar (QQS bilan) va muvofiqlik sertifikatlari taqdim etiladi."
  },
  {
    question: "Ortiqcha qolgan qurilish materiallarini qaytarish mumkinmi?",
    answer:
      "Ha, qadoqlanishi buzilmagan va namlik tegmagan mahsulotlarni xarid cheki bilan 30 kun ichida istalgan Nstroy filialiga qaytarishingiz yoki boshqa mahsulotga almashtirishingiz mumkin."
  },
  {
    question: "Usta va prorablar uchun maxsus chegirma tizimi qanday ishlaydi?",
    answer:
      "Saytning yuqori qismidagi «Usta / Optom rejimi» tugmasini yoqish orqali ulgurji narxlarni darhol ko'rishingiz mumkin. Shuningdek, doimiy hamkor ustalar uchun har bir xariddan 5% dan 12% gacha keshbek hamda bepul smeta hisob-kitobi mavjud."
  }
];

const PROMO_CODES = {
  NSTROY10: { discountPercent: 10, label: '10% umumiy chegirma' },
  USTA2026: { discountPercent: 12, label: '12% Usta maxsus bonusi' },
  YANGI5: { discountPercent: 5, label: '5% birinchi xarid chegirmasi' }
};

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function formatPrice(amount) {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('nstroy_theme') || 'light');
  const [isProMode, setIsProMode] = useState(() => localStorage.getItem('nstroy_pro') === 'true');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(3500000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nstroy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('nstroy_favorites');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  const [calcTab, setCalcTab] = useState('plaster');
  const [calcValues, setCalcValues] = useState({
    area: 45,
    thickness: 15,
    wallLength: 18,
    wallHeight: 3,
    paintCoats: 2
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES_DATA[0].id);
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    phone: '+998 ',
    address: '',
    paymentMethod: 'card',
    comment: ''
  });
  const [orderCompleted, setOrderCompleted] = useState(null);

  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [activeBranchTab, setActiveBranchTab] = useState(BRANCHES_DATA[0].id);
  const [toasts, setToasts] = useState([]);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const catalogRef = useRef(null);
  const calculatorRef = useRef(null);
  const searchWrapperRef = useRef(null);

  useScrollReveal();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nstroy_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nstroy_pro', String(isProMode));
  }, [isProMode]);

  useEffect(() => {
    localStorage.setItem('nstroy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nstroy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsHeaderScrolled(scrollY > 36);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.round((scrollY / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3400);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const getEffectiveUnitPrice = useCallback(
    (product, quantity = 1) => {
      let price = product.price;
      const qualifiesBulk = isProMode || quantity >= product.bulkMinQty;
      if (qualifiesBulk && product.bulkDiscountPercent) {
        price = Math.round(price * (1 - product.bulkDiscountPercent / 100));
      }
      return price;
    },
    [isProMode]
  );

  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const nextQty = Math.min(product.stock, updated[existingIndex].quantity + qty);
          updated[existingIndex] = { ...updated[existingIndex], quantity: nextQty };
          return updated;
        }
        return [...prev, { id: product.id, quantity: Math.min(product.stock, qty) }];
      });
      addToast(`«${product.name.slice(0, 32)}...» savatga qo‘shildi`, 'success');
    },
    [addToast]
  );

  const updateCartQuantity = useCallback((productId, nextQty) => {
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    const maxAllowed = product ? product.stock : 999;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(maxAllowed, nextQty) } : item
      )
    );
  }, []);

  const toggleFavorite = useCallback(
    (productId) => {
      setFavorites((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          addToast('Mahsulot saralanganlardan olib tashlandi', 'info');
          return prev.filter((id) => id !== productId);
        }
        addToast('Mahsulot saralanganlarga saqlandi', 'success');
        return [...prev, productId];
      });
    },
    [addToast]
  );

  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMaxPriceLimit(3500000);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setSearchQuery('');
    setSortBy('popular');
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (product.price > maxPriceLimit) return false;
      if (onlyInStock && product.stock <= 0) return false;
      if (onlyDiscounted && !product.oldPrice) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchSku) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const discB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return discB - discA;
      }
      return b.reviewsCount - a.reviewsCount;
    });
  }, [
    selectedCategory,
    selectedBrands,
    maxPriceLimit,
    onlyInStock,
    onlyDiscounted,
    searchQuery,
    sortBy
  ]);

  const instantSearchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return PRODUCTS_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const cartDetails = useMemo(() => {
    const items = cart
      .map((entry) => {
        const product = PRODUCTS_DATA.find((p) => p.id === entry.id);
        if (!product) return null;
        const unitPrice = getEffectiveUnitPrice(product, entry.quantity);
        const standardTotal = product.price * entry.quantity;
        const lineTotal = unitPrice * entry.quantity;
        return {
          ...product,
          quantity: entry.quantity,
          unitPrice,
          lineTotal,
          bulkSavings: standardTotal - lineTotal
        };
      })
      .filter(Boolean);

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalBulkSavings = items.reduce((sum, item) => sum + item.bulkSavings, 0);
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const promoDiscount = appliedPromo
      ? Math.round(subtotal * (appliedPromo.discountPercent / 100))
      : 0;
    const deliveryFee =
      deliveryMethod === 'pickup' || subtotal === 0 || subtotal - promoDiscount >= 2500000
        ? 0
        : 65000;
    const grandTotal = Math.max(0, subtotal - promoDiscount + deliveryFee);

    return {
      items,
      subtotal,
      totalBulkSavings,
      totalCount,
      promoDiscount,
      deliveryFee,
      grandTotal
    };
  }, [cart, getEffectiveUnitPrice, appliedPromo, deliveryMethod]);

  const favoriteProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => favorites.includes(product.id));
  }, [favorites]);

  const calculatorOutput = useMemo(() => {
    if (calcTab === 'plaster') {
      const totalKg = Math.ceil(calcValues.area * (calcValues.thickness / 10) * 8.5 * 1.05);
      const bagsNeeded = Math.max(1, Math.ceil(totalKg / 30));
      const targetProduct = PRODUCTS_DATA.find((p) => p.id === 2);
      return {
        title: 'Knauf Rotband Gipsli Suvoq (30 kg)',
        summary: `${calcValues.area} m² yuza va ${calcValues.thickness} mm qalinlik uchun (5% zaxira bilan)`,
        primaryMetric: `${bagsNeeded} qop`,
        secondaryMetric: `Jami taxminiy og'irlik: ${totalKg} kg`,
        product: targetProduct,
        recommendedQty: bagsNeeded
      };
    }
    if (calcTab === 'blocks') {
      const wallArea = calcValues.wallLength * calcValues.wallHeight;
      const blocksPerSqm = 8.33;
      const totalBlocks = Math.max(1, Math.ceil(wallArea * blocksPerSqm * 1.04));
      const targetProduct = PRODUCTS_DATA.find((p) => p.id === 4);
      return {
        title: 'Avtoklav Gazoblok D500 (600x300x200 mm)',
        summary: `${wallArea.toFixed(1)} m² devor maydoni uchun (4% kesish zaxirasi bilan)`,
        primaryMetric: `${totalBlocks} dona`,
        secondaryMetric: `Taxminiy hajm: ${(totalBlocks / 27.7).toFixed(2)} m³`,
        product: targetProduct,
        recommendedQty: totalBlocks
      };
    }
    const litersNeeded = (calcValues.area * calcValues.paintCoats) / 10.5;
    const bucketsNeeded = Math.max(1, Math.ceil(litersNeeded / 9));
    const targetProduct = PRODUCTS_DATA.find((p) => p.id === 6);
    return {
      title: 'Tikkurila Euro Power 7 Bo‘yog‘i (9 L)',
      summary: `${calcValues.area} m² devorga ${calcValues.paintCoats} qatlam surtish uchun`,
      primaryMetric: `${bucketsNeeded} chelak (9 L)`,
      secondaryMetric: `Sof bo'yoq sarfi: ${litersNeeded.toFixed(1)} litr`,
      product: targetProduct,
      recommendedQty: bucketsNeeded
    };
  }, [calcTab, calcValues]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const normalized = promoCodeInput.trim().toUpperCase();
    if (!normalized) return;
    if (PROMO_CODES[normalized]) {
      setAppliedPromo({ code: normalized, ...PROMO_CODES[normalized] });
      addToast(`Promokod qo‘llandi: ${PROMO_CODES[normalized].label}`, 'success');
    } else {
      addToast("Bunday promokod topilmadi. «NSTROY10» kodini sinab ko'ring", 'error');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutData.fullName.trim() || checkoutData.phone.trim().length < 9) {
      addToast('Iltimos, ism va telefon raqamingizni to‘liq kiriting', 'error');
      return;
    }
    const orderNumber = `NST-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCompleted({
      orderNumber,
      customerName: checkoutData.fullName,
      phone: checkoutData.phone,
      total: cartDetails.grandTotal,
      itemsCount: cartDetails.totalCount,
      deliveryMethod
    });
    setCart([]);
    setAppliedPromo(null);
    addToast(`Buyurtma #${orderNumber} muvaffaqiyatli qabul qilindi!`, 'success');
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (maxPriceLimit < 3500000 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyDiscounted ? 1 : 0);

  return (
    <div className="nstroy-app">
      {/* YUQORI MA'LUMOT PANELI */}
      <div className="top-utility-bar">
        <div className="container top-utility-inner">
          <div className="utility-left">
            <span className="utility-badge">
              <span className="pulse-dot"></span>
              Toshkent bo‘ylab 2 soatda tezkor yetkazib berish
            </span>
            <span className="utility-divider">|</span>
            <span className="utility-text">2 500 000 so‘mdan yuqori xaridlarga yetkazish BEPUL</span>
          </div>

          <div className="utility-right">
            <button
              type="button"
              className={`pro-mode-switch ${isProMode ? 'active' : ''}`}
              onClick={() => {
                setIsProMode((prev) => !prev);
                addToast(
                  !isProMode
                    ? 'Usta / Optom rejimi yoqildi: ulgurji chegirmalar faol!'
                    : 'Standart chakana narxlar rejimi yoqildi',
                  'info'
                );
              }}
              title="Ustalar va qurilish kompaniyalari uchun ulgurji narxlar"
            >
              <span className="pro-indicator">PRO</span>
              <span>{isProMode ? 'Usta / Optom narxlar: YOQILGAN' : 'Usta / Optom rejimi'}</span>
            </button>

            <a href="tel:+998712058899" className="utility-phone">
              +998 (71) 205-88-99
            </a>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label="Mavzuni o'zgartirish"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ASOSIY STICKY HEADER */}
      <header className={`main-header ${isHeaderScrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-inner">
          <a
            href="#top"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="logo-mark">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="3" width="26" height="26" rx="6" fill="currentColor" />
                <path
                  d="M10 23V9L22 23V9"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="logo-text-group">
              <span className="logo-title">
                N<span className="logo-accent">STROY</span>
              </span>
              <span className="logo-subtitle">QURILISH MOLLARI MARKAZI</span>
            </div>
          </a>

          <button
            type="button"
            className="header-catalog-btn"
            onClick={() => scrollToSection(catalogRef)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>Katalog</span>
          </button>

          {/* JONLI QIDIRUV */}
          <div className="header-search-wrapper" ref={searchWrapperRef}>
            <div className="search-input-box">
              <svg
                className="search-icon"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                placeholder="Sement, Knauf, Bosch perforator yoki artikul bo‘yicha qidiring..."
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Tozalash"
                >
                  ×
                </button>
              )}
              <button
                type="button"
                className="search-submit-btn"
                onClick={() => {
                  setIsSearchDropdownOpen(false);
                  scrollToSection(catalogRef);
                }}
              >
                Topish
              </button>
            </div>

            {isSearchDropdownOpen && instantSearchSuggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                <div className="suggestions-header">Tezkor natijalar ({instantSearchSuggestions.length})</div>
                {instantSearchSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="suggestion-item"
                    onClick={() => {
                      setQuickViewProduct(item);
                      setQuickViewQty(1);
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-meta">
                        {item.brand} • Artikul: {item.sku}
                      </span>
                    </div>
                    <span className="suggestion-price">{formatPrice(item.price)} so‘m</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* HEADER HARAKAT TUGMALARI */}
          <div className="header-actions">
            <button
              type="button"
              className="action-icon-btn calc-shortcut-btn"
              onClick={() => scrollToSection(calculatorRef)}
              title="Qurilish materiallari kalkulyatori"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="11" x2="10" y2="11" />
                <line x1="14" y1="11" x2="16" y2="11" />
                <line x1="8" y1="15" x2="10" y2="15" />
                <line x1="14" y1="15" x2="16" y2="15" />
                <line x1="8" y1="19" x2="16" y2="19" />
              </svg>
              <span className="action-label">Kalkulyator</span>
            </button>

            <button
              type="button"
              className="action-icon-btn"
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Saralanganlar"
            >
              <div className="icon-badge-wrap">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {favorites.length > 0 && <span className="header-badge">{favorites.length}</span>}
              </div>
              <span className="action-label">Saralangan</span>
            </button>

            <button
              type="button"
              className="action-icon-btn cart-header-btn"
              onClick={() => {
                setOrderCompleted(null);
                setIsCartOpen(true);
              }}
              aria-label="Savat"
            >
              <div className="icon-badge-wrap">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartDetails.totalCount > 0 && (
                  <span className="header-badge accent-badge">{cartDetails.totalCount}</span>
                )}
              </div>
              <div className="cart-btn-text">
                <span className="action-label">Savat</span>
                {cartDetails.grandTotal > 0 && (
                  <span className="cart-mini-sum">{formatPrice(cartDetails.grandTotal)} so‘m</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* HERO BO'LIMI */}
      <section className="hero-section">
        <div className="hero-grid-pattern" aria-hidden="true"></div>
        <div className="container hero-container">
          <div className="hero-content animate-hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-tag">YANGI MAVSUM 2026</span>
              <span>Poydevordan tomgacha barcha qurilish mollari</span>
            </div>

            <h1 className="hero-title">
              Mustahkam qurilish uchun <span className="hero-highlight">sifatli materiallar</span> markazi
            </h1>

            <p className="hero-description">
              Nstroy — 12 500 dan ortiq sertifikatlangan qurilish mollari, original Bosch va Makita
              elektr asboblari hamda obyektingizga 2 soat ichida tezkor yetkazib berish xizmati.
            </p>

            <div className="hero-cta-row">
              <button
                type="button"
                className="btn-primary-hero"
                onClick={() => scrollToSection(catalogRef)}
              >
                <span>Katalogni ko‘rish</span>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                className="btn-secondary-hero"
                onClick={() => scrollToSection(calculatorRef)}
              >
                <span>Material sarfini hisoblash</span>
              </button>
            </div>

            <div className="hero-stats-grid">
              <div className="hero-stat-item">
                <strong>12 500+</strong>
                <span>Ombordagi mahsulotlar</span>
              </div>
              <div className="hero-stat-item">
                <strong>2 soatda</strong>
                <span>Toshkent bo‘ylab yetkazish</span>
              </div>
              <div className="hero-stat-item">
                <strong>100% GOST</strong>
                <span>Rasmiy zavod kafolati</span>
              </div>
            </div>
          </div>

          <div className="hero-visual animate-hero-right">
            <div className="hero-showcase-card">
              <div className="showcase-top-bar">
                <span className="showcase-live-pill">KUN TAKLIFI • -14%</span>
                <span className="showcase-sku">ART: NST-TL-201</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
                alt="Nstroy professional qurilish"
                className="hero-main-img"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="hero-floating-card floating-card-1">
                <div className="floating-icon">✓</div>
                <div>
                  <strong>Usta va Prorablar klubi</strong>
                  <span>Ulgurji xaridlarga 12% gacha chegirma</span>
                </div>
              </div>

              <div className="hero-floating-card floating-card-2">
                <div className="floating-metric">24/7</div>
                <div>
                  <strong>Manipulyator va Gazel</strong>
                  <span>Obyekt eshigigacha tushirib berish</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AFZALLIKLAR POLOSASI */}
      <section className="trust-strip reveal-on-scroll">
        <div className="container trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h3>Tezkor avtopark</h3>
              <p>Labo, Gazel, ISUZU va Manipulyatorlar har doim tayyor</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3>Original brendlar</h3>
              <p>Knauf, Bosch, Makita va Tikkurila rasmiy dileri</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </div>
            <div>
              <h3>30 kun qaytarish kafolati</h3>
              <p>Ortiqcha qolgan butun qop va mahsulotlarni qaytarib olamiz</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <h3>Barcha to‘lov turlari</h3>
              <p>Naqd, Uzcard/Humo, Payme, Click va QQS bilan perechisleniye</p>
            </div>
          </div>
        </div>
      </section>

      {/* AQLLI QURILISH KALKULYATORI */}
      <section className="calculator-section reveal-on-scroll" ref={calculatorRef}>
        <div className="container">
          <div className="calculator-box">
            <div className="calc-left">
              <span className="section-kicker">AQLLI YORDAMCHI</span>
              <h2>Qurilish materiallari kalkulyatori</h2>
              <p className="calc-subtitle">
                Xona yoki devor o‘lchamlarini kiriting — tizim kerakli mahsulot miqdorini zaxirasi
                bilan aniq hisoblab, bir bosishda savatga joylaydi.
              </p>

              <div className="calc-tabs">
                <button
                  type="button"
                  className={`calc-tab-btn ${calcTab === 'plaster' ? 'active' : ''}`}
                  onClick={() => setCalcTab('plaster')}
                >
                  Suvoq (Rotband)
                </button>
                <button
                  type="button"
                  className={`calc-tab-btn ${calcTab === 'blocks' ? 'active' : ''}`}
                  onClick={() => setCalcTab('blocks')}
                >
                  Gazoblok
                </button>
                <button
                  type="button"
                  className={`calc-tab-btn ${calcTab === 'paint' ? 'active' : ''}`}
                  onClick={() => setCalcTab('paint')}
                >
                  Interyer bo‘yoq
                </button>
              </div>

              <div className="calc-inputs-grid">
                {calcTab === 'plaster' && (
                  <>
                    <div className="calc-field">
                      <label htmlFor="calc-area">Devor / Shift maydoni (m²)</label>
                      <input
                        id="calc-area"
                        type="number"
                        min="1"
                        max="5000"
                        value={calcValues.area}
                        onChange={(e) =>
                          setCalcValues({ ...calcValues, area: Math.max(1, Number(e.target.value)) })
                        }
                      />
                    </div>
                    <div className="calc-field">
                      <label htmlFor="calc-thickness">Suvoq qalinligi (mm)</label>
                      <input
                        id="calc-thickness"
                        type="number"
                        min="5"
                        max="60"
                        value={calcValues.thickness}
                        onChange={(e) =>
                          setCalcValues({
                            ...calcValues,
                            thickness: Math.max(5, Number(e.target.value))
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {calcTab === 'blocks' && (
                  <>
                    <div className="calc-field">
                      <label htmlFor="calc-length">Devor umumiy uzunligi (m)</label>
                      <input
                        id="calc-length"
                        type="number"
                        min="1"
                        max="1000"
                        value={calcValues.wallLength}
                        onChange={(e) =>
                          setCalcValues({
                            ...calcValues,
                            wallLength: Math.max(1, Number(e.target.value))
                          })
                        }
                      />
                    </div>
                    <div className="calc-field">
                      <label htmlFor="calc-height">Devor balandligi (m)</label>
                      <input
                        id="calc-height"
                        type="number"
                        step="0.1"
                        min="1"
                        max="20"
                        value={calcValues.wallHeight}
                        onChange={(e) =>
                          setCalcValues({
                            ...calcValues,
                            wallHeight: Math.max(1, Number(e.target.value))
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {calcTab === 'paint' && (
                  <>
                    <div className="calc-field">
                      <label htmlFor="calc-paint-area">Bo‘yaladigan maydon (m²)</label>
                      <input
                        id="calc-paint-area"
                        type="number"
                        min="1"
                        max="5000"
                        value={calcValues.area}
                        onChange={(e) =>
                          setCalcValues({ ...calcValues, area: Math.max(1, Number(e.target.value)) })
                        }
                      />
                    </div>
                    <div className="calc-field">
                      <label htmlFor="calc-coats">Qatlamlar soni</label>
                      <select
                        id="calc-coats"
                        value={calcValues.paintCoats}
                        onChange={(e) =>
                          setCalcValues({ ...calcValues, paintCoats: Number(e.target.value) })
                        }
                      >
                        <option value={1}>1 qatlam</option>
                        <option value={2}>2 qatlam (tavsiya etiladi)</option>
                        <option value={3}>3 qatlam</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="calc-result-panel">
              <div className="calc-result-badge">HISOB-KITOB NATIJASI</div>
              <h3>{calculatorOutput.title}</h3>
              <p className="calc-result-desc">{calculatorOutput.summary}</p>

              <div className="calc-metrics-display">
                <div className="calc-primary-number">{calculatorOutput.primaryMetric}</div>
                <div className="calc-secondary-note">{calculatorOutput.secondaryMetric}</div>
              </div>

              {calculatorOutput.product && (
                <div className="calc-price-summary">
                  <span>Taxminiy summa:</span>
                  <strong>
                    {formatPrice(
                      getEffectiveUnitPrice(
                        calculatorOutput.product,
                        calculatorOutput.recommendedQty
                      ) * calculatorOutput.recommendedQty
                    )}{' '}
                    so‘m
                  </strong>
                </div>
              )}

              <button
                type="button"
                className="btn-calc-add"
                onClick={() => {
                  if (calculatorOutput.product) {
                    addToCart(calculatorOutput.product, calculatorOutput.recommendedQty);
                  }
                }}
              >
                Hisoblangan miqdorni savatga qo‘shish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ASOSIY MAHSULOTLAR KATALOGI */}
      <section className="catalog-section" ref={catalogRef}>
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-kicker">NSTROY ASSORTIMENT</span>
              <h2 className="section-heading">Qurilish mollari katalogi</h2>
            </div>

            <div className="category-pills-scroll">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-layout">
            {/* CHAP TOMON FILTRLAR PANELI */}
            <aside className="catalog-sidebar">
              <div className="sidebar-header">
                <h3>Filtrlar {activeFilterCount > 0 && `(${activeFilterCount})`}</h3>
                {activeFilterCount > 0 && (
                  <button type="button" className="reset-filters-link" onClick={resetAllFilters}>
                    Tozalash
                  </button>
                )}
              </div>

              <div className="filter-group">
                <label className="filter-group-title" htmlFor="price-range-slider">
                  Maksimal narx: <span>{formatPrice(maxPriceLimit)} so‘m</span>
                </label>
                <input
                  id="price-range-slider"
                  type="range"
                  min="10000"
                  max="3500000"
                  step="10000"
                  value={maxPriceLimit}
                  onChange={(e) => setMaxPriceLimit(Number(e.target.value))}
                  className="price-slider"
                />
                <div className="price-range-labels">
                  <span>10 000</span>
                  <span>3 500 000 so‘m</span>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Mavjudlik va Aksiyalar</div>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                  />
                  <span>Faqat omborda bor mahsulotlar</span>
                </label>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  />
                  <span>Chegirmadagi mahsulotlar</span>
                </label>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Ishlab chiqaruvchi brendlar</div>
                <div className="brands-checkbox-list">
                  {BRANDS.map((brand) => (
                    <label key={brand} className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleToggleBrand(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* O'NG TOMON MAHSULOTLAR RO'YXATI */}
            <div className="catalog-main-area">
              <div className="catalog-toolbar">
                <div className="results-counter">
                  Topildi: <strong>{filteredProducts.length}</strong> ta mahsulot
                  {isProMode && <span className="pro-active-tag">Usta narxlari faol</span>}
                </div>

                <div className="toolbar-controls">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                    aria-label="Saralash"
                  >
                    <option value="popular">Ommabopligi bo‘yicha</option>
                    <option value="price-asc">Avval arzonroqlari</option>
                    <option value="price-desc">Avval qimmatroqlari</option>
                    <option value="rating">Yuqori reyting</option>
                    <option value="discount">Katta chegirmalar</option>
                  </select>

                  <div className="view-mode-switcher">
                    <button
                      type="button"
                      className={viewMode === 'grid' ? 'active' : ''}
                      onClick={() => setViewMode('grid')}
                      aria-label="Katak ko'rinish"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={viewMode === 'list' ? 'active' : ''}
                      onClick={() => setViewMode('list')}
                      aria-label="Ro'yxat ko'rinish"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-catalog-state">
                  <h3>So‘rovingiz bo‘yicha mahsulot topilmadi</h3>
                  <p>Filtr parametrlarini o‘zgartirib ko‘ring yoki barcha filtrlarni tozalang.</p>
                  <button type="button" className="btn-primary-hero" onClick={resetAllFilters}>
                    Filtrlarni tozalash
                  </button>
                </div>
              ) : (
                <div className={`products-container ${viewMode === 'list' ? 'list-layout' : 'grid-layout'}`}>
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                      cartItem={cart.find((item) => item.id === product.id)}
                      onAddToCart={addToCart}
                      onUpdateQuantity={updateCartQuantity}
                      onQuickView={(item) => {
                        setQuickViewProduct(item);
                        setQuickViewQty(1);
                      }}
                      isProMode={isProMode}
                      viewMode={viewMode}
                      animationIndex={index}
                      onShowToast={addToast}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* B2B VA PRORABLAR UCHUN MAXSUS BANNER */}
      <section className="b2b-banner-section reveal-on-scroll">
        <div className="container">
          <div className="b2b-card">
            <div className="b2b-text">
              <span className="b2b-tag">B2B & USTA HAMKORLIK</span>
              <h2>Katta obyekt quryapsizmi? Smetangizni bizga yuboring!</h2>
              <p>
                Shaxsiy menejer biriktiramiz, barcha materiallarni ulgurji zavod narxida hisoblab
                beramiz va grafik asosida obyektga yetkazib turamiz.
              </p>
              <div className="b2b-perks">
                <span>✓ QQS bilan elektron hisob-faktura</span>
                <span>✓ 12% gacha ulgurji chegirma</span>
                <span>✓ Bo‘lib-bo‘lib yetkazish grafiki</span>
              </div>
            </div>
            <div className="b2b-action">
              <button
                type="button"
                className="btn-b2b-activate"
                onClick={() => {
                  setIsProMode(true);
                  scrollToSection(catalogRef);
                  addToast('Usta / Optom narxlar rejimi faollashtirildi!', 'success');
                }}
              >
                Optom narxlarni ko‘rish
              </button>
              <span className="b2b-note">Promokod: USTA2026 (-12%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILIALLAR VA SAVOL-JAVOBLAR */}
      <section className="branches-faq-section reveal-on-scroll">
        <div className="container branches-faq-grid">
          <div className="branches-box">
            <span className="section-kicker">DO‘KONLARIMIZ</span>
            <h2>Toshkentdagi Nstroy savdo markazlari</h2>

            <div className="branch-tabs">
              {BRANCHES_DATA.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  className={`branch-tab ${activeBranchTab === branch.id ? 'active' : ''}`}
                  onClick={() => setActiveBranchTab(branch.id)}
                >
                  {branch.name.replace('Nstroy ', '')}
                </button>
              ))}
            </div>

            {BRANCHES_DATA.filter((b) => b.id === activeBranchTab).map((branch) => (
              <div key={branch.id} className="branch-detail-card">
                <h3>{branch.name}</h3>
                <p className="branch-address">{branch.address}</p>
                <div className="branch-meta-row">
                  <span>Ish vaqti: {branch.hours}</span>
                  <a href={`tel:${branch.phone.replace(/\s+/g, '')}`}>{branch.phone}</a>
                </div>
                <div className="branch-features">
                  {branch.features.map((feat) => (
                    <span key={feat} className="branch-feature-chip">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="faq-box">
            <span className="section-kicker">KO‘P BERILADIGAN SAVOLLAR</span>
            <h2>Mijozlarimiz savollariga javoblar</h2>

            <div className="faq-list">
              {FAQ_DATA.map((item, idx) => (
                <div
                  key={item.question}
                  className={`faq-item ${activeFaqIndex === idx ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? -1 : idx)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-toggle-icon">{activeFaqIndex === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaqIndex === idx && <div className="faq-answer">{item.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <div className="logo-title footer-logo">
              N<span className="logo-accent">STROY</span>
            </div>
            <p>
              O‘zbekistonning zamonaviy qurilish mollari va professional elektr asboblari
              gipermarketi. Sifat, aniqlik va tezkor yetkazib berish kafolati.
            </p>
            <div className="payment-badges">
              <span>UZCARD</span>
              <span>HUMO</span>
              <span>PAYME</span>
              <span>CLICK</span>
              <span>QQS / B2B</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Katalog bo‘limlari</h4>
            <ul>
              {CATEGORIES.slice(1, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      scrollToSection(catalogRef);
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Xaridorlarga</h4>
            <ul>
              <li>
                <button type="button" onClick={() => scrollToSection(calculatorRef)}>
                  Qurilish kalkulyatori
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setIsProMode(true);
                    scrollToSection(catalogRef);
                  }}
                >
                  Usta va Prorablar dasturi
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setIsCartOpen(true)}>
                  Savat va Yetkazib berish
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>Aloqa markazi</h4>
            <a href="tel:+998712058899" className="footer-big-phone">
              +998 (71) 205-88-99
            </a>
            <p>Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi, 42-uy</p>
            <p>info@nstroy.uz • Har kuni 08:00 – 21:00</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 Nstroy Qurilish Mollari. Barcha huquqlar himoyalangan.</span>
            <span>Senior Architecture Edition</span>
          </div>
        </div>
      </footer>

      {/* TEZKOR KO'RISH MODALI */}
      {quickViewProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setQuickViewProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Yopish"
            >
              ×
            </button>

            <div className="qv-grid">
              <div className="qv-image-box">
                {quickViewProduct.badge && (
                  <span className="qv-badge">{quickViewProduct.badge}</span>
                )}
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>

              <div className="qv-details">
                <div className="qv-meta-top">
                  <span className="qv-brand">{quickViewProduct.brand}</span>
                  <span className="qv-sku">Artikul: {quickViewProduct.sku}</span>
                </div>

                <h2>{quickViewProduct.name}</h2>

                <div className="qv-rating-row">
                  <span className="qv-stars">★ {quickViewProduct.rating}</span>
                  <span>({quickViewProduct.reviewsCount} ta sharh)</span>
                  <span className="qv-stock">Omborda: {quickViewProduct.stock} ta bor</span>
                </div>

                <p className="qv-description">{quickViewProduct.description}</p>

                <div className="qv-specs-table">
                  {Object.entries(quickViewProduct.specs).map(([key, val]) => (
                    <div key={key} className="qv-spec-row">
                      <span>{key}</span>
                      <strong>{val}</strong>
                    </div>
                  ))}
                </div>

                <div className="qv-price-block">
                  <div>
                    <div className="qv-current-price">
                      {formatPrice(getEffectiveUnitPrice(quickViewProduct, quickViewQty))} so‘m{' '}
                      <small>/ {quickViewProduct.unit}</small>
                    </div>
                    {quickViewProduct.oldPrice && (
                      <div className="qv-old-price">
                        {formatPrice(quickViewProduct.oldPrice)} so‘m
                      </div>
                    )}
                  </div>

                  <div className="qv-bulk-note">
                    {quickViewProduct.bulkMinQty}+ {quickViewProduct.unit} olinsa:{' '}
                    <strong>-{quickViewProduct.bulkDiscountPercent}% chegirma</strong>
                  </div>
                </div>

                <div className="qv-actions-row">
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span>{quickViewQty}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickViewQty((q) => Math.min(quickViewProduct.stock, q + 1))
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-qv-add"
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewQty);
                      setQuickViewProduct(null);
                    }}
                  >
                    Savatga qo‘shish •{' '}
                    {formatPrice(
                      getEffectiveUnitPrice(quickViewProduct, quickViewQty) * quickViewQty
                    )}{' '}
                    so‘m
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SARALANGANLAR DRAWER */}
      {isWishlistOpen && (
        <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
          <aside className="side-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Saralangan mahsulotlar ({favoriteProducts.length})</h3>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsWishlistOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="drawer-body">
              {favoriteProducts.length === 0 ? (
                <div className="drawer-empty">
                  <p>Hozircha saralangan mahsulotlar yo‘q.</p>
                  <span>Mahsulot kartochkasidagi yurakcha belgisini bosib saqlang.</span>
                </div>
              ) : (
                <div className="wishlist-items-list">
                  {favoriteProducts.map((item) => (
                    <div key={item.id} className="wishlist-row-card">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="wishlist-row-info">
                        <h4>{item.name}</h4>
                        <span className="wishlist-row-price">
                          {formatPrice(getEffectiveUnitPrice(item, 1))} so‘m / {item.unit}
                        </span>
                        <div className="wishlist-row-actions">
                          <button
                            type="button"
                            className="btn-mini-cart"
                            onClick={() => addToCart(item, 1)}
                          >
                            Savatga
                          </button>
                          <button
                            type="button"
                            className="btn-mini-remove"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            O‘chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* SAVAT VA BUYURTMA DRAWER */}
      {isCartOpen && (
        <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <aside className="side-drawer cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Savat ({cartDetails.totalCount} ta mahsulot)</h3>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsCartOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="drawer-body">
              {orderCompleted ? (
                <div className="order-success-box">
                  <div className="success-check-circle">✓</div>
                  <h3>Buyurtmangiz qabul qilindi!</h3>
                  <p className="order-number-pill">Buyurtma raqami: #{orderCompleted.orderNumber}</p>
                  <p>
                    Hurmatli <strong>{orderCompleted.customerName}</strong>, Nstroy operatori 5
                    daqiqa ichida <strong>{orderCompleted.phone}</strong> raqamiga bog‘lanib
                    yetkazib berish vaqtini tasdiqlaydi.
                  </p>
                  <div className="order-receipt-summary">
                    <div>
                      <span>Jami to‘lov summasi:</span>
                      <strong>{formatPrice(orderCompleted.total)} so‘m</strong>
                    </div>
                    <div>
                      <span>Yetkazish turi:</span>
                      <strong>
                        {orderCompleted.deliveryMethod === 'courier'
                          ? 'Kuryer orqali manzilga'
                          : 'Do‘kondan olib ketish'}
                      </strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-hero"
                    onClick={() => {
                      setOrderCompleted(null);
                      setIsCartOpen(false);
                    }}
                  >
                    Xaridni davom ettirish
                  </button>
                </div>
              ) : cartDetails.items.length === 0 ? (
                <div className="drawer-empty">
                  <p>Savatingiz hozircha bo‘sh</p>
                  <span>Qurilish materiallari katalogidan kerakli mahsulotlarni tanlang.</span>
                  <button
                    type="button"
                    className="btn-primary-hero"
                    onClick={() => {
                      setIsCartOpen(false);
                      scrollToSection(catalogRef);
                    }}
                  >
                    Katalogga o‘tish
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items-list">
                    {cartDetails.items.map((item) => (
                      <div key={item.id} className="cart-item-row">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <div className="cart-item-unit-price">
                            {formatPrice(item.unitPrice)} so‘m / {item.unit}
                            {item.bulkSavings > 0 && (
                              <span className="bulk-applied-badge">Optom narx</span>
                            )}
                          </div>
                          <div className="cart-item-controls">
                            <div className="qty-stepper small">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <strong className="cart-line-total">
                              {formatPrice(item.lineTotal)} so‘m
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PROMOKOD */}
                  <form className="promo-form" onSubmit={handleApplyPromo}>
                    <input
                      type="text"
                      placeholder="Promokod (masalan: NSTROY10)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                    />
                    <button type="submit">Qo‘llash</button>
                  </form>

                  {/* HISOB-KITOB */}
                  <div className="cart-totals-card">
                    <div className="total-row">
                      <span>Mahsulotlar qiymati:</span>
                      <span>{formatPrice(cartDetails.subtotal)} so‘m</span>
                    </div>
                    {cartDetails.totalBulkSavings > 0 && (
                      <div className="total-row discount-row">
                        <span>Ulgurji / Usta tejaldi:</span>
                        <span>−{formatPrice(cartDetails.totalBulkSavings)} so‘m</span>
                      </div>
                    )}
                    {cartDetails.promoDiscount > 0 && (
                      <div className="total-row discount-row">
                        <span>Promokod ({appliedPromo.code}):</span>
                        <span>−{formatPrice(cartDetails.promoDiscount)} so‘m</span>
                      </div>
                    )}
                    <div className="total-row">
                      <span>Yetkazib berish:</span>
                      <span>
                        {cartDetails.deliveryFee === 0
                          ? 'Bepul'
                          : `${formatPrice(cartDetails.deliveryFee)} so‘m`}
                      </span>
                    </div>
                    <div className="total-row grand-total-row">
                      <span>Jami to‘lov:</span>
                      <strong>{formatPrice(cartDetails.grandTotal)} so‘m</strong>
                    </div>
                  </div>

                  {/* BUYURTMA FORMASI */}
                  <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                    <h4>Buyurtmani rasmiylashtirish</h4>

                    <div className="delivery-toggle-row">
                      <button
                        type="button"
                        className={deliveryMethod === 'courier' ? 'active' : ''}
                        onClick={() => setDeliveryMethod('courier')}
                      >
                        Obyektga yetkazish
                      </button>
                      <button
                        type="button"
                        className={deliveryMethod === 'pickup' ? 'active' : ''}
                        onClick={() => setDeliveryMethod('pickup')}
                      >
                        Do‘kondan olib ketish
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Ism va familiyangiz"
                      value={checkoutData.fullName}
                      onChange={(e) =>
                        setCheckoutData({ ...checkoutData, fullName: e.target.value })
                      }
                    />

                    <input
                      type="tel"
                      required
                      placeholder="+998 (90) 123-45-67"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                    />

                    {deliveryMethod === 'courier' ? (
                      <input
                        type="text"
                        required
                        placeholder="Yetkazib berish manzili (tuman, ko‘cha, uy)"
                        value={checkoutData.address}
                        onChange={(e) =>
                          setCheckoutData({ ...checkoutData, address: e.target.value })
                        }
                      />
                    ) : (
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                      >
                        {BRANCHES_DATA.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <select
                      value={checkoutData.paymentMethod}
                      onChange={(e) =>
                        setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
                      }
                    >
                      <option value="card">Payme / Click / Karta orqali</option>
                      <option value="cash">Yetkazib berilganda naqd pul</option>
                      <option value="invoice">Pul o‘tkazish (Yuridik shaxs / QQS)</option>
                    </select>

                    <button type="submit" className="btn-submit-order">
                      Buyurtmani tasdiqlash • {formatPrice(cartDetails.grandTotal)} so‘m
                    </button>
                  </form>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* TOAST BILDIRISHNOMALAR */}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button type="button" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {/* YUQORIGA QAYTISH TUGMASI */}
      {scrollProgress > 12 && (
        <button
          type="button"
          className="scroll-top-fab"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Yuqoriga qaytish"
        >
          ↑
        </button>
      )}
    </div>
  );
}