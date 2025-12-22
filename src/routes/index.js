// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const reviewRoutes = require('./reviewRoutes');
const qnaRoutes = require('./qnaRoutes');
const uploadRoutes = require('./uploadRoutes');
const adminDashboardRoutes = require('./adminDashboardRoutes');
const shopRoutes = require('./shopRoutes');

router.use('/', require('./homeRoutes'));
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/qna', qnaRoutes);
router.use('/upload', uploadRoutes);
router.use('/users', require('./userRoutes'));
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/shop', shopRoutes);


module.exports = router;