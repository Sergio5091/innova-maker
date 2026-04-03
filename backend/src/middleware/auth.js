const jwt = require('jsonwebtoken');
const { pool } = require('../utils/database');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification requis',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure it still exists
    const [users] = await pool.execute(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Attach user to request
    req.user = users[0];
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token invalide',
        code: 'TOKEN_INVALID'
      });
    }

    console.error('Erreur authentification:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'authentification',
      code: 'SERVER_ERROR'
    });
  }
};

// Admin role middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès administrateur requis',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

// Customer role middleware (optional - for customer-only routes)
const requireCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      error: 'Accès client requis',
      code: 'CUSTOMER_REQUIRED'
    });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [users] = await pool.execute(
        'SELECT id, email, role, first_name, last_name FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length > 0) {
        req.user = users[0];
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

// Check if user owns resource
const checkOwnership = (resourceField = 'user_id') => {
  return (req, res, next) => {
    // Admin can access all resources
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if resource belongs to user
    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (parseInt(resourceUserId) !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette ressource',
        code: 'ACCESS_DENIED'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCustomer,
  optionalAuth,
  checkOwnership
};
