const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

// Get all categories
router.get('/categories', shopController.getCategories)

// Get all brands
router.get('/brands', shopController.getBrands)

// Get filtered products
router.get('/products', shopController.getFilteredProducts)

module.exports = router
