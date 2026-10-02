# INOVA Makers

Site vitrine + boutique + blog + espace d'administration pour [inovamakers.io](https://inovamakers.io).

| Dossier | Stack | Rôle |
|---|---|---|
| `frontend/` | Next.js 15 (export statique), React 19, Tailwind 4, shadcn/ui | Site public et admin (`/admin`) |
| `backend/` | Express 4, MySQL (mysql2), JWT, Zod | API REST sur `api.inovamakers.io` |
| `schema.sql` | MySQL 8 | Schéma complet + données de base (catégories, services) |

## Démarrage local

Prérequis : Node.js 20+, MySQL 8 (Laragon). Voir aussi [NODE_SETUP.md](NODE_SETUP.md).

```bash
# 1. Base de données (une seule fois)
mysql -u root -p -e "CREATE DATABASE inovamakers CHARACTER SET utf8mb4"
mysql -u root -p < schema.sql

# 2. Backend → http://localhost:8000/api
cd backend
cp .env.example .env        # puis remplir (PORT=8000 en local)
npm install
node scripts/create-admin.js   # crée le compte admin depuis ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev

# 3. Frontend → http://localhost:3000
cd frontend
npm install --legacy-peer-deps
npm run dev
```

`./dev.sh` lance les deux en parallèle.

Variables frontend (`frontend/.env.local`) :

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

## Tests

```bash
cd backend && npm test
```

Les tests n'ont pas besoin de MySQL : ils couvrent l'auth JWT, la validation Zod et les helpers SQL.

## Règles importantes

- **Le frontend est un export statique** (`output: 'export'`) : pas de route dynamique `[slug]`.
  Les pages détail lisent un paramètre d'URL : `/shop/produit?slug=...`, `/blog/article?slug=...`,
  `/admin/products/edit?id=...`. `useSearchParams()` doit être enveloppé dans un `<Suspense>`.
- **Les erreurs TypeScript bloquent le build** (`npm run build`) : vérifier avec `npx tsc --noEmit`.
- **Les `PUT` admin sont partiels** : seuls les champs envoyés sont modifiés.
  Toutes les routes admin valident le body avec Zod (`backend/src/schemas/admin.js`).
- **Ne jamais versionner `backend/.env`** : seul `.env.example` est dans git.
- Les pages `/engineering`, `/domotics`, `/display` dépendent des services de slug
  `engineering`, `domotics-service`, `display` (créés par `schema.sql` ou `backend/scripts/seed-services.sql`).

## Déploiement

Push sur `main` → GitHub Actions (voir [MIGRATION.md](MIGRATION.md) et [plan-deploiement-inovamakers.md](plan-deploiement-inovamakers.md)) :

- `frontend/**` → build statique → `/var/www/inovamakers/dist` (Nginx)
- `backend/**` → copie sur le VPS → `npm ci` → redémarrage PM2 `inovamakers-api`

Variables GitHub (Settings → Secrets and variables → Actions → **Variables**) :
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
