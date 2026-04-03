const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database utils
const { initializeDatabase } = require('./utils/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

// Configuration
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://inovamakers.io', 
    'https://www.inovamakers.io',
    'https://api.inovamakers.io'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre de 15 minutes
  message: {
    success: false,
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static('src/uploads'));

// Health check route (before authentication)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Welcome route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API INOVA Makers',
    data: {
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        admin: '/api/admin',
        products: '/api/products',
        cart: '/api/cart',
        orders: '/api/orders',
        upload: '/api/upload',
        health: '/api/health'
      },
      documentation: 'https://api.inovamakers.io/docs'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'Endpoint non trouvé',
      code: 'NOT_FOUND',
      path: req.path
    });
  }
  next();
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Erreur de validation',
      details: error.message
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé',
      code: 'UNAUTHORIZED'
    });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'Fichier trop volumineux',
      code: 'FILE_TOO_LARGE'
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : error.message,
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Signal ${signal} reçu, arrêt en cours...`);
  
  // Close database connections
  const { pool } = require('./utils/database');
  if (pool) {
    pool.end(() => {
      console.log('✅ Connexions base de données fermées');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rejet non géré à:', promise, 'raison:', reason);
  gracefulShutdown('unhandledRejection');
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log('🚀 Serveur INOVA Makers API démarré avec succès!');
      console.log(`📡 API disponible: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Base de données: ${process.env.DB_NAME || 'inovamakers'}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 Documentation: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Middleware admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};

// Validation schemas
const schemas = {
  register: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[0-9\s-()]{10,20}$/).optional(),
    password: Joi.string().min(8).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  product: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    currency: Joi.string().default('FCFA'),
    category: Joi.string().required(),
    stock_quantity: Joi.number().integer().min(0).default(0),
    badge: Joi.string().optional(),
    specifications: Joi.object().optional()
  })
};

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  try {
    const { error, value } = schemas.register.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { first_name, last_name, email, phone, password } = value;

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const [result] = await pool.execute(
      'INSERT INTO users (first_name, last_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, hashedPassword, 'customer']
    );

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: {
        id: result[0].insertId,
        first_name,
        last_name,
        email,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { error, value } = schemas.login.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Rechercher l'utilisateur
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes produits
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, sort = 'created_at', order = 'desc' } = req.query;
    
    let query = 'SELECT * FROM products WHERE status = "active"';
    const params = [];

    // Filtrage par catégorie
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    // Recherche
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Tri
    const validSorts = ['name', 'price', 'rating', 'created_at'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await pool.execute(query, params);

    // Compter le total pour pagination
    const countQuery = query.split('ORDER BY')[0].replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND status = "active"',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Erreur produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes panier
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [cartItems] = await pool.execute(`
      SELECT ci.*, p.name, p.price, p.currency, p.image_url, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.status = "active"
      ORDER BY ci.created_at DESC
    `, [userId]);

    res.json(cartItems);
  } catch (error) {
    console.error('Erreur panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!product_id || quantity < 1) {
      return res.status(400).json({ error: 'Produit et quantité valides requis' });
    }

    // Vérifier si le produit existe et est en stock
    const [products] = await pool.execute(
      'SELECT id, name, stock_quantity FROM products WHERE id = ? AND status = "active"',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const product = products[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }

    // Ajouter ou mettre à jour le panier
    await pool.execute(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
    `, [userId, product_id, quantity]);

    res.json({ message: 'Produit ajouté au panier' });
  } catch (error) {
    console.error('Erreur ajout panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/cart/update', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.id;

    if (!product_id || quantity < 0) {
      return res.status(400).json({ error: 'Produit et quantité valides requis' });
    }

    if (quantity === 0) {
      // Supprimer l'article du panier
      await pool.execute(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      );
      return res.json({ message: 'Article supprimé du panier' });
    }

    // Vérifier le stock
    const [products] = await pool.execute(
      'SELECT stock_quantity FROM products WHERE id = ? AND status = "active"',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    if (products[0].stock_quantity < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }

    // Mettre à jour la quantité
    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, product_id]
    );

    res.json({ message: 'Quantité mise à jour' });
  } catch (error) {
    console.error('Erreur mise à jour panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/cart/:product_id', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.params;
    const userId = req.user.id;

    await pool.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    res.json({ message: 'Article supprimé du panier' });
  } catch (error) {
    console.error('Erreur suppression panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes commandes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const {
      shipping_address,
      payment_method,
      items
    } = req.body;
    const userId = req.user.id;

    if (!shipping_address || !payment_method || !items || items.length === 0) {
      return res.status(400).json({ error: 'Adresse de livraison, méthode de paiement et articles requis' });
    }

    // Vérifier les stocks et calculer le total
    let total_amount = 0;
    for (const item of items) {
      const [products] = await pool.execute(
        'SELECT price, stock_quantity FROM products WHERE id = ? AND status = "active"',
        [item.product_id]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: `Produit ${item.product_id} non trouvé` });
      }

      const product = products[0];
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Stock insuffisant pour le produit ${item.product_id}` });
      }

      total_amount += product.price * item.quantity;
    }

    // Créer la commande
    const [orderResult] = await pool.execute(`
      INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, payment_method)
      VALUES (?, ?, 0, 'pending', ?, ?)
    `, [
      userId,
      `CMD-${Date.now()}`,
      JSON.stringify(shipping_address),
      payment_method
    ]);

    const orderId = orderResult[0].insertId;

    // Ajouter les articles de commande et mettre à jour les stocks
    for (const item of items) {
      // Ajouter l'article à la commande
      await pool.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.unit_price]);

      // Mettre à jour le stock
      await pool.execute(`
        UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
      `, [item.quantity, item.product_id]);
    }

    // Mettre à jour le total de la commande
    await pool.execute(
      'UPDATE orders SET total_amount = ? WHERE id = ?',
      [total_amount, orderId]
    );

    // Vider le panier
    await pool.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    res.json({
      message: 'Commande créée avec succès',
      order: {
        id: orderId,
        order_number: `CMD-${Date.now()}`,
        total_amount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Erreur commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.execute(`
      SELECT o.*, COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(orders);
  } catch (error) {
    console.error('Erreur commandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const order = orders[0];

    // Récupérer les articles de la commande
    const [orderItems] = await pool.execute(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    res.json({
      ...order,
      items: orderItems
    });
  } catch (error) {
    console.error('Erreur commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur middleware:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur INOVA Makers démarré sur le port ${PORT}`);
  console.log(`📡 API disponible: http://localhost:${PORT}/api`);
  console.log(`🗄️  Base de données: ${dbConfig.database}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
