# Plan & Bilan — INOVA Makers Fullstack

---

## ÉTAT ACTUEL

| Élément | Statut |
|---------|--------|
| Structure monorepo frontend/ + backend/ | ✅ Fait |
| Fichiers frontend migrés dans frontend/ | ✅ Fait |
| Anciens fichiers racine supprimés | ✅ Fait |
| Workflow deploy-frontend.yml mis à jour | ✅ Fait |
| Workflow deploy-backend.yml créé | ✅ Fait |
| Structure backend créée (dossiers + stubs) | ✅ Fait |
| MIGRATION.md rédigé | ✅ Fait |
| Phase 1 backend (db + middleware + server) | ✅ Fait |
| Phase 2 backend (auth admin + JWT) | ✅ Fait |
| Phase 3 backend (routes publiques) | ✅ Fait |
| Phase 4 backend (routes admin) | ✅ Fait |
| Phase 6 frontend (connexion API) | ✅ Fait |
| Tests | ❌ À faire |

---

## PHASE 1 — BACKEND : FONDATIONS

### 1.1 — Configuration & base de données
- [x] `backend/src/config/db.js` — pool de connexion MySQL avec mysql2
- [x] Tester la connexion à la base inovamakers

### 1.2 — Middleware
- [x] `backend/src/middleware/errorHandler.js` — handler d'erreurs global Express
- [x] `backend/src/middleware/auth.js` — vérification JWT (protège les routes admin)
- [x] `backend/src/middleware/validate.js` — validation Zod générique

### 1.3 — Serveur principal
- [x] `backend/src/server.js` — Express + helmet + cors + rate-limit + routes montées

---

## PHASE 2 — BACKEND : AUTH ADMIN

### 2.1 — Schéma SQL
- [x] Ajouter la table `admins` dans `schema.sql`

### 2.2 — Route auth
- [x] `POST /api/auth/login` — vérifier email + password, retourner JWT
- [x] `POST /api/auth/logout` — invalider le token côté client
- [x] `GET /api/auth/me` — retourner les infos de l'admin connecté

### 2.3 — Script init admin
- [x] `backend/scripts/create-admin.js` — script one-shot pour créer le compte admin en base

---

## PHASE 3 — BACKEND : ROUTES PUBLIQUES

### 3.1 — Produits
- [x] `GET /api/products` — liste avec filtres (category, featured, search, pagination)
- [x] `GET /api/products/:slug` — détail d'un produit

### 3.2 — Catégories
- [x] `GET /api/categories` — liste par type (product / service / blog)

### 3.3 — Articles
- [x] `GET /api/articles` — liste des articles publiés (filtres: category, featured, search, pagination)
- [x] `GET /api/articles/:slug` — détail d'un article

### 3.4 — Services
- [x] `GET /api/services` — liste des services actifs
- [x] `GET /api/services/:slug` — détail d'un service

### 3.5 — Contact
- [x] `POST /api/contacts` — soumettre un message de contact (validation Zod)

### 3.6 — Devis
- [x] `POST /api/quotes` — soumettre une demande de devis (validation Zod)

### 3.7 — Newsletter
- [x] `POST /api/newsletter` — s'abonner
- [x] `DELETE /api/newsletter/unsubscribe` — se désabonner par email

---

## PHASE 4 — BACKEND : ROUTES ADMIN (JWT requis)

### 4.1 — Dashboard
- [x] `GET /api/admin/stats` — total contacts, devis, abonnés, produits, articles

### 4.2 — Gestion des contacts
- [x] `GET /api/admin/contacts` — liste avec filtres (status, type, date)
- [x] `GET /api/admin/contacts/:id` — détail d'un contact
- [x] `PATCH /api/admin/contacts/:id` — mettre à jour status / notes / assigned_to
- [x] `DELETE /api/admin/contacts/:id` — supprimer un contact

### 4.3 — Gestion des devis
- [x] `GET /api/admin/quotes` — liste avec filtres (status, priority, date)
- [x] `GET /api/admin/quotes/:id` — détail d'un devis
- [x] `PATCH /api/admin/quotes/:id` — mettre à jour status / priority / notes
- [x] `DELETE /api/admin/quotes/:id` — supprimer un devis

### 4.4 — Gestion des produits
- [x] `GET /api/admin/products` — liste complète (actifs + inactifs)
- [x] `POST /api/admin/products` — créer un produit
- [x] `PUT /api/admin/products/:id` — modifier un produit
- [x] `DELETE /api/admin/products/:id` — supprimer un produit

### 4.5 — Gestion des articles
- [x] `GET /api/admin/articles` — liste complète (publiés + brouillons)
- [x] `POST /api/admin/articles` — créer un article
- [x] `PUT /api/admin/articles/:id` — modifier un article
- [x] `PATCH /api/admin/articles/:id/publish` — publier / dépublier
- [x] `DELETE /api/admin/articles/:id` — supprimer un article

### 4.6 — Gestion des services
- [x] `GET /api/admin/services` — liste complète
- [x] `POST /api/admin/services` — créer un service
- [x] `PUT /api/admin/services/:id` — modifier un service
- [x] `DELETE /api/admin/services/:id` — supprimer un service

### 4.7 — Gestion des catégories
- [x] `GET /api/admin/categories` — liste complète
- [x] `POST /api/admin/categories` — créer une catégorie
- [x] `PUT /api/admin/categories/:id` — modifier une catégorie
- [x] `DELETE /api/admin/categories/:id` — supprimer une catégorie

### 4.8 — Gestion newsletter
- [x] `GET /api/admin/newsletter` — liste des abonnés actifs
- [x] `DELETE /api/admin/newsletter/:id` — supprimer un abonné

---

## PHASE 5 — TESTS BACKEND

### 5.1 — Tests manuels (Postman / curl)
- [ ] Tester chaque route publique avec des données valides
- [ ] Tester chaque route publique avec des données invalides (erreurs Zod)
- [ ] Tester les routes admin sans JWT → 401
- [ ] Tester les routes admin avec JWT expiré → 401
- [ ] Tester les routes admin avec JWT valide → 200

### 5.2 — Tests d'intégration (à définir)
- [ ] Auth : login OK, login mauvais mot de passe, login email inexistant
- [ ] Contacts : création OK, champs manquants, email invalide
- [ ] Devis : création OK, service inexistant
- [ ] Produits admin : CRUD complet
- [ ] Articles admin : CRUD + publish/unpublish

---

## PHASE 6 — FRONTEND : CONNEXION À L'API

### 6.1 — Configuration
- [x] `frontend/lib/api.js` — client fetch avec base URL `api.inovamakers.io`

### 6.2 — Pages à connecter à l'API
- [x] `contact/page.tsx` — formulaire → `POST /api/contacts`
- [x] `quote/page.tsx` — formulaire → `POST /api/quotes`
- [x] `blog/page.tsx` — données → `GET /api/articles` + catégories + newsletter
- [x] `shop/page.tsx` — données → `GET /api/products` + catégories
- [x] `services/page.tsx` — données → `GET /api/services`
- [x] `engineering/page.tsx` — données → `GET /api/services/engineering`
- [x] `domotics/page.tsx` — données → `GET /api/services/domotics-service`
- [x] `display/page.tsx` — données → `GET /api/services/display`
- [x] Newsletter dans `blog/page.tsx` → `POST /api/newsletter`

### 6.3 — Gestion des états
- [x] Loading states sur les formulaires
- [x] Messages de succès / erreur après soumission
- [x] Empty states si l'API ne retourne rien

---

## PHASE 7 — DÉPLOIEMENT BACKEND SUR VPS

- [ ] Créer `/home/deploy/inovamakers/backend/` sur le VPS
- [ ] Copier et remplir le `.env` sur le VPS
- [ ] Lancer `npm install` sur le VPS
- [ ] Démarrer avec PM2 : `pm2 start src/server.js --name inovamakers-api`
- [ ] Sauvegarder PM2 : `pm2 save`
- [ ] Activer le bloc Nginx `api-inovamakers`
- [ ] Tester `https://api.inovamakers.io/api/products`
- [ ] Vérifier les logs PM2 : `pm2 logs inovamakers-api`

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

```
Phase 1 → Phase 2 → Phase 3 → Phase 5 (tests routes publiques)
       → Phase 4 → Phase 5 (tests routes admin)
       → Phase 6 → Phase 7
```

---

## FICHIERS À CRÉER (récap)

### Backend
| Fichier | Phase |
|---------|-------|
| ~~`backend/src/config/db.js`~~ | 1.1 ✅ |
| ~~`backend/src/middleware/errorHandler.js`~~ | 1.2 ✅ |
| ~~`backend/src/middleware/auth.js`~~ | 1.2 ✅ |
| ~~`backend/src/middleware/validate.js`~~ | 1.2 ✅ |
| ~~`backend/src/server.js`~~ | 1.3 ✅ |
| ~~`backend/src/routes/auth.js`~~ | 2.2 ✅ |
| `backend/src/routes/products.js` | 3.1 |
| `backend/src/routes/categories.js` | 3.2 |
| `backend/src/routes/articles.js` | 3.3 |
| `backend/src/routes/services.js` | 3.4 |
| `backend/src/routes/contacts.js` | 3.5 |
| `backend/src/routes/quotes.js` | 3.6 |
| `backend/src/routes/newsletter.js` | 3.7 |
| `backend/src/routes/admin/stats.js` | 4.1 |
| `backend/src/routes/admin/contacts.js` | 4.2 |
| `backend/src/routes/admin/quotes.js` | 4.3 |
| `backend/src/routes/admin/products.js` | 4.4 |
| `backend/src/routes/admin/articles.js` | 4.5 |
| `backend/src/routes/admin/services.js` | 4.6 |
| `backend/src/routes/admin/categories.js` | 4.7 |
| `backend/src/routes/admin/newsletter.js` | 4.8 |
| ~~`backend/scripts/create-admin.js`~~ | 2.3 ✅ |

### Frontend
| Fichier | Phase |
|---------|-------|
| `frontend/lib/api.js` | 6.1 |

### Base de données
| Fichier | Phase |
|---------|-------|
| ~~`schema.sql` — ajout table `admins`~~ | 2.1 ✅ |
