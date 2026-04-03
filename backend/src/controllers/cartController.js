const { pool } = require('../utils/database');

// Validate cart item
const validateCartItem = (data) => {
  const errors = [];
  
  if (!data.product_id || isNaN(data.product_id)) {
    errors.push({ field: 'product_id', error: 'ID produit requis et valide' });
  }
  
  if (!data.quantity || isNaN(data.quantity) || data.quantity < 1) {
    errors.push({ field: 'quantity', error: 'Quantité requise et supérieure à 0' });
  }
  
  return errors;
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [cartItems] = await pool.execute(`
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        ci.created_at as added_at,
        p.id,
        p.name,
        p.description,
        p.price,
        p.currency,
        p.category,
        p.stock_quantity,
        p.image_url,
        p.badge,
        p.status,
        p.rating,
        p.reviews_count,
        (ci.quantity * p.price) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.status = 'active'
      ORDER BY ci.created_at DESC
    `, [userId]);

    // Calculate totals
    const totals = cartItems.reduce((acc, item) => {
      acc.subtotal += item.subtotal;
      acc.items += item.quantity;
      acc.unique_products += 1;
      return acc;
    }, { subtotal: 0, items: 0, unique_products: 0 });

    res.json({
      success: true,
      data: {
        items: cartItems,
        totals,
        summary: {
          total_items: totals.items,
          unique_products: totals.unique_products,
          subtotal: totals.subtotal,
          currency: 'FCFA'
        }
      }
    });

  } catch (error) {
    console.error('Erreur getCart:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du panier'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    // Validate input
    const errors = validateCartItem({ product_id, quantity });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Erreur de validation',
        details: errors
      });
    }

    // Check if product exists and is available
    const [products] = await pool.execute(
      'SELECT id, name, stock_quantity, status FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    const product = products[0];

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Produit non disponible'
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuffisant. Seulement ${product.stock_quantity} unités disponibles`
      });
    }

    // Check if item already in cart
    const [existingItem] = await pool.execute(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (existingItem.length > 0) {
        // Update existing item
        const newQuantity = existingItem[0].quantity + quantity;
        
        // Check stock again
        if (product.stock_quantity < newQuantity) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: `Stock insuffisant. Seulement ${product.stock_quantity} unités disponibles au total`
          });
        }

        await connection.execute(
          'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newQuantity, existingItem[0].id]
        );

        await connection.commit();

        res.json({
          success: true,
          message: 'Quantité mise à jour dans le panier',
          data: {
            cart_item_id: existingItem[0].id,
            product_id,
            previous_quantity: existingItem[0].quantity,
            new_quantity,
            product_name: product.name
          }
        });

      } else {
        // Add new item
        const [result] = await connection.execute(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, product_id, quantity]
        );

        await connection.commit();

        res.status(201).json({
          success: true,
          message: 'Produit ajouté au panier',
          data: {
            cart_item_id: result[0].insertId,
            product_id,
            quantity,
            product_name: product.name
          }
        });
      }

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Erreur addToCart:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout au panier'
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Validate input
    const errors = validateCartItem({ product_id, quantity });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Erreur de validation',
        details: errors
      });
    }

    // Check if item exists in cart
    const [existingItem] = await pool.execute(`
      SELECT ci.id, ci.quantity, p.stock_quantity, p.name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND ci.product_id = ? AND p.status = 'active'
    `, [userId, product_id]);

    if (existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé dans le panier'
      });
    }

    const item = existingItem[0];

    // Check stock
    if (item.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuffisant. Seulement ${item.stock_quantity} unités disponibles`
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (quantity === 0) {
        // Remove item from cart
        await connection.execute(
          'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
          [userId, product_id]
        );

        await connection.commit();

        res.json({
          success: true,
          message: 'Article supprimé du panier',
          data: {
            product_id,
            product_name: item.name,
            action: 'removed'
          }
        });

      } else {
        // Update quantity
        await connection.execute(
          'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [quantity, item.id]
        );

        await connection.commit();

        res.json({
          success: true,
          message: 'Quantité mise à jour',
          data: {
            cart_item_id: item.id,
            product_id,
            product_name: item.name,
            previous_quantity: item.quantity,
            new_quantity: quantity
          }
        });
      }

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Erreur updateCartItem:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du panier'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;

    if (!product_id || isNaN(product_id)) {
      return res.status(400).json({
        success: false,
        error: 'ID produit valide requis'
      });
    }

    // Check if item exists and get product info
    const [existingItem] = await pool.execute(`
      SELECT ci.id, p.name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND ci.product_id = ?
    `, [userId, product_id]);

    if (existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé dans le panier'
      });
    }

    // Remove item
    const [result] = await pool.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Article supprimé du panier',
      data: {
        product_id: parseInt(product_id),
        product_name: existingItem[0].name
      }
    });

  } catch (error) {
    console.error('Erreur removeFromCart:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du panier'
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await pool.execute(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Panier vidé avec succès',
      data: {
        items_removed: result.affectedRows
      }
    });

  } catch (error) {
    console.error('Erreur clearCart:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du vidage du panier'
    });
  }
};

// Get cart summary (quick overview)
const getCartSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [summary] = await pool.execute(`
      SELECT 
        COUNT(*) as items_count,
        COUNT(DISTINCT ci.product_id) as unique_products,
        SUM(ci.quantity * p.price) as subtotal,
        MIN(p.stock_quantity < ci.quantity) as has_stock_issues
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.status = 'active'
    `, [userId]);

    const result = summary[0];

    res.json({
      success: true,
      data: {
        items_count: result.items_count || 0,
        unique_products: result.unique_products || 0,
        subtotal: result.subtotal || 0,
        currency: 'FCFA',
        has_stock_issues: Boolean(result.has_stock_issues),
        is_empty: (result.items_count || 0) === 0
      }
    });

  } catch (error) {
    console.error('Erreur getCartSummary:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du résumé du panier'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
};
