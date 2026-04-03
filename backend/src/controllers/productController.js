const { pool } = require('../utils/database');

// Validation schemas
const validateProduct = (data, isUpdate = false) => {
  const errors = [];
  
  // Name validation
  if (!isUpdate && !data.name) {
    errors.push({ field: 'name', error: 'Le nom du produit est requis' });
  } else if (data.name && (data.name.length < 3 || data.name.length > 255)) {
    errors.push({ field: 'name', error: 'Le nom doit contenir entre 3 et 255 caractères' });
  }

  // Description validation
  if (!isUpdate && !data.description) {
    errors.push({ field: 'description', error: 'La description est requise' });
  } else if (data.description && data.description.length < 10) {
    errors.push({ field: 'description', error: 'La description doit contenir au moins 10 caractères' });
  }

  // Price validation
  if (!isUpdate && data.price === undefined) {
    errors.push({ field: 'price', error: 'Le prix est requis' });
  } else if (data.price !== undefined && (isNaN(data.price) || data.price <= 0)) {
    errors.push({ field: 'price', error: 'Le prix doit être un nombre positif' });
  }

  // Category validation
  if (!isUpdate && !data.category) {
    errors.push({ field: 'category', error: 'La catégorie est requise' });
  } else if (data.category && !['led', 'clocks', 'solar', 'domotics', 'iot'].includes(data.category)) {
    errors.push({ field: 'category', error: 'Catégorie invalide' });
  }

  // Stock validation
  if (data.stock_quantity !== undefined && (isNaN(data.stock_quantity) || data.stock_quantity < 0)) {
    errors.push({ field: 'stock_quantity', error: 'La quantité en stock doit être un nombre positif' });
  }

  // Badge validation
  if (data.badge && !['Populaire', 'Premium', 'Meilleure vente', 'Nouveau', 'Pro', null].includes(data.badge)) {
    errors.push({ field: 'badge', error: 'Badge invalide' });
  }

  return errors;
};

// Get all products (public + admin filters)
const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      sort = 'created_at', 
      order = 'desc',
      status,
      min_price,
      max_price
    } = req.query;

    let query = 'SELECT * FROM products';
    const params = [];
    const whereConditions = [];

    // Build WHERE conditions
    if (req.user?.role === 'admin') {
      // Admin can see all products, optionally filter by status
      if (status && status !== 'all') {
        whereConditions.push('status = ?');
        params.push(status);
      }
    } else {
      // Public users only see active products
      whereConditions.push('status = "active"');
    }

    // Category filter
    if (category && category !== 'all') {
      whereConditions.push('category = ?');
      params.push(category);
    }

    // Search filter
    if (search) {
      whereConditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Price range filter
    if (min_price && !isNaN(min_price)) {
      whereConditions.push('price >= ?');
      params.push(parseFloat(min_price));
    }
    if (max_price && !isNaN(max_price)) {
      whereConditions.push('price <= ?');
      params.push(parseFloat(max_price));
    }

    // Add WHERE clause if conditions exist
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Sorting
    const validSorts = ['name', 'price', 'rating', 'created_at', 'stock_quantity'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await pool.execute(query, params);

    // Count total for pagination
    const countQuery = query.split('ORDER BY')[0].replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        filters: {
          category,
          search,
          sort,
          order,
          status,
          min_price,
          max_price
        }
      }
    });

  } catch (error) {
    console.error('Erreur getProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des produits'
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = 'SELECT * FROM products WHERE id = ?';
    const params = [id];

    // Non-admin users can only see active products
    if (req.user?.role !== 'admin') {
      query += ' AND status = "active"';
    }

    const [products] = await pool.execute(query, params);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        product: products[0]
      }
    });

  } catch (error) {
    console.error('Erreur getProductById:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du produit'
    });
  }
};

// Create new product (admin only)
const createProduct = async (req, res) => {
  try {
    // Validate input
    const errors = validateProduct(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Erreur de validation',
        details: errors
      });
    }

    const {
      name,
      description,
      price,
      currency = 'FCFA',
      category,
      stock_quantity = 0,
      badge,
      image_url,
      specifications
    } = req.body;

    // Check if product with same name already exists
    const [existingProduct] = await pool.execute(
      'SELECT id FROM products WHERE name = ?',
      [name]
    );

    if (existingProduct.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Un produit avec ce nom existe déjà'
      });
    }

    // Create product
    const [result] = await pool.execute(`
      INSERT INTO products (
        name, description, price, currency, category, 
        stock_quantity, badge, image_url, specifications, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, [
      name,
      description,
      parseFloat(price),
      currency,
      category,
      parseInt(stock_quantity),
      badge || null,
      image_url || null,
      specifications ? JSON.stringify(specifications) : null
    ]);

    // Get created product
    const [newProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [result[0].insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: {
        product: newProduct[0]
      }
    });

  } catch (error) {
    console.error('Erreur createProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du produit'
    });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    const errors = validateProduct(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Erreur de validation',
        details: errors
      });
    }

    // Check if product exists
    const [existingProduct] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    const {
      name,
      description,
      price,
      currency,
      category,
      stock_quantity,
      badge,
      image_url,
      specifications,
      status
    } = req.body;

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }
    if (currency !== undefined) {
      updateFields.push('currency = ?');
      updateValues.push(currency);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (stock_quantity !== undefined) {
      updateFields.push('stock_quantity = ?');
      updateValues.push(parseInt(stock_quantity));
    }
    if (badge !== undefined) {
      updateFields.push('badge = ?');
      updateValues.push(badge || null);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url || null);
    }
    if (specifications !== undefined) {
      updateFields.push('specifications = ?');
      updateValues.push(specifications ? JSON.stringify(specifications) : null);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    // Add updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    // Update product
    const [result] = await pool.execute(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé ou inchangé'
      });
    }

    // Get updated product
    const [updatedProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: {
        product: updatedProduct[0]
      }
    });

  } catch (error) {
    console.error('Erreur updateProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du produit'
    });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existingProduct] = await pool.execute(
      'SELECT id, name FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    // Check if product is in any active orders
    const [orderItems] = await pool.execute(`
      SELECT COUNT(*) as count FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = ? AND o.status != 'cancelled'
    `, [id]);

    if (orderItems[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de supprimer un produit présent dans des commandes actives'
      });
    }

    // Soft delete (set status to inactive) instead of hard delete
    const [result] = await pool.execute(
      'UPDATE products SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit supprimé avec succès (marqué comme inactif)'
    });

  } catch (error) {
    console.error('Erreur deleteProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du produit'
    });
  }
};

// Get product statistics (admin only)
const getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      outOfStockProducts,
      productsByCategory,
      topRatedProducts,
      recentlyAdded
    ] = await Promise.all([
      // Total products
      pool.execute('SELECT COUNT(*) as total FROM products'),
      
      // Active products
      pool.execute('SELECT COUNT(*) as total FROM products WHERE status = "active"'),
      
      // Inactive products
      pool.execute('SELECT COUNT(*) as total FROM products WHERE status = "inactive"'),
      
      // Low stock products (< 5)
      pool.execute('SELECT COUNT(*) as total FROM products WHERE stock_quantity > 0 AND stock_quantity < 5 AND status = "active"'),
      
      // Out of stock products
      pool.execute('SELECT COUNT(*) as total FROM products WHERE stock_quantity = 0 AND status = "active"'),
      
      // Products by category
      pool.execute(`
        SELECT category, COUNT(*) as count, AVG(price) as avg_price
        FROM products 
        WHERE status = "active"
        GROUP BY category
        ORDER BY count DESC
      `),
      
      // Top rated products
      pool.execute(`
        SELECT id, name, category, rating, reviews_count
        FROM products 
        WHERE status = "active" AND rating > 0
        ORDER BY rating DESC, reviews_count DESC
        LIMIT 5
      `),
      
      // Recently added products
      pool.execute(`
        SELECT id, name, category, created_at
        FROM products 
        WHERE status = "active"
        ORDER BY created_at DESC
        LIMIT 5
      `)
    ]);

    const stats = {
      overview: {
        total: totalProducts[0][0].total || 0,
        active: activeProducts[0][0].total || 0,
        inactive: inactiveProducts[0][0].total || 0,
        lowStock: lowStockProducts[0][0].total || 0,
        outOfStock: outOfStockProducts[0][0].total || 0
      },
      byCategory: productsByCategory[0],
      topRated: topRatedProducts[0],
      recentlyAdded: recentlyAdded[0]
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur getProductStats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques produits'
    });
  }
};

// Update product stock (admin only)
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity, operation = 'set' } = req.body;

    if (stock_quantity === undefined || isNaN(stock_quantity) || stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantité en stock invalide'
      });
    }

    // Check if product exists
    const [existingProduct] = await pool.execute(
      'SELECT id, stock_quantity FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    let newStock;
    if (operation === 'add') {
      newStock = existingProduct[0].stock_quantity + parseInt(stock_quantity);
    } else if (operation === 'subtract') {
      newStock = Math.max(0, existingProduct[0].stock_quantity - parseInt(stock_quantity));
    } else {
      newStock = parseInt(stock_quantity);
    }

    // Update stock
    const [result] = await pool.execute(
      'UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Stock mis à jour avec succès',
      data: {
        previous_stock: existingProduct[0].stock_quantity,
        new_stock: newStock,
        operation
      }
    });

  } catch (error) {
    console.error('Erreur updateProductStock:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du stock'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  updateProductStock
};
