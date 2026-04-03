const express = require('express');
const router = express.Router();

// Import controllers
const { getFileInfo, deleteFile } = require('../controllers/uploadController');

// Import middleware
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadProductImage, uploadProductImages } = require('../middleware/upload');

// Serve uploaded files statically
router.use('/uploads', express.static('src/uploads'));

// Upload single product image (admin only)
router.post('/product-image', 
  authenticateToken, 
  requireAdmin, 
  uploadProductImage, 
  getFileInfo
);

// Upload multiple product images (admin only)
router.post('/product-images', 
  authenticateToken, 
  requireAdmin, 
  uploadProductImages, 
  getFileInfo
);

// Delete uploaded file (admin only)
router.delete('/file/:filename', 
  authenticateToken, 
  requireAdmin, 
  deleteFile
);

module.exports = router;
