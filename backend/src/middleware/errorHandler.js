// Erreurs MySQL fréquentes → codes HTTP compréhensibles
const MYSQL_ERRORS = {
  ER_DUP_ENTRY: { status: 409, message: 'Cette valeur existe déjà (slug, SKU ou email en double)' },
  ER_NO_REFERENCED_ROW_2: { status: 400, message: 'Référence invalide (catégorie ou service inexistant)' },
  ER_ROW_IS_REFERENCED_2: { status: 409, message: 'Impossible de supprimer : élément encore utilisé ailleurs' },
  ER_CHECK_CONSTRAINT_VIOLATED: { status: 400, message: 'Données invalides' },
}

function errorHandler(err, req, res, next) {
  const known = MYSQL_ERRORS[err.code]
  const status = known?.status || err.status || 500
  let message = known?.message || err.message || 'Erreur interne du serveur'

  // En production, ne jamais exposer le détail d'une erreur 500 (SQL, stack…)
  if (status >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Erreur interne du serveur'
  }

  if (status >= 500 || process.env.NODE_ENV !== 'production') {
    console.error(`[${status}] ${req.method} ${req.path} —`, err.message)
  }

  res.status(status).json({
    success: false,
    message,
  })
}

module.exports = errorHandler
