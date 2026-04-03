# 🚀 API Backend INOVA Makers

Backend API pour la boutique e-commerce INOVA Makers - Node.js + Express + MySQL

## 📋 Prérequis

- Node.js 18+
- MySQL 8.x
- npm ou yarn

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=inovamakers

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_au_moins_32_caracteres

# Serveur
PORT=3001
NODE_ENV=development

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

## 🗄️ Base de données

### Initialisation

```bash
# Créer les tables
npm run db:migrate

# Peupler avec les données de test
npm run db:seed
```

### Structure des tables

- `users` - Utilisateurs (clients + admin)
- `products` - Produits de la boutique
- `orders` - Commandes clients
- `order_items` - Articles de commande
- `cart_items` - Panier utilisateurs
- `product_reviews` - Avis produits
- `shipping_addresses` - Adresses de livraison
- `coupons` - Codes de réduction

## 🚀 Démarrage

### Développement

```bash
npm run dev
```

### Production

```bash
npm start
```

## 📡 API Endpoints

### Authentification

```
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
GET  /api/auth/me           # Profil utilisateur
```

### Produits

```
GET    /api/products           # Liste produits (pagination/filtres)
GET    /api/products/:id       # Détails produit
POST   /api/products           # Créer produit (admin)
PUT    /api/products/:id       # Modifier produit (admin)
DELETE /api/products/:id       # Supprimer produit (admin)
```

### Panier

```
GET    /api/cart               # Voir panier
POST   /api/cart/add           # Ajouter article
PUT    /api/cart/update        # Modifier quantité
DELETE /api/cart/:productId    # Supprimer article
```

### Commandes

```
GET    /api/orders             # Historique commandes
POST   /api/orders             # Créer commande
GET    /api/orders/:id         # Détails commande
PUT    /api/orders/:id/status  # Mettre à jour statut (admin)
```

## 🔐 Authentification

L'API utilise des tokens JWT pour l'authentification :

```bash
# Headers
Authorization: Bearer <votre_token_jwt>
```

## 📝 Exemples d'utilisation

### Inscription

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com",
    "password": "password123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "password123"
  }'
```

### Lister les produits

```bash
curl -X GET "http://localhost:3001/api/products?category=led&page=1&limit=12"
```

### Ajouter au panier

```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

## 🧪 Tests

```bash
npm test
```

## 📊 Statut par défaut

### Utilisateur Admin
- **Email**: admin@inovamakers.io
- **Mot de passe**: admin123

### Produits
- **12 produits** technologiques pré-chargés
- **5 catégories** : LED, Horloges, Solaire, Domotique, IoT

### Coupons
- **BIENVENUE10**: 10% sur première commande
- **SOLAIRE5000**: 5000 FCFA sur kits solaires

## 🚀 Déploiement

### Avec PM2

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Voir les logs
pm2 logs

# Arrêter
pm2 stop inovamakers-api
```

### Variables d'environnement production

```env
NODE_ENV=production
PORT=3001
DB_HOST=votre_host_mysql
DB_USER=votre_user_mysql
DB_PASSWORD=votre_password_mysql
DB_NAME=inovamakers
JWT_SECRET=votre_secret_production_tres_long_et_complexe
```

## 🔧 Développement

### Structure des dossiers

```
src/
├── app.js              # Serveur principal
├── controllers/         # Contrôleurs (à créer)
├── models/             # Modèles (à créer)
├── routes/             # Routes (à créer)
├── middleware/          # Middleware (à créer)
├── utils/              # Utilitaires (à créer)
└── scripts/            # Scripts DB
    ├── migrate.js      # Migration DB
    └── seed.js         # Peuplement DB
```

### Prochaines étapes

1. **Créer les contrôleurs** pour chaque ressource
2. **Implémenter les routes** modulaires
3. **Ajouter les middlewares** de validation
4. **Créer les modèles** de données
5. **Ajouter les tests** unitaires
6. **Implémenter l'upload** d'images
7. **Ajouter les emails** automatiques
8. **Créer l'interface admin**

## 📞 Support

Pour toute question ou problème, contactez l'équipe INOVA Makers.

---

**INOVA Makers** - De l'esquisse au prototype fonctionnel, nous matérialisons vos innovations.
