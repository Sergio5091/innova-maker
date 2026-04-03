const { pool } = require('../utils/database');

// Validate order data
const validateOrder = (data) => {
  const errors = [];
  
  if (!data.shipping_address || typeof data.shipping_address !== 'object') {
    errors.push({ field: 'shipping_address', error: 'Adresse de livraison requise' });
  }
  
  if (!data.payment_method) {
    errors.push({ field: 'payment_method', error: 'Méthode de paiement requise' });
  }
  
  const validPaymentMethods = ['mobile_money', 'cash_on_delivery', 'bank_transfer'];
  if (data.payment_method && !validPaymentMethods.includes(data.payment_method)) {
    errors.push({ field: 'payment_method', error: 'Méthode de paiement invalide' });
  }
  
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push({ field: 'items', error: 'Articles de commande requis' });
  }
  
  return errors;
};

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping_address, payment_method, coupon_code, notes } = req.body;

    // Validate input
    const errors = validateOrder({ shipping_address, payment_method, items: 'dummy' });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Erreur de validation',
        details: errors
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get cart items with product details and stock check
      const [cartItems] = await connection.execute(`
        SELECT 
          ci.product_id,
          ci.quantity,
          p.name,
          p.price,
          p.stock_quantity,
          p.status
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ? AND p.status = 'active'
        FOR UPDATE
      `, [userId]);

      if (cartItems.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          error: 'Panier vide'
        });
      }

      // Check stock availability
      for (const item of cartItems) {
        if (item.stock_quantity < item.quantity) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: `Stock insuffisant pour ${item.name}. Seulement ${item.stock_quantity} disponibles`,
            product_id: item.product_id
          });
        }
      }

      // Calculate totals
      let subtotal = 0;
      for (const item of cartItems) {
        subtotal += item.price * item.quantity;
      }

      // Apply coupon if provided
      let discount_amount = 0;
      let coupon_details = null;
      
      if (coupon_code) {
        const [couponResult] = await connection.execute(`
          SELECT * FROM coupons 
          WHERE code = ? AND is_active = TRUE 
          AND (expires_at IS NULL OR expires_at > NOW())
          AND (usage_limit IS NULL OR used_count < usage_limit)
        `, [coupon_code.toUpperCase()]);

        if (couponResult.length > 0) {
          const coupon = couponResult[0];
          coupon_details = coupon;

          if (coupon.minimum_amount && subtotal < coupon.minimum_amount) {
            await connection.rollback();
            return res.status(400).json({
              success: false,
              error: `Montant minimum de ${coupon.minimum_amount} FCFA requis pour ce code promo`
            });
          }

          if (coupon.discount_type === 'percentage') {
            discount_amount = subtotal * (coupon.discount_value / 100);
          } else {
            discount_amount = coupon.discount_value;
          }

          discount_amount = Math.min(discount_amount, subtotal);
        } else {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: 'Code promo invalide ou expiré'
          });
        }
      }

      const total_amount = subtotal - discount_amount;

      // Generate order number
      const order_number = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create order
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (
          user_id, order_number, total_amount, status, 
          shipping_address, payment_method, payment_status,
          coupon_code, discount_amount, notes
        ) VALUES (?, ?, ?, 'pending', ?, ?, 'pending', ?, ?, ?)
      `, [
        userId,
        order_number,
        total_amount,
        JSON.stringify(shipping_address),
        payment_method,
        coupon_code?.toUpperCase() || null,
        discount_amount,
        notes || null
      ]);

      const orderId = orderResult[0].insertId;

      // Create order items and update stock
      for (const item of cartItems) {
        // Add order item
        await connection.execute(`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_snapshot)
          VALUES (?, ?, ?, ?, ?)
        `, [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          JSON.stringify({
            name: item.name,
            price: item.price
          })
        ]);

        // Update product stock
        await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Update coupon usage if used
      if (coupon_details) {
        await connection.execute(
          'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
          [coupon_details.id]
        );
      }

      // Clear cart
      await connection.execute(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId]
      );

      await connection.commit();

      // Get created order details
      const [orderDetails] = await connection.execute(`
        SELECT o.*, u.first_name, u.last_name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

      res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: {
          order: orderDetails[0],
          items: cartItems.map(item => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity
          })),
          summary: {
            subtotal,
            discount_amount,
            total_amount,
            currency: 'FCFA'
          }
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Erreur createOrder:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la commande'
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    const params = [userId];

    // Filter by status
    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await pool.execute(query, params);

    // Get total count
    const countQuery = query.split('ORDER BY')[0].replace('SELECT o.*, COUNT(oi.id) as item_count', 'SELECT COUNT(*) as total');
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
    console.error('Erreur getUserOrders:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des commandes'
    });
  }
};

// Get specific order details
const getUserOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get order details
    const [orders] = await pool.execute(`
      SELECT o.*, u.first_name, u.last_name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.user_id = ?
    `, [id, userId]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    const order = orders[0];

    // Get order items
    const [orderItems] = await pool.execute(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `, [id]);

    // Parse shipping address
    let shippingAddress = null;
    if (order.shipping_address) {
      try {
        shippingAddress = JSON.parse(order.shipping_address);
      } catch (e) {
        shippingAddress = null;
      }
    }

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          shipping_address: shippingAddress,
          items: orderItems
        }
      }
    });

  } catch (error) {
    console.error('Erreur getUserOrderById:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des détails de la commande'
    });
  }
};

// Cancel order (user can cancel pending orders only)
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get order details
      const [orders] = await connection.execute(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          error: 'Commande non trouvée'
        });
      }

      const order = orders[0];

      // Check if order can be cancelled
      if (order.status !== 'pending') {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          error: 'Seules les commandes en attente peuvent être annulées'
        });
      }

      if (order.payment_status === 'paid') {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          error: 'Impossible d\'annuler une commande déjà payée'
        });
      }

      // Get order items to restore stock
      const [orderItems] = await connection.execute(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );

      // Restore product stock
      for (const item of orderItems) {
        await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Update order status
      await connection.execute(
        'UPDATE orders SET status = "cancelled", notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [reason || 'Annulé par le client', id]
      );

      await connection.commit();

      res.json({
        success: true,
        message: 'Commande annulée avec succès',
        data: {
          order_id: parseInt(id),
          order_number: order.order_number,
          items_restored: orderItems.length
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Erreur cancelOrder:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'annulation de la commande'
    });
  }
};

// Get order details by ID (admin version)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT o.*, 
             u.first_name, u.last_name, u.email, u.phone,
             COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
    `;
    const params = [id];

    // If not admin, only show user's own orders
    if (userRole !== 'admin') {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY o.id';

    const [orders] = await pool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    const order = orders[0];

    // Get order items with product details
    const [orderItems] = await pool.execute(`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `, [id]);

    // Get shipping address if available
    let shippingAddress = null;
    if (order.shipping_address) {
      try {
        shippingAddress = JSON.parse(order.shipping_address);
      } catch (e) {
        shippingAddress = null;
      }
    }

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          shipping_address: shippingAddress,
          items: orderItems
        }
      }
    });

  } catch (error) {
    console.error('Erreur getOrderById:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des détails de la commande'
    });
  }
};

// Process refund (admin only)
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refund_type, refund_amount, reason, items_to_refund } = req.body;

    // Validate refund type
    if (!['full', 'partial'].includes(refund_type)) {
      return res.status(400).json({
        success: false,
        error: 'Type de remboursement invalide (full ou partial requis)'
      });
    }

    // Get order details
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }

    const order = orders[0];

    // Check if order can be refunded
    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Impossible de rembourser une commande déjà annulée'
      });
    }

    if (order.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Impossible de rembourser une commande non payée'
      });
    }

    // Validate refund amount for partial refunds
    let finalRefundAmount = order.total_amount;
    if (refund_type === 'partial') {
      if (!refund_amount || refund_amount <= 0 || refund_amount >= order.total_amount) {
        return res.status(400).json({
          success: false,
          error: 'Montant de remboursement partiel invalide'
        });
      }
      finalRefundAmount = parseFloat(refund_amount);
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create refund record
      await connection.execute(`
        INSERT INTO refunds (order_id, refund_type, refund_amount, reason, status, created_by)
        VALUES (?, ?, ?, ?, 'processed', ?)
      `, [id, refund_type, finalRefundAmount, reason || null, req.user.id]);

      // Update order payment status
      const newPaymentStatus = refund_type === 'full' ? 'refunded' : 'partially_refunded';
      await connection.execute(
        'UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPaymentStatus, id]
      );

      // If partial refund with specific items, update order items
      if (refund_type === 'partial' && items_to_refund && items_to_refund.length > 0) {
        for (const itemRefund of items_to_refund) {
          await connection.execute(`
            UPDATE order_items 
            SET refund_status = 'refunded', refund_amount = ?
            WHERE order_id = ? AND product_id = ?
          `, [itemRefund.refund_amount, id, itemRefund.product_id]);
        }
      }

      await connection.commit();

      res.json({
        success: true,
        message: `Remboursement ${refund_type === 'full' ? 'total' : 'partiel'} traité avec succès`,
        data: {
          order_id: parseInt(id),
          refund_type,
          refund_amount: finalRefundAmount,
          new_payment_status: newPaymentStatus
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Erreur processRefund:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du traitement du remboursement'
    });
  }
};

// Create categories (admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;

    if (!name || name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Nom de catégorie invalide (2-50 caractères requis)'
      });
    }

    // Check if category already exists
    const [existingCategory] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existingCategory.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Une catégorie avec ce nom existe déjà'
      });
    }

    // Create category
    const [result] = await pool.execute(`
      INSERT INTO categories (name, description, parent_id, status)
      VALUES (?, ?, ?, 'active')
    `, [name, description || null, parent_id || null]);

    // Get created category
    const [newCategory] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [result[0].insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: {
        category: newCategory[0]
      }
    });

  } catch (error) {
    console.error('Erreur createCategory:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la catégorie'
    });
  }
};

// Create coupon (admin only)
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_amount,
      usage_limit,
      starts_at,
      expires_at
    } = req.body;

    // Validate required fields
    if (!code || !discount_type || discount_value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Code, type de remise et valeur requis'
      });
    }

    if (!['percentage', 'fixed'].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        error: 'Type de remise invalide (percentage ou fixed requis)'
      });
    }

    if (discount_type === 'percentage' && (discount_value <= 0 || discount_value > 100)) {
      return res.status(400).json({
        success: false,
        error: 'Pourcentage de remise invalide (0-100%)'
      });
    }

    if (discount_type === 'fixed' && discount_value <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Montant de remise invalide'
      });
    }

    // Check if coupon code already exists
    const [existingCoupon] = await pool.execute(
      'SELECT id FROM coupons WHERE code = ?',
      [code.toUpperCase()]
    );

    if (existingCoupon.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Un code promo avec ce nom existe déjà'
      });
    }

    // Create coupon
    const [result] = await pool.execute(`
      INSERT INTO coupons (
        code, description, discount_type, discount_value, 
        minimum_amount, usage_limit, starts_at, expires_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `, [
      code.toUpperCase(),
      description || null,
      discount_type,
      parseFloat(discount_value),
      minimum_amount || null,
      usage_limit || null,
      starts_at || null,
      expires_at || null
    ]);

    // Get created coupon
    const [newCoupon] = await pool.execute(
      'SELECT * FROM coupons WHERE id = ?',
      [result[0].insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Code promo créé avec succès',
      data: {
        coupon: newCoupon[0]
      }
    });

  } catch (error) {
    console.error('Erreur createCoupon:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du code promo'
    });
  }
};

// Get coupons (admin only)
const getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    let query = `
      SELECT c.*, 
             COUNT(o.id) as used_count
      FROM coupons c
      LEFT JOIN orders o ON c.code = o.coupon_code
      WHERE 1=1
    `;
    const params = [];

    // Filter by status
    if (status && status !== 'all') {
      if (status === 'active') {
        query += ' AND c.is_active = TRUE AND (c.expires_at IS NULL OR c.expires_at > NOW())';
      } else if (status === 'inactive') {
        query += ' AND (c.is_active = FALSE OR (c.expires_at IS NOT NULL AND c.expires_at <= NOW()))';
      } else if (status === 'expired') {
        query += ' AND c.expires_at IS NOT NULL AND c.expires_at <= NOW()';
      }
    }

    // Search
    if (search) {
      query += ' AND (c.code LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY c.id ORDER BY c.created_at DESC';

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [coupons] = await pool.execute(query, params);

    // Get total count
    const countQuery = query.split('ORDER BY')[0].replace('SELECT c.*, COUNT(o.id) as used_count', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        coupons: coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erreur getCoupons:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des codes promo'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getUserOrderById,
  cancelOrder,
  getOrderById,
  processRefund,
  createCategory,
  createCoupon,
  getCoupons
};
