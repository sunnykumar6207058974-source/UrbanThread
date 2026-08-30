require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectForSeed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/urbanthread';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB at', uri);
    return null;
  } catch {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
    console.log('✅ Connected to embedded MongoDB');
    return mem;
  }
};

const PRODUCTS = [
  // ── Flash Deals ──────────────────────────────────────────────────────────
  {
    slug: 'flash-1',
    name: 'Noise-Cancelling Wireless Headphones Pro X',
    category: 'Electronics',
    brand: 'AURA SOUND',
    price: 129,
    originalPrice: 299,
    discount: '57% OFF',
    rating: 4.9,
    reviewsCount: 1420,
    stockLeft: 6,
    totalStock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['#111111', '#e5e5e5', '#1d3557'],
    description: 'Experience spatial high-fidelity audio with active noise cancellation, 40-hour battery life, and ultra-soft memory foam ear cushions.',
    isFlash: true,
    isTrending: true
  },
  {
    slug: 'flash-2',
    name: 'Oversized Velvet Bomber Jacket - Midnight Black',
    category: 'Men',
    brand: 'URBAN LEGEND',
    price: 89,
    originalPrice: 220,
    discount: '60% OFF',
    rating: 4.8,
    reviewsCount: 890,
    stockLeft: 4,
    totalStock: 30,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#121212', '#3a405a', '#4a154b'],
    description: 'Premium handcrafted velvet quilted bomber jacket featuring thermal lining, satin finish, and custom metallic hardware.',
    isFlash: true
  },
  {
    slug: 'flash-3',
    name: 'Chrono Luxe Heritage Minimalist White Dial Watch',
    category: 'Watches',
    brand: 'CHRONO LUXE',
    price: 199,
    originalPrice: 499,
    discount: '60% OFF',
    rating: 4.9,
    reviewsCount: 654,
    stockLeft: 3,
    totalStock: 25,
    image: '/watches/chrono.jpg',
    images: ['/watches/chrono.jpg'],
    colors: ['#ffffff', '#c0c0c0', '#111111'],
    description: 'Swiss movement sapphire crystal glass face with 50m water resistance and genuine Italian leather strap.',
    isFlash: true
  },
  {
    slug: 'flash-4',
    name: 'Retrodunk High Vintage Leather Sneakers',
    category: 'Shoes',
    brand: 'SOLE STREET',
    price: 110,
    originalPrice: 240,
    discount: '54% OFF',
    rating: 4.7,
    reviewsCount: 2100,
    stockLeft: 8,
    totalStock: 40,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['#b80000', '#111111', '#0284c7'],
    description: 'Classic high-top basketball aesthetic with premium full-grain leather, padded collar, and responsive air cushioning.',
    isFlash: true
  },

  // ── ⌚ 5 WATCHES ──────────────────────────────────────────────────────────
  {
    slug: 'watch-1',
    name: 'Rolex Submariner Oystersteel Automatic Chronometer',
    category: 'Watches',
    brand: 'ROLEX',
    price: 349,
    originalPrice: 699,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 920,
    stockLeft: 12,
    totalStock: 50,
    image: '/watches/rolex.jpg',
    images: [
      '/watches/rolex.jpg'
    ],
    colors: ['#d4af37', '#c0c0c0', '#111111'],
    description: 'Legendary Swiss self-winding mechanical calibre, unidirectional rotatable Cerachrom bezel, and Oysterlock safety clasp.',
    isTrending: true,
    isBestSeller: true
  },
  {
    slug: 'watch-2',
    name: 'Seiko 5 Sports Automatic Stainless Steel Watch',
    category: 'Watches',
    brand: 'SEIKO',
    price: 189,
    originalPrice: 350,
    discount: '46% OFF',
    rating: 4.8,
    reviewsCount: 640,
    stockLeft: 15,
    totalStock: 60,
    image: '/watches/seiko.jpg',
    images: [
      '/watches/seiko.jpg'
    ],
    colors: ['#c0c0c0', '#111111', '#1d3557'],
    description: 'Japanese 4R36 automatic movement with manual winding, Hardlex crystal, Day/Date display, and solid stainless steel link bracelet.',
    isNewProduct: true
  },
  {
    slug: 'watch-3',
    name: 'Fossil Grant Chronograph Brown Leather Watch',
    category: 'Watches',
    brand: 'FOSSIL',
    price: 129,
    originalPrice: 220,
    discount: '41% OFF',
    rating: 4.7,
    reviewsCount: 410,
    stockLeft: 8,
    totalStock: 40,
    image: '/watches/fossil.jpg',
    images: [
      '/watches/fossil.jpg'
    ],
    colors: ['#8b4513', '#f5f6fa', '#111111'],
    description: 'Vintage-inspired Roman numeral indices, genuine supple brown leather band, and 3-hand stopwatch quartz chronograph.',
    isTrending: true
  },
  {
    slug: 'watch-4',
    name: 'Omega Speedmaster Dark Side Ceramic Diver Watch',
    category: 'Watches',
    brand: 'OMEGA',
    price: 299,
    originalPrice: 599,
    discount: '50% OFF',
    rating: 5.0,
    reviewsCount: 1150,
    stockLeft: 5,
    totalStock: 25,
    image: '/watches/omega.jpg',
    images: [
      '/watches/omega.jpg'
    ],
    colors: ['#111111', '#2c3e50'],
    description: 'High-tech zirconium oxide black ceramic case, Co-Axial Master Chronometer calibre, and 300m professional dive rating.',
    isBestSeller: true
  },
  {
    slug: 'watch-5',
    name: 'Titan Classique Royal Gold Bezel Roman Dial Watch',
    category: 'Watches',
    brand: 'TITAN',
    price: 159,
    originalPrice: 299,
    discount: '47% OFF',
    rating: 4.8,
    reviewsCount: 520,
    stockLeft: 14,
    totalStock: 45,
    image: '/watches/titan.jpg',
    images: [
      '/watches/titan.jpg'
    ],
    colors: ['#d4af37', '#f5f6fa', '#111111'],
    description: 'Elegant 18K gold-plated case with classical Roman numerals, champagne sunray dial, and water-resistant slim profile.',
    isNewProduct: true
  },



  // ── 👟 5 SHOES ────────────────────────────────────────────────────────────
  {
    slug: 'shoe-1',
    name: 'Nike Air Zoom Alphafly Carbon Road Running Shoes',
    category: 'Shoes',
    brand: 'NIKE',
    price: 185,
    originalPrice: 280,
    discount: '34% OFF',
    rating: 4.9,
    reviewsCount: 1820,
    stockLeft: 9,
    totalStock: 50,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: ['#ff3838', '#111111', '#ffffff'],
    description: 'Propulsive full-length carbon fiber Flyplate with dual Zoom Air pods for marathon velocity and maximum energy return.',
    isTrending: true,
    isBestSeller: true
  },
  {
    slug: 'shoe-2',
    name: 'Adidas Ultraboost Light Responsive Running Shoes',
    category: 'Shoes',
    brand: 'ADIDAS',
    price: 149,
    originalPrice: 220,
    discount: '32% OFF',
    rating: 4.8,
    reviewsCount: 1340,
    stockLeft: 11,
    totalStock: 55,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['#ffffff', '#000000', '#3867d6'],
    description: 'Light BOOST cushioning with Continental™ Better Rubber outsole and adaptive PRIMEKNIT+ textile upper.',
    isBestSeller: true
  },
  {
    slug: 'shoe-3',
    name: 'Puma Suede Classic Heritage Street Sneakers',
    category: 'Shoes',
    brand: 'PUMA',
    price: 79,
    originalPrice: 120,
    discount: '34% OFF',
    rating: 4.7,
    reviewsCount: 980,
    stockLeft: 14,
    totalStock: 60,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['#eb3b5a', '#2d98da', '#20bf6b'],
    description: 'Iconic vintage low-top silhouette crafted with silky suede upper, white rubber foxing, and gold foil Puma callout.',
    isNewProduct: true
  },
  {
    slug: 'shoe-4',
    name: 'Air Jordan 1 Retro High OG Vintage Basketball Shoes',
    category: 'Shoes',
    brand: 'AIR JORDAN',
    price: 175,
    originalPrice: 260,
    discount: '33% OFF',
    rating: 4.9,
    reviewsCount: 2450,
    stockLeft: 6,
    totalStock: 35,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: ['#b80000', '#111111', '#ffffff'],
    description: 'Legendary high-top court icon featuring full-grain leather, Nike Air cushioning unit, and archival color-blocking.',
    isTrending: true
  },
  {
    slug: 'shoe-5',
    name: 'New Balance 9060 Chunky Lifestyle Walking Shoes',
    category: 'Shoes',
    brand: 'NEW BALANCE',
    price: 140,
    originalPrice: 200,
    discount: '30% OFF',
    rating: 4.8,
    reviewsCount: 890,
    stockLeft: 10,
    totalStock: 45,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['#d1d8e0', '#778ca3', '#2d3436'],
    description: 'Futuristic chunky aesthetic with ABZORB and SBS dual-density midsole cushioning for supreme walking comfort.',
    isNewProduct: true
  },

  // ── 🥻 5 SAREES ───────────────────────────────────────────────────────────
  {
    slug: 'saree-1',
    name: 'Kanjivaram Pure Silk Zari Weave Wedding Saree',
    category: 'Sarees',
    brand: 'RANGOLI ETHNICS',
    price: 165,
    originalPrice: 350,
    discount: '53% OFF',
    rating: 4.9,
    reviewsCount: 780,
    stockLeft: 7,
    totalStock: 30,
    image: '/sarees/kanjivaram.jpg',
    images: [
      '/sarees/kanjivaram.jpg'
    ],
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['#5e249f', '#d4af37', '#8e44ad'],
    description: 'Heirloom grade pure mulberry silk saree featuring intricate 24K gold zari floral brocade border and matching unstitched blouse piece.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'saree-2',
    name: 'Banarasi Crimson Brocade Royal Bridal Silk Saree',
    category: 'Sarees',
    brand: 'VERONA STUDIO',
    price: 145,
    originalPrice: 290,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 560,
    stockLeft: 9,
    totalStock: 35,
    image: '/sarees/banarasi.jpg',
    images: [
      '/sarees/banarasi.jpg'
    ],
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['#b71540', '#f6b93b', '#0a3d62'],
    description: 'Traditional Banarasi weave with regal floral motifs, heavy pallu, and rich jacquard finish for grand celebrations.',
    isTrending: true
  },
  {
    slug: 'saree-3',
    name: 'Chanderi Handblock Floral Pastel Cotton Silk Saree',
    category: 'Sarees',
    brand: 'RANGOLI ETHNICS',
    price: 69,
    originalPrice: 140,
    discount: '51% OFF',
    rating: 4.7,
    reviewsCount: 430,
    stockLeft: 12,
    totalStock: 50,
    image: '/sarees/chanderi.jpg',
    images: [
      '/sarees/chanderi.jpg'
    ],
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['#ffeaa7', '#74b9ff', '#fab1a0'],
    description: 'Feather-light Chanderi silk cotton blend with authentic Sanganeri handblock botanical prints and glossy golden border.',
    isNewProduct: true
  },
  {
    slug: 'saree-4',
    name: 'Organza Embroidered Designer Pastel Party Saree',
    category: 'Sarees',
    brand: 'LUMIÈRE ATELIER',
    price: 95,
    originalPrice: 199,
    discount: '52% OFF',
    rating: 4.9,
    reviewsCount: 620,
    stockLeft: 8,
    totalStock: 40,
    image: '/sarees/organza.jpg',
    images: [
      '/sarees/organza.jpg'
    ],
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['#fd79a8', '#a29bfe', '#55efc4'],
    description: 'Translucent lightweight organza drape embellished with delicate cut-dana thread embroidery and scalloped border.',
    isBestSeller: true
  },
  {
    slug: 'saree-5',
    name: 'Tussar Silk Handloom Emerald & Mustard Festive Saree',
    category: 'Sarees',
    brand: 'RANGOLI ETHNICS',
    price: 135,
    originalPrice: 280,
    discount: '52% OFF',
    rating: 4.8,
    reviewsCount: 510,
    stockLeft: 11,
    totalStock: 45,
    image: '/sarees/tussar.jpg',
    images: [
      '/sarees/tussar.jpg'
    ],
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['#27ae60', '#f39c12', '#d4af37'],
    description: 'Authentic handloom Tussar silk drape boasting vibrant emerald green body with rich mustard gold zari temple border.',
    isNewProduct: true
  },

  // ── 👗 5 LUXURY WOMEN'S SUITS ─────────────────────────────────────────────
  {
    slug: 'suit-1',
    name: 'Royal Emerald Velvet Embroidered Anarkali Suit Set',
    category: 'Women',
    brand: 'RITU KUMAR COUTURE',
    price: 145,
    originalPrice: 290,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 680,
    stockLeft: 7,
    totalStock: 35,
    image: '/suits/emerald-anarkali.jpg',
    images: ['/suits/emerald-anarkali.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#0f5132', '#1a472a', '#d4af37'],
    description: 'Opulent micro-velvet Anarkali suit set in royal emerald green featuring intricate gold zardozi hand embroidery, heavy flared hemline, churidar pants, and a sheer embroidered dupatta with golden border.',
    isBestSeller: true,
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'suit-2',
    name: 'Pastel Blush Georgette Mirror-Work Sharara Suit',
    category: 'Women',
    brand: 'BIBA LUXE',
    price: 115,
    originalPrice: 230,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 520,
    stockLeft: 12,
    totalStock: 50,
    image: '/suits/blush-sharara.jpg',
    images: ['/suits/blush-sharara.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f7d1d5', '#fce4ec', '#c0c0c0'],
    description: 'Ethereal pastel blush pink georgette kurta featuring delicate silver foil mirror work, tiered flared sharara pants with gota patti borders, and a lightweight scalloped dupatta.',
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'suit-3',
    name: 'Midnight Navy Blue Zardozi Silk Straight Suit Set',
    category: 'Women',
    brand: 'MANISH MALHOTRA CURATED',
    price: 165,
    originalPrice: 330,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 740,
    stockLeft: 5,
    totalStock: 30,
    image: '/suits/navy-zardozi.jpg',
    images: ['/suits/navy-zardozi.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#0c1445', '#1e3799', '#f6b93b'],
    description: 'Regal midnight navy raw silk straight-cut kurta tailored with antique gold zardozi & dabka neck work, sleek cigarette trousers, and a luxurious banarasi woven silk dupatta.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'suit-4',
    name: 'Ivory & Gold Chikankari Hand-Embroidered Kurta Suit',
    category: 'Women',
    brand: 'LUCKNOWI HERITAGE',
    price: 125,
    originalPrice: 250,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 890,
    stockLeft: 9,
    totalStock: 45,
    image: '/suits/ivory-chikankari.jpg',
    images: ['/suits/ivory-chikankari.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#fafaf0', '#fffaf0', '#e6cf8b'],
    description: 'Mastercrafted Lucknowi Chikankari floral needlework on pure georgette with subtle pearl and mukaish embellishments, paired with wide-leg palazzo pants and a scalloped embroidered organza dupatta.',
    isBestSeller: true,
    isNewProduct: true
  },
  {
    slug: 'suit-5',
    name: 'Crimson Red Festive Organza Pakistani Salwar Suit',
    category: 'Women',
    brand: 'SABYASACHI INSPIRA',
    price: 155,
    originalPrice: 310,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 610,
    stockLeft: 8,
    totalStock: 40,
    image: '/suits/crimson-pakistani.jpg',
    images: ['/suits/crimson-pakistani.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#8b0000', '#c0392b', '#d4af37'],
    description: 'Vibrant crimson festive organza suit adorned with heavy tilla embroidery, cutwork sleeves, embroidered wide-leg trousers, and a lightweight organza dupatta with four-sided embroidered borders.',
    isTrending: true,
    isNewProduct: true
  },

  // ── 🤵 5 LUXURY MEN'S BLAZERS ─────────────────────────────────────────────
  {
    slug: 'blazer-1',
    name: 'Savile Row Italian Wool Slim-Fit Navy Blazer',
    category: 'Men',
    brand: 'SAVILE ROW',
    price: 165,
    originalPrice: 330,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 780,
    stockLeft: 6,
    totalStock: 30,
    image: '/blazers/navy-wool.jpg',
    images: ['/blazers/navy-wool.jpg'],
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    colors: ['#1b2a47', '#0d1b2a', '#334155'],
    description: 'Tailored from pure Super 130s Italian wool, featuring elegant notched lapels, dual rear vents, horn buttons, and breathable half-canvas construction.',
    isBestSeller: true,
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'blazer-2',
    name: 'Royal Velvet Peak Lapel Tuxedo Blazer - Midnight Black',
    category: 'Men',
    brand: 'TOM FORD CURATED',
    price: 195,
    originalPrice: 390,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 640,
    stockLeft: 4,
    totalStock: 25,
    image: '/blazers/black-velvet-tuxedo.jpg',
    images: ['/blazers/black-velvet-tuxedo.jpg'],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['#111111', '#1e272e', '#2d3436'],
    description: 'Opulent midnight black cotton-velvet evening jacket finished with silk satin peak lapels, single jetted pockets, and silk covered buttons for black-tie galas.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'blazer-3',
    name: 'Double-Breasted Houndstooth Tweed Blazer - Charcoal & Camel',
    category: 'Men',
    brand: 'ARMANI HERITAGE',
    price: 175,
    originalPrice: 350,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 510,
    stockLeft: 8,
    totalStock: 35,
    image: '/blazers/houndstooth-tweed.jpg',
    images: ['/blazers/houndstooth-tweed.jpg'],
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    colors: ['#3d3d3d', '#8c7b75', '#2f3542'],
    description: 'Heritage British tweed wool blend in a micro-houndstooth check, cut in a modern double-breasted 6x2 silhouette with wide peaked lapels and flap pockets.',
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'blazer-4',
    name: 'European Linen Tailored Summer Blazer - Sand Beige',
    category: 'Men',
    brand: 'BRUNELLO CUCINELLI',
    price: 145,
    originalPrice: 290,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 920,
    stockLeft: 10,
    totalStock: 40,
    image: '/blazers/sand-linen.jpg',
    images: ['/blazers/sand-linen.jpg'],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['#e0d5c1', '#f5f0e6', '#c7b198'],
    description: 'Unstructured soft-tailored blazer woven from breathable Normandy flax linen with natural horn buttons, patch pockets, and unlined interior for effortless Mediterranean summer elegance.',
    isBestSeller: true,
    isNewProduct: true
  },
  {
    slug: 'blazer-5',
    name: 'Burgundy Jacquard Dinner Jacket Blazer with Shawl Lapel',
    category: 'Men',
    brand: 'RALPH LAUREN PURPLE LABEL',
    price: 185,
    originalPrice: 370,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 430,
    stockLeft: 5,
    totalStock: 25,
    image: '/blazers/burgundy-jacquard.jpg',
    images: ['/blazers/burgundy-jacquard.jpg'],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['#671026', '#800020', '#111111'],
    description: 'Dramatic floral silk jacquard dinner jacket in deep vintage burgundy wine with contrasting black silk satin shawl collar, tailored for statement evening wear.',
    isTrending: true,
    isNewProduct: true
  },

  // ── 💼 5 LUXURY MEN'S LEATHER PURSES & WALLETS ───────────────────────────
  {
    slug: 'wallet-1',
    name: 'Montblanc Meisterstück Full-Grain Leather Bi-Fold Wallet',
    category: 'Men',
    brand: 'MONTBLANC',
    price: 95,
    originalPrice: 190,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 840,
    stockLeft: 12,
    totalStock: 50,
    image: '/wallets/black-bifold.jpg',
    images: ['/wallets/black-bifold.jpg'],
    sizes: ['Standard Bi-Fold (8 Card Slots)'],
    colors: ['#111111', '#1e272e'],
    description: 'Handcrafted from European full-grain cowhide leather with Montblanc palladium-coated emblem, 8 credit card slots, 2 banknotes compartments, and 2 additional pockets.',
    isBestSeller: true,
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'wallet-2',
    name: 'Bottega Veneta Intrecciato Woven Calfskin Long Zip Purse',
    category: 'Men',
    brand: 'BOTTEGA VENETA',
    price: 145,
    originalPrice: 290,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 620,
    stockLeft: 7,
    totalStock: 35,
    image: '/wallets/woven-long-purse.jpg',
    images: ['/wallets/woven-long-purse.jpg'],
    sizes: ['Full Length Zip-Around (19cm x 10cm)'],
    colors: ['#3d271d', '#1b140e', '#5a3d28'],
    description: 'Iconic Intrecciato hand-woven calfskin leather long wallet purse featuring 12 card slots, central zipped coin purse, multiple cash compartments, and smooth gold-tone zipper.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'wallet-3',
    name: 'Louis Vuitton Graphite Leather Trifold Coin & Bill Purse',
    category: 'Men',
    brand: 'LOUIS VUITTON CURATED',
    price: 125,
    originalPrice: 250,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 510,
    stockLeft: 9,
    totalStock: 40,
    image: '/wallets/graphite-trifold.jpg',
    images: ['/wallets/graphite-trifold.jpg'],
    sizes: ['Compact Trifold with Coin Snap'],
    colors: ['#2d3436', '#4a4a4a', '#1e272e'],
    description: 'Sophisticated textured graphite leather trifold wallet with dedicated snap-button coin purse pocket, ID window, 6 card slots, and full-length bills divider.',
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'wallet-4',
    name: 'Artisan Distressed Cognac Brown Leather Slim Billfold Purse',
    category: 'Men',
    brand: 'SAVILE ROW LEATHER',
    price: 75,
    originalPrice: 150,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 970,
    stockLeft: 15,
    totalStock: 60,
    image: '/wallets/vintage-brown.jpg',
    images: ['/wallets/vintage-brown.jpg'],
    sizes: ['Slim Minimalist Bi-Fold'],
    colors: ['#8b5a2b', '#a0522d', '#5c3317'],
    description: 'Vintage oiled pull-up leather wallet with heavy-duty contrast saddle stitching, RFID-blocking inner lining, and quick-access thumb slot for primary cards.',
    isBestSeller: true
  },
  {
    slug: 'wallet-5',
    name: 'Tom Ford Grained Leather Zip Wristlet Organizer Clutch Purse',
    category: 'Men',
    brand: 'TOM FORD LUXE',
    price: 135,
    originalPrice: 270,
    discount: '50% OFF',
    rating: 4.9,
    reviewsCount: 390,
    stockLeft: 5,
    totalStock: 25,
    image: '/wallets/grained-wristlet.jpg',
    images: ['/wallets/grained-wristlet.jpg'],
    sizes: ['Large Wristlet Clutch (24cm x 15cm)'],
    colors: ['#111111', '#2c3e50'],
    description: 'Premium pebbled full-grain leather document and cash clutch purse with detachable leather wristlet strap, heavy signature gold zip, and internal card organizers.',
    isTrending: true,
    isNewProduct: true
  },

  // ── 📱 5 MOBILES ──────────────────────────────────────────────────────────
  {
    slug: 'mobile-1',
    name: 'Apple iPhone 16 Pro Max 256GB Desert Titanium',
    category: 'Mobiles',
    brand: 'APPLE',
    price: 1199,
    originalPrice: 1399,
    discount: '14% OFF',
    rating: 4.9,
    reviewsCount: 3820,
    stockLeft: 8,
    totalStock: 40,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    colors: ['#c4a482', '#2f3640', '#f5f6fa'],
    description: 'Grade 5 Titanium body, A18 Pro Bionic processor, 48MP Fusion camera system with 5x optical zoom and Action button.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'mobile-2',
    name: 'Samsung Galaxy S25 Ultra 5G AI Flagship 512GB',
    category: 'Mobiles',
    brand: 'SAMSUNG',
    price: 1099,
    originalPrice: 1299,
    discount: '15% OFF',
    rating: 4.9,
    reviewsCount: 2940,
    stockLeft: 10,
    totalStock: 50,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['256GB', '512GB', '1TB'],
    colors: ['#2c3e50', '#95a5a6', '#bdc3c7'],
    description: '200MP AI Quad Camera, Snapdragon 8 Elite SoC, embedded S-Pen, and 6.8-inch Dynamic AMOLED 2X 120Hz display.',
    isTrending: true
  },
  {
    slug: 'mobile-3',
    name: 'Google Pixel 9 Pro Fold Tensor G4 AI Smartphone',
    category: 'Mobiles',
    brand: 'GOOGLE',
    price: 999,
    originalPrice: 1199,
    discount: '17% OFF',
    rating: 4.8,
    reviewsCount: 1450,
    stockLeft: 7,
    totalStock: 30,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['256GB', '512GB'],
    colors: ['#353b48', '#f5f6fa'],
    description: 'Next-generation 8-inch Super Actua Flex folding screen, Gemini Nano AI integration, and advanced computational photography.',
    isNewProduct: true
  },
  {
    slug: 'mobile-4',
    name: 'OnePlus 13 Pro 5G Hasselblad Camera Smartphone',
    category: 'Mobiles',
    brand: 'ONEPLUS',
    price: 749,
    originalPrice: 899,
    discount: '17% OFF',
    rating: 4.7,
    reviewsCount: 1890,
    stockLeft: 12,
    totalStock: 60,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['12GB+256GB', '16GB+512GB'],
    colors: ['#10ac84', '#222f3e'],
    description: '100W SuperVOOC flash charge, 6000mAh silicon battery, 2K 120Hz ProXDR display, and 50MP Sony LYT-808 primary sensor.',
    isBestSeller: true
  },
  {
    slug: 'mobile-5',
    name: 'Xiaomi 15 Ultra Leica Quad 50MP Camera Phone',
    category: 'Mobiles',
    brand: 'XIAOMI',
    price: 699,
    originalPrice: 849,
    discount: '18% OFF',
    rating: 4.8,
    reviewsCount: 1120,
    stockLeft: 14,
    totalStock: 50,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['16GB+512GB', '16GB+1TB'],
    colors: ['#2f3542', '#ffffff'],
    description: '1-inch Leica Summilux optical lens, 200MP periscope telephoto, 90W HyperCharge, and titanium frame construction.',
    isNewProduct: true
  },

  // ── 👖 5 TRACK PANTS (NIKE, ADIDAS, PUMA) ─────────────────────────────────
  {
    slug: 'trackpant-1',
    name: 'Nike Sportswear Tech Fleece Slim Fit Jogger Track Pants',
    category: 'Track Pants',
    brand: 'NIKE',
    price: 85,
    originalPrice: 130,
    discount: '35% OFF',
    rating: 4.9,
    reviewsCount: 2150,
    stockLeft: 18,
    totalStock: 80,
    image: '/trackpants/nike-tech.jpg',
    images: [
      '/trackpants/nike-tech.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#2d3436', '#636e72', '#0984e3'],
    description: 'Double-sided smooth spacer fabric for lightweight warmth, tailored slim fit, zippered pocket with iconic Nike detailing.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'trackpant-2',
    name: 'Adidas Originals Tiro 3-Stripes Classic Track Pants',
    category: 'Track Pants',
    brand: 'ADIDAS',
    price: 65,
    originalPrice: 95,
    discount: '32% OFF',
    rating: 4.9,
    reviewsCount: 1940,
    stockLeft: 15,
    totalStock: 75,
    image: '/trackpants/adidas-tiro.jpg',
    images: [
      '/trackpants/adidas-tiro.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1e272e', '#485460', '#3742fa'],
    description: 'Iconic 3-Stripes down the legs, moisture-wicking AEROREADY doubleknit fabric, and ankle zips for rapid transition.',
    isBestSeller: true
  },
  {
    slug: 'trackpant-3',
    name: 'Puma Iconic T7 Retro Athletic Track Pants',
    category: 'Track Pants',
    brand: 'PUMA',
    price: 58,
    originalPrice: 85,
    discount: '32% OFF',
    rating: 4.7,
    reviewsCount: 860,
    stockLeft: 12,
    totalStock: 50,
    image: '/trackpants/puma-t7.jpg',
    images: [
      '/trackpants/puma-t7.jpg'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['#ff3838', '#111111', '#17c0eb'],
    description: 'Heritage 7cm signature contrast side panel stripes, archival Puma cat logo, and premium French terry comfort.',
    isTrending: true
  },
  {
    slug: 'trackpant-4',
    name: 'Nike Dri-FIT Pro Tapered Running Track Pants',
    category: 'Track Pants',
    brand: 'NIKE',
    price: 72,
    originalPrice: 110,
    discount: '35% OFF',
    rating: 4.8,
    reviewsCount: 730,
    stockLeft: 14,
    totalStock: 60,
    image: '/trackpants/nike-drifit.jpg',
    images: [
      '/trackpants/nike-drifit.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#57606f', '#2f3542', '#a4b0be'],
    description: 'Sweat-wicking Dri-FIT stretch fabric designed for high-intensity training, articulated knees, and zippered side pockets.',
    isNewProduct: true
  },
  {
    slug: 'trackpant-5',
    name: 'Puma Motorsport BMW M Performance Track Pants',
    category: 'Track Pants',
    brand: 'PUMA',
    price: 78,
    originalPrice: 120,
    discount: '35% OFF',
    rating: 4.9,
    reviewsCount: 1120,
    stockLeft: 20,
    totalStock: 90,
    image: '/trackpants/puma-motorsport.jpg',
    images: [
      '/trackpants/puma-motorsport.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#2d3436', '#535c68', '#130f40'],
    description: 'Ergonomic cutlines with articulated knees, premium double-knit fleece, and motorsport-inspired racing graphics.',
    isNewProduct: true,
    isTrending: true
  },

  // ── 💻 5 LAPTOPS ──────────────────────────────────────────────────────────
  {
    slug: 'laptop-1',
    name: 'Apple MacBook Pro 16" M3 Max Liquid Retina XDR',
    category: 'Laptops',
    brand: 'APPLE',
    price: 2499,
    originalPrice: 2799,
    discount: '11% OFF',
    rating: 5.0,
    reviewsCount: 2890,
    stockLeft: 6,
    totalStock: 25,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['36GB / 1TB SSD', '48GB / 1TB SSD', '128GB / 2TB SSD'],
    colors: ['#2c3437', '#d1d8e0'],
    description: '16-core CPU, 40-core GPU Apple M3 Max, Extreme Dynamic Range 120Hz ProMotion screen, and up to 22 hours battery endurance.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'laptop-2',
    name: 'Dell XPS 16 OLED Core Ultra 9 RTX 4070 Laptop',
    category: 'Laptops',
    brand: 'DELL',
    price: 1999,
    originalPrice: 2399,
    discount: '17% OFF',
    rating: 4.8,
    reviewsCount: 1430,
    stockLeft: 8,
    totalStock: 35,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['32GB / 1TB SSD', '64GB / 2TB SSD'],
    colors: ['#747d8c', '#f1f2f6'],
    description: '4K+ InfinityEdge OLED touch panel, Intel Core Ultra 9 185H processor, NVIDIA GeForce RTX 4070 8GB GDDR6, and seamless glass touchpad.',
    isTrending: true
  },
  {
    slug: 'laptop-3',
    name: 'ASUS ROG Zephyrus G16 OLED 240Hz Gaming Laptop',
    category: 'Laptops',
    brand: 'ASUS',
    price: 1749,
    originalPrice: 2099,
    discount: '17% OFF',
    rating: 4.9,
    reviewsCount: 1780,
    stockLeft: 7,
    totalStock: 30,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['32GB / 1TB SSD', '32GB / 2TB SSD'],
    colors: ['#111111', '#f5f6fa'],
    description: 'Ultra-thin 1.49cm CNC aluminum chassis, ROG Nebula 2.5K 240Hz 0.2ms OLED display, RTX 4080 GPU, and Slash Lighting LED bar.',
    isBestSeller: true
  },
  {
    slug: 'laptop-4',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12 Ultrabook',
    category: 'Laptops',
    brand: 'LENOVO',
    price: 1599,
    originalPrice: 1899,
    discount: '16% OFF',
    rating: 4.8,
    reviewsCount: 920,
    stockLeft: 11,
    totalStock: 40,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['16GB / 512GB SSD', '32GB / 1TB SSD'],
    colors: ['#1e272e'],
    description: 'Aerospace carbon fiber body weighing only 1.09kg, MIL-SPEC 810H durability, Communications Bar with 8MP camera, and TrackPoint red button.',
    isNewProduct: true
  },
  {
    slug: 'laptop-5',
    name: 'HP Spectre x360 2-in-1 Touch OLED Convertible Laptop',
    category: 'Laptops',
    brand: 'HP',
    price: 1399,
    originalPrice: 1699,
    discount: '18% OFF',
    rating: 4.7,
    reviewsCount: 840,
    stockLeft: 9,
    totalStock: 35,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['16GB / 1TB SSD', '32GB / 1TB SSD'],
    colors: ['#2f3542', '#00cec9'],
    description: '360-degree gem-cut hinge, 2.8K IMAX Enhanced OLED touchscreen with tilt stylus pen, 9MP AI intelligent camera, and quad speakers.',
    isNewProduct: true
  },

  // ── Existing Classic Catalog ─────────────────────────────────────────────
  {
    slug: 'prod-5',
    name: 'Floral Pleated Satin Maxi Dress',
    category: 'Women',
    brand: 'VERONA STUDIO',
    price: 79,
    originalPrice: 160,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 540,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#ff758c', '#845ec2', '#00c9a7'],
    description: 'Flowy satin maxi dress with feminine pleated detailing and adjustable tie shoulder straps.',
    isTrending: true,
    isNewProduct: true
  },
  {
    slug: 'prod-6',
    name: 'Slim-Fit Tailored Linen Blazer',
    category: 'Men',
    brand: 'SAVILE ROW',
    price: 135,
    originalPrice: 280,
    discount: '51% OFF',
    rating: 4.9,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['#d4c4b7', '#1e293b', '#475569'],
    description: 'Breathable European flax linen blazer crafted for modern smart-casual tailoring.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'prod-7',
    name: 'Apple Watch Series 9 GPS + Cellular 45mm',
    category: 'Watches',
    brand: 'APPLE',
    price: 249,
    originalPrice: 450,
    discount: '44% OFF',
    rating: 4.9,
    reviewsCount: 3100,
    image: '/watches/apple.jpg',
    images: ['/watches/apple.jpg'],
    colors: ['#111111', '#ff4757', '#2e86de'],
    description: 'Always-On Retina display, S9 SiP chip, Double Tap gesture, ECG and Blood Oxygen monitor.',
    isBestSeller: true,
    isTrending: true
  },
  {
    slug: 'prod-8',
    name: 'Botanical Hydration Glow Serum 50ml',
    category: 'Beauty',
    brand: 'LUMIÈRE BOTANICS',
    price: 38,
    originalPrice: 75,
    discount: '49% OFF',
    rating: 4.8,
    reviewsCount: 920,
    image: '/beauty/skincare-serum.jpg',
    images: ['/beauty/skincare-serum.jpg', '/beauty/face-cream.jpg'],
    colors: ['#eccc68'],
    description: 'Infused with Triple Hyaluronic Acid, Niacinamide, and Rosehip Seed Oil.',
    isNewProduct: true
  },
  {
    slug: 'prod-9',
    name: 'Designer Leather Crossbody Saddle Bag',
    category: 'Accessories',
    brand: 'MILANO LEATHER',
    price: 145,
    originalPrice: 310,
    discount: '53% OFF',
    rating: 4.9,
    reviewsCount: 760,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
    colors: ['#8b4513', '#111111', '#d2b48c'],
    description: 'Handcrafted full-grain Italian leather cross-body bag with gold-tone turnlock closure.',
    isBestSeller: true
  },
  {
    slug: 'prod-10',
    name: 'Minimalist Ergonomic Desk Lamp Touch Control',
    category: 'Home',
    brand: 'LUMEN LIVING',
    price: 52,
    originalPrice: 110,
    discount: '52% OFF',
    rating: 4.7,
    reviewsCount: 430,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop'],
    colors: ['#ffffff', '#2c3e50'],
    description: 'Dimmable eye-care LED lamp with wireless charging pad, 5 color temperature modes.',
    isNewProduct: true
  },
  {
    slug: 'prod-11',
    name: 'Chunky Platform Trail Runner Sneakers',
    category: 'Shoes',
    brand: 'SOLE STREET',
    price: 95,
    originalPrice: 190,
    discount: '50% OFF',
    rating: 4.8,
    reviewsCount: 1650,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['#ff4757', '#2f3542', '#70a1ff'],
    description: 'All-terrain vibram grip rubber sole, breathable mesh upper, and high-rebound foam midsole.',
    isTrending: true
  },
  {
    slug: 'prod-12',
    name: 'Cashmere Knit Oversized Sweater',
    category: 'Women',
    brand: 'VERONA STUDIO',
    price: 115,
    originalPrice: 240,
    discount: '52% OFF',
    rating: 4.9,
    reviewsCount: 880,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L'],
    colors: ['#f5f6fa', '#dcdde1', '#718093'],
    description: '100% Mongolian pure cashmere sweater, cloud-soft texture, ribbed cuffs.',
    isBestSeller: true
  }
];

const COUPONS = [
  { code: 'LUXE60', discountPercent: 60, description: 'Summer Luxe Festival — 60% OFF sitewide' },
  { code: 'FLASH50', discountPercent: 50, description: 'Flash Sale special — 50% OFF all flash deals' },
  { code: 'FASHION20', discountPercent: 20, description: 'Welcome & member coupon — 20% OFF for VIP members' }
];

const seed = async (skipConnect = false) => {
  const Product = require('../models/Product');
  const Coupon = require('../models/Coupon');
  const User = require('../models/User');

  let mem = null;
  if (!skipConnect) mem = await connectForSeed();

  await Product.deleteMany({});
  await Coupon.deleteMany({});
  console.log('🗑️  Cleared existing products & coupons');

  const products = await Product.insertMany(PRODUCTS);
  console.log(`✅ Seeded ${products.length} products`);

  const coupons = await Coupon.insertMany(COUPONS);
  console.log(`✅ Seeded ${coupons.length} coupons`);

  const adminExists = await User.findOne({ email: 'admin@urbanthread.com' });
  if (!adminExists) {
    await User.create({
      name: 'UrbanThread Admin',
      email: 'admin@urbanthread.com',
      password: 'admin123456',
      isAdmin: true,
      memberTier: 'Admin',
      rewardPoints: 9999
    });
    console.log('✅ Admin user created: admin@urbanthread.com / admin123456');
  }

  console.log('\n🎉 Database seeded successfully!\n');

  if (!skipConnect) {
    await mongoose.disconnect();
    if (mem) await mem.stop();
    process.exit(0);
  }
};

// Run directly
if (require.main === module) {
  seed();
}

module.exports = { seed };
