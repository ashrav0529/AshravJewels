const { connectDB, getModels, isUsingMongoDB } = require('../db');

const sampleProducts = [
  // ==========================================
  // RINGS
  // ==========================================
  {
    name: "The Aurelia Diamond Ring",
    description: "A magnificent brilliant-cut solitaire diamond set in a solid 18K white gold band. A timeless statement of commitment, purity, and refined elegance, handcrafted to reflect absolute brilliance from every angle.",
    price: 12500,
    category: "Rings",
    stock: 5,
    image: "images/cat_rings.jpg",
    specifications: {
      metal: "18K White Gold",
      stone: "1.5ct Round Brilliant Diamond",
      purity: "VVS1 Clarity, F Color",
      weight: "3.2 grams"
    }
  },
  {
    name: "Empress Emerald Band",
    description: "A vintage-inspired yellow gold band set with alternating round-cut diamonds and natural Colombian emeralds. Masterfully crafted for an exquisite blend of rich green color and glittering diamond shine.",
    price: 8900,
    category: "Rings",
    stock: 8,
    image: "images/cat_rings.jpg",
    specifications: {
      metal: "18K Yellow Gold",
      stone: "0.8ct Natural Emeralds & 0.4ct Diamonds",
      purity: "Solid 18K Gold, Eye-Clean Gemstones",
      weight: "4.1 grams"
    }
  },
  // ==========================================
  // NECKLACES
  // ==========================================
  {
    name: "Royal Sapphire Pendant",
    description: "A royal-cut deep blue sapphire pendant surrounded by a sparkling micro-pave diamond halo, suspended from an 18K yellow gold chain. An atelier masterpiece capturing the essence of royal heritage.",
    price: 15800,
    category: "Necklaces",
    stock: 3,
    image: "images/cat_necklaces.jpg",
    specifications: {
      metal: "18K Yellow Gold",
      stone: "2.2ct Royal Blue Sapphire",
      purity: "Solid Gold Setting, AAA Sapphire",
      weight: "6.5 grams"
    }
  },
  {
    name: "Celestial Gold Choker",
    description: "A contemporary solid 18K yellow gold choker embellished with delicate diamond droplet charms. Designed to drape elegantly and catch light beautifully with every movement.",
    price: 6400,
    category: "Necklaces",
    stock: 10,
    image: "images/cat_necklaces.jpg",
    specifications: {
      metal: "18K Yellow Gold",
      stone: "0.5ct Brilliant Pavé Diamonds",
      purity: "Solid 18K Gold",
      weight: "8.2 grams"
    }
  },
  // ==========================================
  // EARRINGS
  // ==========================================
  {
    name: "Atelier Emerald Drops",
    description: "Exquisite tear-shaped natural Colombian emeralds suspended from diamond-encrusted gold studs. The ultimate statement of luxury, perfect for red carpet events and high gala nights.",
    price: 18200,
    category: "Earrings",
    stock: 2,
    image: "images/cat_earrings.jpg",
    specifications: {
      metal: "18K Yellow Gold",
      stone: "3.5ct Total Colombian Emeralds",
      purity: "VS1 Clarity, Vivid Green",
      weight: "5.4 grams"
    }
  },
  {
    name: "Brilliant Diamond Studs",
    description: "Classic four-prong solitaire diamond studs mounted in solid platinum. An essential, sophisticated staple of any fine jewelry collection, offering unmatched daily radiance.",
    price: 9500,
    category: "Earrings",
    stock: 15,
    image: "images/cat_earrings.jpg",
    specifications: {
      metal: "Platinum 950",
      stone: "1.0ct Total Solitaire Diamonds (0.5ct each)",
      purity: "VVS2 Clarity, G Color",
      weight: "2.8 grams"
    }
  },
  // ==========================================
  // BRACELETS
  // ==========================================
  {
    name: "The Sovereign Tennis Bracelet",
    description: "A continuous loop of brilliant-cut diamonds and rich red rubies set in a solid 18K yellow gold channel setting. Captivating, fluid, and representing the height of luxury craftsmanship.",
    price: 24500,
    category: "Bracelets",
    stock: 2,
    image: "images/cat_bracelets.jpg",
    specifications: {
      metal: "18K Yellow Gold",
      stone: "4.2ct Diamonds & 3.0ct Natural Rubies",
      purity: "Solid 18K Gold Setting",
      weight: "14.5 grams"
    }
  },
  {
    name: "Aura Rose Gold Bangle",
    description: "A sleek, contemporary brushed rose gold bangle featuring an elegant diamond-pavé interlocking clasp. Embodying minimalist luxury, perfect for layering or wearing as a standalone signature piece.",
    price: 7200,
    category: "Bracelets",
    stock: 6,
    image: "images/cat_bracelets.jpg",
    specifications: {
      metal: "18K Rose Gold",
      stone: "0.6ct Pavé Diamonds",
      purity: "Solid 18K Rose Gold",
      weight: "9.8 grams"
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Starting Database Seeding Process...');
    
    // Connect to database (MongoDB or Fallback)
    await connectDB();
    
    const { Product } = getModels();
    
    // 1. Clean existing products
    console.log('Purging existing product inventory...');
    await Product.deleteMany({});
    
    // 2. Insert new products
    console.log(`Inserting ${sampleProducts.length} luxury jewelry items into database...`);
    const seeded = await Product.insertMany(sampleProducts);
    
    console.log('===============================================================');
    console.log('  SEEDING COMPLETED SUCCESSFULLY');
    console.log(`  Target: ${isUsingMongoDB() ? 'MongoDB Database Server' : 'Local JSON File Database'}`);
    console.log(`  Seeded: ${seeded.length} items successfully loaded.`);
    console.log('===============================================================');
    
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL ERROR during database seeding:', err.message);
    process.exit(1);
  }
}

seedDatabase();
