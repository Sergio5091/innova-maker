Parfait ! Je vais analyser votre projet actuel et créer un cahier des charges détaillé pour la boutique e-commerce. Laissez-moi d'abord examiner la boutique existante pour comprendre le design et les fonctionnalités.





# 📋 **CAHIER DES CHARGES - BOUTIQUE E-COMMERCE INOVA MAKERS**

---

## 🎯 **OBJECTIF PRINCIPAL**
Transformer la boutique statique actuelle en une plateforme e-commerce complète avec gestion des utilisateurs, commandes, stocks et interface d'administration.

---

## 🎨 **IDENTITÉ VISUELLE & DESIGN**

### **Charte graphique**
- **Couleurs principales** : Maintenir les couleurs existantes du site
- **Typography** : Police actuelle du site (probablement Poppins ou similaire)
- **Style** : Moderne, technologique, professionnel
- **Animations** : Framer Motion pour transitions fluides
- **Responsive** : Mobile-first design

### **Composants existants à conserver**
- Navigation avec menu déroulant Services
- Footer avec vraies icônes
- Style des cartes produits
- Boutons et formulaires shadcn/ui
- Animations et micro-interactions

---

## 👥 **ACTEURS & UTILISATEURS**

### **1. Visiteurs (non connectés)**
- Parcourir les produits
- Voir les détails produits
- Rechercher et filtrer
- Voir les prix et stocks

### **2. Clients (connectés)**
- Fonctionnalités visiteurs +
- Ajouter au panier
- Gérer le panier
- Passer commandes
- Voir l'historique des commandes
- Gérer le profil

### **3. Administrateurs**
- Toutes les fonctionnalités clients +
- Gestion des produits
- Gestion des stocks
- Gestion des commandes
- Voir les statistiques
- Gestion des utilisateurs

---

## 🏪 **FRONTEND - BOUTIQUE CLIENT**

### **1. Page Boutique (/shop)**
- **Affichage grille** des produits avec pagination
- **Filtres avancés** : catégorie, prix, note, disponibilité
- **Recherche** en temps réel
- **Tri** : pertinence, prix croissant/décroissant, note, nouveauté
- **Badges** : "Nouveau", "Promo", "Populaire", "Stock limité"

### **2. Fiche Produit (/shop/[id])**
- **Galeries d'images** multiples avec zoom
- **Informations détaillées** : description, caractéristiques, spécifications
- **Prix** : prix normal, prix promo, économies
- **Stock** : quantité disponible, délai de livraison
- **Avis clients** avec notation étoiles
- **Produits associés** (cross-selling)
- **Options** : variantes (couleur, taille, etc.)

### **3. Panier (/cart)**
- **Liste des articles** avec images et quantités
- **Modification quantités** avec mise à jour en temps réel
- **Suppression articles**
- **Résumé** : sous-total, taxes, livraison, total
- **Code promo** avec validation
- **Bouton** "Continuer mes achats" et "Passer commande"

### **4. Commande (/checkout)**
- **Étapes** : 1. Adresse → 2. Livraison → 3. Paiement → 4. Confirmation
- **Formulaire adresse** avec validation
- **Options de livraison** : standard, express, retrait
- **Modes de paiement** : Mobile Money (MTN/Moov), carte, à la livraison
- **Récapitulatif** détaillé avant validation

### **5. Compte Client (/account)**
- **Tableau de bord** avec résumé commandes
- **Profil** : informations personnelles, adresses
- **Commandes** : historique avec statuts tracking
- **Favoris** : produits sauvegardés
- **Notifications** : mises à jour commandes

### **6. Authentification**
- **Inscription** : formulaire avec validation email
- **Connexion** : email/mot de passe avec "Se souvenir"
- **Mot de passe oublié** : envoi email de réinitialisation
- **Social login** : Google, Facebook (optionnel)

---

## 🛠️ **BACKEND - API NODEJS**

### **Architecture**
- **Framework** : Express.js
- **Base de données** : MySQL 8.x
- **Authentification** : JWT tokens
- **Validation** : Joi ou express-validator
- **Upload** : Multer pour images

### **Endpoints API**

#### **Authentification**
```
POST /api/auth/register     - Inscription
POST /api/auth/login        - Connexion
POST /api/auth/logout       - Déconnexion
GET  /api/auth/me           - Profil utilisateur
POST /api/auth/forgot       - Mot de passe oublié
```

#### **Produits**
```
GET    /api/products           - Liste produits (pagination/filtres)
GET    /api/products/:id       - Détails produit
POST   /api/products           - Créer produit (admin)
PUT    /api/products/:id       - Modifier produit (admin)
DELETE /api/products/:id       - Supprimer produit (admin)
POST   /api/products/:id/review - Ajouter avis client
```

#### **Panier**
```
GET    /api/cart               - Voir panier
POST   /api/cart/add           - Ajouter article
PUT    /api/cart/update        - Modifier quantité
DELETE /api/cart/:productId    - Supprimer article
DELETE /api/cart               - Vider panier
```

#### **Commandes**
```
GET    /api/orders             - Historique commandes
POST   /api/orders             - Créer commande
GET    /api/orders/:id         - Détails commande
PUT    /api/orders/:id/status  - Mettre à jour statut (admin)
```

#### **Utilisateurs (Admin)**
```
GET    /api/admin/users        - Liste utilisateurs
PUT    /api/admin/users/:id    - Modifier utilisateur
DELETE /api/admin/users/:id    - Supprimer utilisateur
```

---

## 🗄️ **BASE DE DONNÉES MYSQL**

### **Structure des tables**

#### **Users**
```sql
- id, first_name, last_name, email, phone
- password_hash, role (customer/admin)
- created_at, updated_at
```

#### **Products**
```sql
- id, name, description, price, currency
- category, stock_quantity, status
- rating, reviews_count, badge
- image_url, specifications (JSON)
- created_at, updated_at
```

#### **Orders**
```sql
- id, user_id, order_number, total_amount
- status, shipping_address (JSON)
- payment_method, payment_status
- tracking_number, created_at, updated_at
```

#### **Order_Items**
```sql
- id, order_id, product_id, quantity
- unit_price, product_snapshot (JSON)
```

#### **Cart_Items**
```sql
- id, user_id, product_id, quantity
- created_at
```

#### **Product_Reviews**
```sql
- id, product_id, user_id, rating, comment
- created_at
```

---

## 🎛️ **INTERFACE ADMINISTRATION**

### **Tableau de bord (/admin)**
- **Statistiques** : ventes du jour/mois, commandes en cours, produits populaires
- **Graphiques** : évolution des ventes, répartition par catégorie
- **Alertes** : stocks bas, commandes urgentes

### **Gestion Produits**
- **Liste** avec filtres et recherche
- **Formulaire** création/modification avec upload images
- **Gestion stock** : alertes automatiques si < 5 unités
- **Variants** : couleurs, tailles, options

### **Gestion Commandes**
- **Vue en liste** avec statuts et filtres
- **Détails commande** : client, produits, livraison
- **Actions** : confirmer, expédier, annuler
- **Export** : CSV/Excel des commandes

### **Gestion Clients**
- **Liste clients** avec historique d'achat
- **Informations** détaillées
- **Actions** : bloquer, promouvoir, notifier

### **Paramètres**
- **Configuration** : frais de livraison, taxes
- **Modes de paiement** : activer/désactiver options
- **Notifications** : emails automatiques

---

## 💳 **SYSTÈME DE PAIEMENT**

### **Méthodes disponibles**
1. **Mobile Money** : MTN Bénin, Moov Bénin
2. **Carte bancaire** : Integration Stripe/Paystack
3. **Paiement à la livraison** : Cash ou mobile money

### **Processus**
1. **Validation commande** → redirection paiement
2. **Callback** de confirmation → mise à jour statut
3. **Email** de confirmation client + admin
4. **Gestion** des échecs de paiement

---

## 📦 **GESTION STOCKS**

### **Fonctionnalités**
- **Alertes automatiques** stock bas (email admin)
- **Mise à jour** automatique après commande
- **Historique** des mouvements de stock
- **Prévisions** basées sur ventes passées

### **Statuts produits**
- **En stock** : affichage normal
- **Stock limité** : badge "Plus que X articles"
- **Rupture** : produit non commandable
- **Précommande** : disponible prochainement

---

## 📧 **SYSTÈME DE NOTIFICATIONS**

### **Emails automatiques**
- **Inscription** : bienvenue + vérification
- **Commande** : confirmation + récapitulatif
- **Expédition** : notification tracking
- **Livraison** : demande d'avis

### **Notifications site**
- **Panier abandonné** : rappel après 24h
- **Promotions** : produits favoris en promo
- **Retour stock** : produit réapprovisionné

---

## 🔍 **ANALYTIQUES & TRACKING**

### **Données collectées**
- **Visites** : pages vues, temps passé
- **Produits** : vues, ajoutés panier, achetés
- **Conversion** : tunnel d'achat complet
- **Panier abandonné** : étapes de décrochage

### **Tableaux de bord**
- **Trafic** : visiteurs uniques, pages populaires
- **Ventes** : chiffre d'affaires, panier moyen
- **Produits** : mieux vendus, moins vendus
- **Clients** : nouveaux vs récurrents

---

## 🚀 **DÉPLOIEMENT & INFRASTRUCTURE**

### **Environnement**
- **Frontend** : Vercel/Netlify
- **Backend** : VPS Namecheap (Ubuntu)
- **Database** : MySQL sur VPS
- **CDN** : Cloudflare
- **Domaines** : inovamakers.io + api.inovamakers.io

### **Sécurité**
- **HTTPS** : SSL partout
- **Rate limiting** : protection contre abus
- **Validation** : tous les inputs
- **JWT** : tokens sécurisés
- **CORS** : restrictions domaines

---

## 📋 **PHASES DE DÉVELOPPEMENT**

### **Phase 1 : Backend (1-2 semaines)**
- Configuration base de données
- API authentification
- API produits (CRUD)
- API panier et commandes

### **Phase 2 : Frontend Client (2-3 semaines)**
- Refonte page boutique
- Fiches produits détaillées
- Panier et checkout
- Compte client

### **Phase 3 : Frontend Admin (1-2 semaines)**
- Tableau de bord
- Gestion produits
- Gestion commandes
- Statistiques

### **Phase 4 : Intégration & Tests (1 semaine)**
- Connexion frontend/backend
- Tests E2E
- Optimisations
- Déploiement

---

## 🎯 **CRITÈRES DE RÉUSSITE**

### **Fonctionnels**
- ✅ Navigation fluide boutique
- ✅ Processus commande complet
- ✅ Gestion stocks efficace
- ✅ Interface admin intuitive

### **Techniques**
- ✅ Performance < 3s chargement
- ✅ Mobile responsive parfait
- ✅ SEO optimisé
- ✅ Sécurité renforcée

### **Expérience utilisateur**
- ✅ Design cohérent site actuel
- ✅ Navigation intuitive
- ✅ Processus simple
- ✅ Support efficace

---

**Ce cahier des charges servira de référence pour toutes les phases de développement de la boutique e-commerce INOVA Makers.**