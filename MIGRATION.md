# Guide de migration — Monorepo innova-maker

Suite à la restructuration du projet en monorepo `frontend/` + `backend/`,
voici tout ce que tu dois faire pour que le déploiement continue de fonctionner.

---

## Ce qui a changé

| Avant | Après |
|-------|-------|
| Fichiers Next.js à la racine | Tout dans `frontend/` |
| 1 seul workflow CI/CD | 2 workflows séparés |
| Pas de backend | `backend/` prêt à être codé |

---

## 1. Mettre à jour le `.gitignore`

Le `.gitignore` actuel ignore probablement `node_modules` à la racine.
Il faut s'assurer qu'il couvre aussi les sous-dossiers.

Ouvre `.gitignore` et vérifie que ces lignes sont présentes, sinon ajoute-les :

```
# Dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Next.js build
frontend/.next/
frontend/out/

# Env files
backend/.env
*.env.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

---

## 2. Les GitHub Secrets — rien ne change

Les secrets déjà configurés dans ton repo GitHub restent valables :

| Secret | Valeur |
|--------|--------|
| `VPS_HOST` | `203.161.43.215` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Clé privée SSH GitHub Actions |
| `VPS_PORT` | `22` |

Aucun nouveau secret à ajouter pour le frontend.

---

## 3. Valider le build frontend en local

Avant de pousser sur `main`, teste que le build fonctionne depuis `frontend/` :

```bash
cd frontend
npm install
npm run build
```

Résultat attendu : dossier `frontend/out/` généré sans erreur.

Si le build échoue, c'est probablement un import qui référence `@/` —
vérifie que `frontend/tsconfig.json` contient bien :

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 4. Premier push après migration

Le workflow frontend se déclenche uniquement si des fichiers dans `frontend/**` changent.

Lors de ton premier push après la migration, force le déclenchement en touchant un fichier :

```bash
# Depuis la racine du repo
echo "" >> frontend/README.md
git add .
git commit -m "chore: migrate to monorepo structure"
git push origin main
```

Ensuite va sur **GitHub → Actions** et vérifie que le workflow `Deploy Frontend` passe en vert ✅.

---

## 5. Vérifier le déploiement frontend sur le VPS

Une fois le workflow terminé, connecte-toi au VPS et vérifie :

```bash
ssh -i ~/.ssh/inovamakers_deploy deploy@203.161.43.215

# Les fichiers doivent être présents
ls -la /var/www/inovamakers/dist/

# Le site doit répondre
curl -I https://inovamakers.io
```

Résultat attendu : `index.html` présent, code HTTP `200 OK`.

---

## 6. Préparer le VPS pour le backend (à faire une seule fois)

Quand le backend sera prêt à être déployé, exécute ces commandes sur le VPS :

```bash
ssh -i ~/.ssh/inovamakers_deploy deploy@203.161.43.215

# Créer le dossier de déploiement backend
mkdir -p /home/deploy/inovamakers/backend

# Créer le fichier .env à partir de l'exemple
cp /home/deploy/inovamakers/backend/.env.example /home/deploy/inovamakers/backend/.env

# Remplir les vraies valeurs
nano /home/deploy/inovamakers/backend/.env
```

Valeurs à renseigner dans `.env` :

```
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inovamakers
DB_USER=inovamakers_user
DB_PASSWORD=<mot de passe MySQL créé lors de la phase 2>
JWT_SECRET=<une chaîne aléatoire longue, ex: openssl rand -hex 64>
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@inovamakers.io
ADMIN_PASSWORD=<mot de passe admin hashé>
CORS_ORIGIN=https://inovamakers.io
```

---

## 7. Activer le bloc Nginx pour l'API (à faire une seule fois)

Quand le backend sera déployé et démarré via PM2, active le bloc Nginx API :

```bash
# Décommenter le contenu du fichier
sudo nano /etc/nginx/sites-available/api-inovamakers

# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/api-inovamakers /etc/nginx/sites-enabled/

# Tester et recharger
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. Ajouter les secrets backend dans GitHub

Quand le backend sera prêt, ajoute ces secrets dans **GitHub → Settings → Secrets → Actions** :

| Secret | Description |
|--------|-------------|
| `DB_PASSWORD` | Mot de passe MySQL |
| `JWT_SECRET` | Clé secrète JWT |
| `ADMIN_PASSWORD` | Mot de passe admin (hashé bcrypt) |

---

## 9. Règle de déclenchement des workflows

| Action | Workflow déclenché |
|--------|--------------------|
| Push dans `frontend/**` | `deploy-frontend.yml` uniquement |
| Push dans `backend/**` | `deploy-backend.yml` uniquement |
| Push ailleurs (README, schema.sql…) | Aucun workflow |

---

## Résumé des actions immédiates

- [ ] Mettre à jour `.gitignore`
- [ ] Tester `npm run build` dans `frontend/` en local
- [ ] Faire un commit et push sur `main`
- [ ] Vérifier que le workflow frontend passe ✅ sur GitHub Actions
- [ ] Vérifier que le site est toujours en ligne sur `https://inovamakers.io`
