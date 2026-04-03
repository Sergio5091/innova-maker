const express = require('express');
const router = express.Router();

// Import controllers
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
  getTopProducts,
  getInventoryAlerts,
  getUserStats,
  banUser
} = require('../controllers/adminController');

// Import order controller for admin routes
const {
  getOrderById,
  processRefund,
  createCategory,
  createCoupon,
  getCoupons
} = require('../controllers/orderController');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
} = require('../controllers/productController');

// Import middleware
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// ============ TABLEAU DE BORD ET STATISTIQUES ============
router.get('/dashboard/stats', getDashboardStats);
router.get('/stats/sales', getSalesStats);
router.get('/stats/top-products', getTopProducts);
router.get('/stats/inventory-alerts', getInventoryAlerts);

// ============ GESTION DES PRODUITS (/api/admin/products) ============
router.get('/products', getProducts);                    // GET / : Liste tous les produits
router.post('/products', createProduct);                 // POST / : Ajouter un nouveau produit
router.get('/products/:id', getProductById);             // GET /{id} : Détails d'un produit spécifique
router.put('/products/:id', updateProduct);              // PUT /{id} : Modifier les informations d'un produit
router.patch('/products/:id/stock', updateProductStock); // PATCH /{id}/stock : Mise à jour rapide du stock
router.delete('/products/:id', deleteProduct);           // DELETE /{id} : Supprimer ou désactiver un produit

// ============ GESTION DES COMMANDES (/api/admin/orders) ============
router.get('/orders', getAllOrders);                     // GET / : Liste des commandes
router.get('/orders/:id', getOrderById);                 // GET /{id} : Détails complets d'une commande
router.patch('/orders/:id/status', updateOrderStatus);   // PATCH /{id}/status : Changer le statut de la commande
router.post('/orders/:id/refund', processRefund);       // POST /{id}/refund : Effectuer un remboursement

// ============ GESTION DES CLIENTS (/api/admin/users) ============
router.get('/users', getAllUsers);                       // GET / : Liste des comptes clients
router.get('/users/:id', getAllUsers);                   // GET /{id} : Profil détaillé d'un client
router.patch('/users/:id/ban', banUser);                 // PATCH /{id}/ban : Suspendre ou réactiver un compte
router.get('/users/:id/stats', getUserStats);            // GET /{id}/stats : Statistiques d'achat par client
router.put('/users/:id/role', updateUserRole);           // PUT /{id}/role : Modifier le rôle d'un utilisateur
router.delete('/users/:id', deleteUser);                // DELETE /{id} : Supprimer un utilisateur

// ============ CATÉGORIES ET PROMOTIONS ============
router.post('/categories', createCategory);               // POST /api/admin/categories
router.post('/coupons', createCoupon);                    // POST /api/admin/coupons  
router.get('/coupons', getCoupons);                       // GET /api/admin/coupons

module.exports = router;
