const { pool } = require('../utils/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      recentOrders,
      lowStockProducts,
      topProducts,
      ordersByStatus
    ] = await Promise.all([
      // Total orders
      pool.execute('SELECT COUNT(*) as total FROM orders'),
      
      // Total revenue
      pool.execute('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "paid"'),
      
      // Total users
      pool.execute('SELECT COUNT(*) as total FROM users WHERE role = "customer"'),
      
      // Total products
      pool.execute('SELECT COUNT(*) as total FROM products WHERE status = "active"'),
      
      // Recent orders (last 10)
      pool.execute(`
        SELECT o.*, u.first_name, u.last_name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
      `),
      
      // Low stock products (< 5 units)
      pool.execute(`
        SELECT id, name, stock_quantity, category
        FROM products 
        WHERE stock_quantity < 5 AND status = "active"
        ORDER BY stock_quantity ASC
      `),
      
      // Top selling products
      pool.execute(`
        SELECT p.id, p.name, p.category, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.unit_price) as revenue
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelled'
        GROUP BY p.id, p.name, p.category
        ORDER BY total_sold DESC
        LIMIT 5
      `),
      
      // Orders by status
      pool.execute(`
        SELECT status, COUNT(*) as count, SUM(total_amount) as total_amount
        FROM orders
        GROUP BY status
        ORDER BY count DESC
      `)
    ]);

    const stats = {
      overview: {
        totalOrders: totalOrders[0][0].total || 0,
        totalRevenue: totalRevenue[0][0].total || 0,
        totalUsers: totalUsers[0][0].total || 0,
        totalProducts: totalProducts[0][0].total || 0
      },
      recentOrders: recentOrders[0],
      lowStockProducts: lowStockProducts[0],
      topProducts: topProducts[0],
      ordersByStatus: ordersByStatus[0]
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    
    let query = `
      SELECT id, first_name, last_name, email, phone, role, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    // Search
    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [users] = await pool.execute(query, params);

    // Get total count
    const countQuery = query.split('ORDER BY')[0].replace('SELECT id, first_name, last_name, email, phone, role, created_at', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs'
    });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Rôle invalide'
      });
    }

    // Prevent admin from changing their own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas modifier votre propre rôle'
      });
    }

    const [result] = await pool.execute(
      'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Rôle utilisateur mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur updateUserRole:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du rôle utilisateur'
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    // Check if user has orders
    const [orders] = await pool.execute(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [id]
    );

    if (orders[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de supprimer un utilisateur avec des commandes'
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email,
             COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];

    // Filter by status
    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }

    // Search
    if (search) {
      query += ' AND (o.order_number LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [orders] = await pool.execute(query, params);

    // Get total count
    const countQuery = query.split('GROUP BY')[0].replace('SELECT o.*, u.first_name, u.last_name, u.email,', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erreur getAllOrders:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des commandes'
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide'
      });
    }

    const [result] = await pool.execute(`
      UPDATE orders 
      SET status = ?, tracking_number = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, tracking_number || null, notes || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut de commande mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur updateOrderStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut de commande'
    });
  }
};

// Get sales statistics (admin only)
const getSalesStats = async (req, res) => {
  try {
    const { period = 'month', start_date, end_date } = req.query;
    
    let dateFilter = '';
    let dateFormat = '';
    
    switch (period) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m';
    }

    if (start_date && end_date) {
      dateFilter = `AND o.created_at BETWEEN ? AND ?`;
    }

    const [salesData] = await pool.execute(`
      SELECT 
        DATE_FORMAT(o.created_at, '${dateFormat}') as period,
        COUNT(*) as orders_count,
        SUM(o.total_amount) as revenue,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      WHERE o.payment_status = 'paid' AND o.status != 'cancelled'
      ${dateFilter}
      GROUP BY DATE_FORMAT(o.created_at, '${dateFormat}')
      ORDER BY period DESC
      LIMIT 12
    `, start_date && end_date ? [start_date, end_date] : []);

    res.json({
      success: true,
      data: {
        sales: salesData[0],
        period,
        dateFormat
      }
    });

  } catch (error) {
    console.error('Erreur getSalesStats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques de ventes'
    });
  }
};

// Get top selling products (admin only)
const getTopProducts = async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;

    let dateFilter = '';
    if (period !== 'all') {
      dateFilter = `AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 ${period})`;
    }

    const [topProducts] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.category,
        p.price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.unit_price) as revenue,
        COUNT(DISTINCT o.id) as orders_count
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' ${dateFilter}
      GROUP BY p.id, p.name, p.category, p.price
      ORDER BY total_sold DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({
      success: true,
      data: {
        products: topProducts[0],
        period,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur getTopProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des meilleurs produits'
    });
  }
};

// Get inventory alerts (admin only)
const getInventoryAlerts = async (req, res) => {
  try {
    const [alerts] = await pool.execute(`
      SELECT 
        id,
        name,
        category,
        stock_quantity,
        price,
        status,
        CASE 
          WHEN stock_quantity = 0 THEN 'out_of_stock'
          WHEN stock_quantity < 5 THEN 'low_stock'
          ELSE 'in_stock'
        END as alert_level
      FROM products
      WHERE status = 'active' AND stock_quantity < 10
      ORDER BY stock_quantity ASC
    `);

    res.json({
      success: true,
      data: {
        alerts: alerts[0],
        total: alerts[0].length,
        summary: {
          out_of_stock: alerts[0].filter(p => p.stock_quantity === 0).length,
          low_stock: alerts[0].filter(p => p.stock_quantity > 0 && p.stock_quantity < 5).length,
          warning_stock: alerts[0].filter(p => p.stock_quantity >= 5 && p.stock_quantity < 10).length
        }
      }
    });

  } catch (error) {
    console.error('Erreur getInventoryAlerts:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des alertes de stock'
    });
  }
};

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user's order statistics
    const [orderStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as avg_order_value,
        MIN(o.created_at) as first_order,
        MAX(o.created_at) as last_order,
        COUNT(CASE WHEN o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as orders_last_30_days
      FROM orders o
      WHERE o.user_id = ? AND o.status != 'cancelled'
    `, [id]);

    // Get user's most purchased products
    const [topProducts] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.unit_price) as total_spent
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? AND o.status != 'cancelled'
      GROUP BY p.id, p.name, p.category
      ORDER BY total_quantity DESC
      LIMIT 5
    `, [id]);

    // Get user's addresses
    const [addresses] = await pool.execute(`
      SELECT 
        id,
        type,
        first_name,
        last_name,
        company,
        address_line1,
        address_line2,
        city,
        postal_code,
        country,
        phone,
        is_default
      FROM shipping_addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        user_id: parseInt(id),
        order_stats: orderStats[0] || {
          total_orders: 0,
          total_spent: 0,
          avg_order_value: 0,
          first_order: null,
          last_order: null,
          orders_last_30_days: 0
        },
        top_products: topProducts[0],
        addresses: addresses[0]
      }
    });

  } catch (error) {
    console.error('Erreur getUserStats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques utilisateur'
    });
  }
};

// Ban or unban user (admin only)
const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { banned, reason } = req.body;

    if (typeof banned !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre banned doit être un booléen'
      });
    }

    // Prevent admin from banning themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas bannir votre propre compte'
      });
    }

    const [result] = await pool.execute(`
      UPDATE users 
      SET banned = ?, ban_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [banned, reason || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: banned ? 'Utilisateur banni avec succès' : 'Utilisateur réactivé avec succès',
      data: {
        user_id: parseInt(id),
        banned,
        reason
      }
    });

  } catch (error) {
    console.error('Erreur banUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la modification du statut de l\'utilisateur'
    });
  }
};

module.exports = {
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
};
