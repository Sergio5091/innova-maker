const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/database');

// Validation schemas
const schemas = {
  register: {
    first_name: (value) => {
      if (!value || value.length < 2 || value.length > 50) {
        return { error: 'Le prénom doit contenir entre 2 et 50 caractères' };
      }
      return null;
    },
    last_name: (value) => {
      if (!value || value.length < 2 || value.length > 50) {
        return { error: 'Le nom doit contenir entre 2 et 50 caractères' };
      }
      return null;
    },
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        return { error: 'Email invalide' };
      }
      return null;
    },
    phone: (value) => {
      if (value && !/^\+?[0-9\s-()]{10,20}$/.test(value)) {
        return { error: 'Numéro de téléphone invalide' };
      }
      return null;
    },
    password: (value) => {
      if (!value || value.length < 8) {
        return { error: 'Le mot de passe doit contenir au moins 8 caractères' };
      }
      return null;
    }
  },
  login: {
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        return { error: 'Email invalide' };
      }
      return null;
    },
    password: (value) => {
      if (!value) {
        return { error: 'Mot de passe requis' };
      }
      return null;
    }
  }
};

// Validate request data
const validate = (data, schemaName) => {
  const schema = schemas[schemaName];
  for (const [field, validator] of Object.entries(schema)) {
    const error = validator(data[field]);
    if (error) {
      return { field, error };
    }
  }
  return null;
};

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    // Validate input
    const validationError = validate(req.body, 'register');
    if (validationError) {
      return res.status(400).json({ 
        error: validationError.error,
        field: validationError.field
      });
    }

    const { first_name, last_name, email, phone, password } = req.body;

    // Check if user already exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        error: 'Cet email est déjà utilisé',
        field: 'email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [result] = await pool.execute(`
      INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, ?, 'customer')
    `, [first_name, last_name, email.toLowerCase(), phone, hashedPassword]);

    // Get created user
    const [newUser] = await pool.execute(
      'SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?',
      [result[0].insertId]
    );

    const user = newUser[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de l\'inscription' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Validate input
    const validationError = validate(req.body, 'login');
    if (validationError) {
      return res.status(400).json({ 
        error: validationError.error,
        field: validationError.field
      });
    }

    const { email, password } = req.body;

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Email ou mot de passe incorrect',
        field: 'email'
      });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Email ou mot de passe incorrect',
        field: 'password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    await pool.execute(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la connexion' 
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(`
      SELECT id, first_name, last_name, email, phone, role, created_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération du profil' 
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;

    // Validate input
    const validationError = validate({ first_name, last_name, phone }, 'register');
    if (validationError && validationError.field !== 'password' && validationError.field !== 'email') {
      return res.status(400).json({ 
        error: validationError.error,
        field: validationError.field
      });
    }

    // Update user
    await pool.execute(`
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [first_name, last_name, phone, userId]);

    // Get updated user
    const [updatedUser] = await pool.execute(
      'SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: updatedUser[0]
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la mise à jour du profil' 
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ 
        success: false,
        error: 'Mot de passe actuel et nouveau mot de passe requis' 
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ 
        success: false,
        error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' 
      });
    }

    // Get user with password
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Utilisateur non trouvé' 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, users[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Mot de passe actuel incorrect' 
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 12);

    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });

  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors du changement de mot de passe' 
    });
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  try {
    // In a real implementation, you might want to invalidate the token
    // For now, we'll just return success (token invalidation is client-side)
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la déconnexion' 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};
