// src/seeders/seed-data.js
const { sequelize, Category, Product, ProductImage, ProductAttribute, Review, QnA } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('⚠️  This will clear all existing data!');

    // Sync database (be careful - this drops tables!)
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // ==================== SEED CATEGORIES ====================
    console.log('\n📁 Seeding categories...');
    const categories = await Category.bulkCreate([
      { 
        name: 'Lips', 
        slug: 'lips', 
        description: 'Lipsticks, glosses, and lip care products for beautiful lips',
        imageUrl: '/categories/lips.jpg'
      },
      { 
        name: 'Face', 
        slug: 'face', 
        description: 'Foundations, concealers, and face makeup for a flawless look',
        imageUrl: '/categories/face.jpg'
      },
      { 
        name: 'Eyes', 
        slug: 'eyes', 
        description: 'Eye shadows, mascaras, and eye liners for stunning eyes',
        imageUrl: '/categories/eyes.jpg'
      },
      { 
        name: 'Skincare', 
        slug: 'skincare', 
        description: 'Serums, creams, and treatments for healthy skin',
        imageUrl: '/categories/skincare.jpg'
      },
      { 
        name: 'Haircare', 
        slug: 'haircare', 
        description: 'Shampoos, conditioners, and treatments for gorgeous hair',
        imageUrl: '/categories/haircare.jpg'
      },
      { 
        name: 'Bath & Body', 
        slug: 'bath-body', 
        description: 'Lotions, scrubs, and body care essentials',
        imageUrl: '/categories/bath-body.jpg'
      },
      { 
        name: 'Fragrances', 
        slug: 'fragrances', 
        description: 'Perfumes and body mists for every occasion',
        imageUrl: '/categories/fragrances.jpg'
      },
      { 
        name: 'Nails', 
        slug: 'nails', 
        description: 'Nail polish, treatments, and nail care products',
        imageUrl: '/categories/nails.jpg'
      }
    ]);
    console.log(`✅ ${categories.length} categories seeded`);

    // ==================== SEED PRODUCTS ====================
    console.log('\n📦 Seeding products...');
    const products = await Product.bulkCreate([
      // Skincare
      {
        name: 'Hydrating Face Serum',
        slug: 'hydrating-face-serum',
        description: 'Luxurious hydrating serum with hyaluronic acid and vitamin E for intense moisture and radiance. Perfect for all skin types.',
        price: 45.99,
        originalPrice: 59.99,
        sku: 'HFS-001',
        stock: 45,
        categoryId: categories[3].id,
        brand: 'Glow Beauty',
        ingredients: 'Hyaluronic Acid, Vitamin E, Aloe Vera, Glycerin',
        weight: '30ml',
        shelfLife: '24 months',
        salesCount: 128,
        rating: 4.5,
        reviewCount: 0,
        isActive: true
      },
      {
        name: 'Moisturizing Cream',
        slug: 'moisturizing-cream',
        description: 'Rich moisturizing cream that provides 24-hour hydration',
        price: 38.50,
        originalPrice: 45.00,
        sku: 'MC-001',
        stock: 67,
        categoryId: categories[3].id,
        brand: 'Pure Skincare',
        ingredients: 'Shea Butter, Vitamin C, Ceramides',
        weight: '50ml',
        shelfLife: '18 months',
        salesCount: 95,
        rating: 4.8,
        reviewCount: 0,
        isActive: true
      },
      // Lips
      {
        name: 'Lip Gloss Pro',
        slug: 'lip-gloss-pro',
        description: 'High-shine lip gloss with moisturizing formula for soft, glossy lips',
        price: 12.99,
        originalPrice: 16.99,
        sku: 'LG-PRO-001',
        stock: 145,
        categoryId: categories[0].id,
        brand: 'Sleek & Shine',
        ingredients: 'Glycerin, Jojoba Oil, Mica, Vitamin E',
        weight: '6g',
        color: 'Glossy Pink',
        shelfLife: '24 months',
        salesCount: 342,
        rating: 4.7,
        reviewCount: 0,
        isActive: true
      },
      {
        name: 'Lipstick Collection',
        slug: 'lipstick-collection',
        description: 'Long-lasting lipstick in vibrant shades',
        price: 25.99,
        originalPrice: 32.00,
        sku: 'LS-001',
        stock: 89,
        categoryId: categories[0].id,
        brand: 'Color Pop',
        ingredients: 'Beeswax, Shea Butter, Vitamin E',
        weight: '3.5g',
        color: 'Red Romance',
        shelfLife: '24 months',
        salesCount: 203,
        rating: 4.7,
        reviewCount: 0,
        isActive: true
      },
      // Face
      {
        name: 'Foundation Base',
        slug: 'foundation-base',
        description: 'Full coverage foundation for a flawless, natural finish',
        price: 24.99,
        originalPrice: 32.99,
        sku: 'FB-001',
        stock: 89,
        categoryId: categories[1].id,
        brand: 'Perfect Canvas',
        ingredients: 'Water, Dimethicone, Titanium Dioxide',
        weight: '30ml',
        color: 'Natural Beige',
        shelfLife: '18 months',
        salesCount: 298,
        rating: 4.6,
        reviewCount: 0,
        isActive: true
      },
      {
        name: 'Blush Pink Dream',
        slug: 'blush-pink-dream',
        description: 'Silky powder blush for a natural flush',
        price: 14.99,
        originalPrice: 19.99,
        sku: 'BPD-001',
        stock: 167,
        categoryId: categories[1].id,
        brand: 'Rosy Glow',
        ingredients: 'Talc, Mica, Mineral Oil',
        weight: '8g',
        color: 'Pink',
        shelfLife: '24 months',
        salesCount: 178,
        rating: 4.5,
        reviewCount: 0,
        isActive: true
      },
      // Eyes
      {
        name: 'Eye Shadow Palette',
        slug: 'eye-shadow-palette',
        description: '12 stunning shades for every occasion - matte and shimmer finishes',
        price: 18.99,
        originalPrice: 25.99,
        sku: 'ESP-001',
        stock: 234,
        categoryId: categories[2].id,
        brand: 'Color Magic',
        ingredients: 'Talc, Mica, Mineral Oil, Iron Oxides',
        weight: '120g',
        shelfLife: '24 months',
        salesCount: 256,
        rating: 4.8,
        reviewCount: 0,
        isActive: true
      },
      {
        name: 'Mascara Deluxe',
        slug: 'mascara-deluxe',
        description: 'Volumizing mascara for dramatic, full lashes',
        price: 15.99,
        originalPrice: 19.99,
        sku: 'MD-001',
        stock: 112,
        categoryId: categories[2].id,
        brand: 'Lash Beauty',
        ingredients: 'Water, Beeswax, Carnauba Wax',
        weight: '10ml',
        color: 'Deep Black',
        shelfLife: '6 months',
        salesCount: 189,
        rating: 4.4,
        reviewCount: 0,
        isActive: true
      },
      {
        name: 'Eyeliner Precision',
        slug: 'eyeliner-precision',
        description: 'Precise liquid eyeliner for perfect lines',
        price: 11.99,
        originalPrice: 14.99,
        sku: 'EP-001',
        stock: 203,
        categoryId: categories[2].id,
        brand: 'Line Perfect',
        ingredients: 'Water, Acrylates, Carbon Black',
        weight: '5ml',
        color: 'Black',
        shelfLife: '12 months',
        salesCount: 145,
        rating: 4.6,
        reviewCount: 0,
        isActive: true
      },
      // Haircare
      {
        name: 'Shampoo & Conditioner Set',
        slug: 'shampoo-conditioner-set',
        description: 'Nourishing shampoo and conditioner duo',
        price: 28.00,
        originalPrice: 35.00,
        sku: 'SCS-001',
        stock: 78,
        categoryId: categories[4].id,
        brand: 'Hair Heaven',
        ingredients: 'Coconut Oil, Argan Oil, Keratin',
        weight: '500ml x 2',
        shelfLife: '24 months',
        salesCount: 87,
        rating: 4.4,
        reviewCount: 0,
        isActive: true
      },
      {
        name: 'Hair Mask Treatment',
        slug: 'hair-mask-treatment',
        description: 'Deep conditioning mask for damaged hair',
        price: 35.00,
        originalPrice: 42.00,
        sku: 'HMT-001',
        stock: 56,
        categoryId: categories[4].id,
        brand: 'Repair & Restore',
        ingredients: 'Argan Oil, Keratin, Vitamin E',
        weight: '250ml',
        shelfLife: '18 months',
        salesCount: 112,
        rating: 4.9,
        reviewCount: 0,
        isActive: true
      },
      // Bath & Body
      {
        name: 'Body Lotion',
        slug: 'body-lotion',
        description: 'Moisturizing body lotion with shea butter',
        price: 22.99,
        originalPrice: 28.00,
        sku: 'BL-001',
        stock: 145,
        categoryId: categories[5].id,
        brand: 'Soft Touch',
        ingredients: 'Shea Butter, Vitamin E, Aloe Vera',
        weight: '400ml',
        shelfLife: '24 months',
        salesCount: 134,
        rating: 4.5,
        reviewCount: 0,
        isActive: true
      },
      // Fragrances
      {
        name: 'Perfume Spray',
        slug: 'perfume-spray',
        description: 'Elegant floral fragrance for all occasions',
        price: 55.00,
        originalPrice: 65.00,
        sku: 'PS-001',
        stock: 34,
        categoryId: categories[6].id,
        brand: 'Essence Luxe',
        ingredients: 'Alcohol, Fragrance, Water',
        weight: '50ml',
        shelfLife: '36 months',
        salesCount: 89,
        rating: 4.8,
        reviewCount: 0,
        isActive: true
      }
    ]);
    console.log(`✅ ${products.length} products seeded`);

    // ==================== SEED PRODUCT IMAGES ====================
    console.log('\n🖼️  Seeding product images...');
    const images = await ProductImage.bulkCreate([
      { productId: products[0].id, imageUrl: '/products/hydrating-serum-bottle.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[0].id, imageUrl: '/products/serum-texture.jpg', isPrimary: false, displayOrder: 1 },
      { productId: products[1].id, imageUrl: '/products/cream-jar.png', isPrimary: true, displayOrder: 0 },
      { productId: products[2].id, imageUrl: '/products/lip-gloss-product.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[3].id, imageUrl: '/products/lipstick-set.png', isPrimary: true, displayOrder: 0 },
      { productId: products[4].id, imageUrl: '/products/makeup-foundation.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[5].id, imageUrl: '/products/blush-compact.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[6].id, imageUrl: '/products/eyeshadow-palette.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[7].id, imageUrl: '/products/mascara-product.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[8].id, imageUrl: '/products/eyeliner-pen.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[9].id, imageUrl: '/products/shampoo-bottle.png', isPrimary: true, displayOrder: 0 },
      { productId: products[10].id, imageUrl: '/products/hair-treatment-mask.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[11].id, imageUrl: '/products/body-lotion-bottle.jpg', isPrimary: true, displayOrder: 0 },
      { productId: products[12].id, imageUrl: '/products/perfume-fragrance-bottle.jpg', isPrimary: true, displayOrder: 0 },
    ]);
    console.log(`✅ ${images.length} product images seeded`);

    // ==================== SEED PRODUCT ATTRIBUTES ====================
    console.log('\n🏷️  Seeding product attributes...');
    const attributes = await ProductAttribute.bulkCreate([
      { productId: products[0].id, attributeName: 'Size', attributeValue: '30ml' },
      { productId: products[0].id, attributeName: 'Type', attributeValue: 'Serum' },
      { productId: products[0].id, attributeName: 'Skin Type', attributeValue: 'All Skin Types' },
      { productId: products[1].id, attributeName: 'Size', attributeValue: '50ml' },
      { productId: products[1].id, attributeName: 'Type', attributeValue: 'Cream' },
      { productId: products[2].id, attributeName: 'Size', attributeValue: '10ml' },
      { productId: products[2].id, attributeName: 'Finish', attributeValue: 'Glossy' },
      { productId: products[3].id, attributeName: 'Size', attributeValue: '3.5g' },
      { productId: products[3].id, attributeName: 'Finish', attributeValue: 'Matte' },
      { productId: products[4].id, attributeName: 'Coverage', attributeValue: 'Full' },
      { productId: products[4].id, attributeName: 'Finish', attributeValue: 'Natural' },
      { productId: products[6].id, attributeName: 'Shades', attributeValue: '12 Colors' },
      { productId: products[6].id, attributeName: 'Finish', attributeValue: 'Matte & Shimmer' },
      { productId: products[7].id, attributeName: 'Effect', attributeValue: 'Volumizing' },
      { productId: products[7].id, attributeName: 'Formula', attributeValue: 'Waterproof' },
    ]);
    console.log(`✅ ${attributes.length} product attributes seeded`);

    // ==================== SEED REVIEWS ====================
    console.log('\n⭐ Seeding reviews...');
    const reviews = await Review.bulkCreate([
      {
        productId: products[0].id,
        reviewerName: 'Sarah Johnson',
        rating: 5,
        comment: 'Amazing product! My skin feels so hydrated and looks glowing. Will definitely repurchase!',
        isVerified: true
      },
      {
        productId: products[0].id,
        reviewerName: 'Emily Davis',
        rating: 4,
        comment: 'Great serum, but a bit pricey. Works well for my dry skin though.',
        isVerified: true
      },
      {
        productId: products[0].id,
        reviewerName: 'Jessica Martinez',
        rating: 5,
        comment: 'Best serum I have ever used! Absorbed quickly and no sticky residue.',
        isVerified: false
      },
      {
        productId: products[2].id,
        reviewerName: 'Maria Lopez',
        rating: 5,
        comment: 'Love this gloss! Best purchase ever. Perfect shine and not sticky at all.',
        isVerified: true
      },
      {
        productId: products[2].id,
        reviewerName: 'Jessica Park',
        rating: 4,
        comment: 'Great quality but wish it lasted longer. Need to reapply after eating.',
        isVerified: true
      },
      {
        productId: products[4].id,
        reviewerName: 'Amanda Chen',
        rating: 5,
        comment: 'Perfect match for my skin tone! Coverage is amazing and feels lightweight.',
        isVerified: true
      },
      {
        productId: products[6].id,
        reviewerName: 'Lisa Brown',
        rating: 5,
        comment: 'The colors are gorgeous! Great pigmentation and blends beautifully.',
        isVerified: true
      },
      {
        productId: products[6].id,
        reviewerName: 'Rachel Green',
        rating: 4,
        comment: 'Love the variety of shades. Some colors need building up but overall great palette.',
        isVerified: false
      },
    ]);
    console.log(`✅ ${reviews.length} reviews seeded`);

    // ==================== UPDATE PRODUCT RATINGS ====================
    console.log('\n📊 Updating product ratings...');
    for (const product of products) {
      const productReviews = await Review.findAll({ where: { productId: product.id } });
      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        await product.update({ 
          rating: parseFloat(avgRating.toFixed(2)), 
          reviewCount: productReviews.length 
        });
      }
    }
    console.log('✅ Product ratings updated');

    // ==================== SEED Q&A ====================
    console.log('\n❓ Seeding Q&A...');
    const qna = await QnA.bulkCreate([
      {
        productId: products[0].id,
        question: 'Is this suitable for sensitive skin?',
        answer: 'Yes, this serum is formulated for all skin types including sensitive skin. It contains gentle, non-irritating ingredients.',
        answeredAt: new Date()
      },
      {
        productId: products[0].id,
        question: 'Can I use this under makeup?',
        answer: 'Absolutely! Wait 2-3 minutes after application for it to absorb, then apply your makeup as usual.',
        answeredAt: new Date()
      },
      {
        productId: products[2].id,
        question: 'Is it waterproof?',
        answer: 'No, this lip gloss is water-resistant but not waterproof. It will fade after eating or drinking.',
        answeredAt: new Date()
      },
      {
        productId: products[2].id,
        question: 'Does it have SPF?',
        answer: 'No SPF protection, but it has moisturizing properties with vitamin E and jojoba oil.',
        answeredAt: new Date()
      },
      {
        productId: products[4].id,
        question: 'What shade should I choose for medium skin tone?',
        answer: 'Natural Beige works well for medium skin tones. We recommend trying a sample first for the perfect match.',
        answeredAt: new Date()
      },
      {
        productId: products[7].id,
        question: 'Does this mascara clump?',
        answer: 'No, the formula is designed to prevent clumping. Make sure to wipe off excess product before applying.',
        answeredAt: new Date()
      },
    ]);
    console.log(`✅ ${qna.length} Q&A entries seeded`);

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`
📊 SUMMARY:
   ✅ ${categories.length} categories
   ✅ ${products.length} products
   ✅ ${images.length} product images
   ✅ ${attributes.length} product attributes
   ✅ ${reviews.length} reviews
   ✅ ${qna.length} Q&A entries

🚀 Your database is ready to use!

📝 NEXT STEPS:
   1. Start the server: npm run dev
   2. Test the API: curl http://localhost:5000/health
   3. View products: curl http://localhost:5000/api/v1/products

💡 TIP: You can run this seeder again anytime with: npm run seed
⚠️  WARNING: This will clear all existing data!
    `);

  } catch (error) {
    console.error('\n❌ SEEDING FAILED:', error);
    console.error('\nError details:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;