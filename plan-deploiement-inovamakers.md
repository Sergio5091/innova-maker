# Plan de déploiement — inovamakers.io
> VPS Namecheap | Ubuntu 24.04 LTS | React SPA + Node.js/Express/MySQL (futur)

---

## Recommandations préliminaires

1. **Swap manquant** : votre VPS a 0B de swap. Avec 1.9 GB de RAM, un pic lors d'un build Node.js peut provoquer un crash OOM. On crée un swap de 1 GB dès l'étape 1.
2. **PM2 installé dès maintenant** : même si le backend Express/MySQL n'existe pas encore, PM2 est installé et préconfiguré. Zéro reconfiguration lors du passage en fullstack.
3. **Nginx** : gère à la fois le frontend statique (aujourd'hui) et le reverse proxy vers l'API Express sur `api.inovamakers.io` (demain). Le bloc de configuration API est inclus en commentaire, prêt à être activé.
4. **MySQL** : installé et sécurisé dès maintenant pour être prêt à l'arrivée du backend.
5. **SSL Full (strict)** : Let's Encrypt sur le VPS + Cloudflare en proxy orange = chiffrement de bout en bout.
6. **DNS sur Namecheap** : les nameservers seront modifiés dans le panneau Namecheap (domaine ET VPS sont chez Namecheap).

---

## Architecture finale cible

```

Visiteur HTTPS
     │
     ▼
┌─────────────────────────────────┐
│  Cloudflare                     │
│  WAF + CDN + Proxy + SSL edge   │
│  inovamakers.io                 │
│  api.inovamakers.io             │
└──────────────┬──────────────────┘
               │ HTTPS (SSL Full Strict)
               ▼
┌─────────────────────────────────────────────────────┐
│  VPS 203.161.43.215 — Ubuntu 24.04 LTS             │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │  Nginx (reverse proxy)                      │    │
│  │  inovamakers.io → /var/www/inovamakers/dist │    │
│  │  api.inovamakers.io → localhost:3000 (PM2)  │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ┌──────────────────┐  ┌───────────────────────┐   │
│  │  Fichiers React  │  │  Node.js/Express (PM2) │   │
│  │  /var/www/       │  │  port 3000 (futur)     │   │
│  │  inovamakers/dist│  └───────────────────────┘   │
│  └──────────────────┘                               │
│                                                     │
│  ┌──────────────────┐  ┌───────────────────────┐   │
│  │  MySQL 8.x       │  │  UFW + Fail2ban        │   │
│  │  inovamakers DB  │  │  SSH par clé           │   │
│  └──────────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────┘
               ▲
               │ SSH deploy (clé GitHub Actions)
┌──────────────┴──────────────────┐
│  GitHub Actions CI/CD           │
│  push main → build → deploy     │
└─────────────────────────────────┘
```

---

# Phase 1 — Sécurisation & configuration initiale du serveur

---

## Étape 1.1 — Connexion SSH et mise à jour système

**🎯 Objectif** : Se connecter au VPS et mettre à jour tous les paquets système.

**🛠️ Commandes :**

```bash
ssh root@203.161.43.215
```

Une fois connecté :

```bash
apt update && apt upgrade -y
apt autoremove -y
reboot
```

Reconnectez-vous après redémarrage (environ 30 secondes) :

```bash
ssh root@203.161.43.215
```

**✅ Validation :**

```bash
uname -a
lsb_release -a
```

Résultat attendu : `Ubuntu 24.04.4 LTS` + kernel `6.8.x` ou supérieur.

**⚠️ Erreur fréquente** : `ssh: Connection refused` → attendez 1 minute, le VPS redémarre encore.

---

## Étape 1.2 — Création du fichier swap (1 GB)

**🎯 Objectif** : Prévenir les crashes OOM lors des builds Node.js.

**🛠️ Commandes :**

```bash
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**✅ Validation :**

```bash
free -h
```

Résultat attendu : ligne `Swap: 1.0G` visible.

---

## Étape 1.3 — Création d'un utilisateur non-root

**🎯 Objectif** : Ne jamais opérer ou déployer en root.

**🛠️ Commandes :**

```bash
adduser deploy
```

Entrez un mot de passe fort. Appuyez sur Entrée pour les autres champs.

```bash
usermod -aG sudo deploy
```

**✅ Validation :**

```bash
id deploy
```

Résultat attendu : `uid=1001(deploy) groups=1001(deploy),27(sudo)`

---

## Étape 1.4 — Configuration des clés SSH

**🎯 Objectif** : Désactiver l'authentification par mot de passe, utiliser uniquement les clés SSH.

**Sur votre machine locale** (pas sur le VPS) :

```bash
ssh-keygen -t ed25519 -C "deploy@inovamakers" -f ~/.ssh/inovamakers_deploy
```

Appuyez sur Entrée pour les deux questions (pas de passphrase).

Deux fichiers créés :
- `~/.ssh/inovamakers_deploy` → clé privée (à ne jamais partager)
- `~/.ssh/inovamakers_deploy.pub` → clé publique

**Copiez la clé publique sur le VPS :**

```bash
ssh-copy-id -i ~/.ssh/inovamakers_deploy.pub root@203.161.43.215
```

**Sur le VPS**, copiez la clé pour l'utilisateur `deploy` :

```bash
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

**Durcissement SSH :**

```bash
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh
```

**✅ Validation** — dans un **nouveau terminal** (gardez l'ancien ouvert) :

```bash
ssh -i ~/.ssh/inovamakers_deploy deploy@203.161.43.215
```

Résultat attendu : connexion réussie sans demande de mot de passe.

**⚠️ CRITIQUE** : Ne fermez pas l'ancienne session root tant que la nouvelle connexion n'est pas confirmée. En cas de blocage, la console Namecheap donne un accès d'urgence.

---

## Étape 1.5 — Configuration du pare-feu UFW

**🎯 Objectif** : N'autoriser que SSH, HTTP et HTTPS.

**🛠️ Commandes** (en tant que `deploy` avec sudo) :

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
```

**✅ Validation :**

```bash
sudo ufw status verbose
```

Résultat attendu :

```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

---

## Étape 1.6 — Installation de Fail2ban

**🎯 Objectif** : Bloquer automatiquement les tentatives de brute-force SSH.

**🛠️ Commandes :**

```bash
sudo apt install fail2ban -y

sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[sshd]
enabled = true
port = 22
maxretry = 5
bantime = 3600
findtime = 600
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**✅ Validation :**

```bash
sudo fail2ban-client status sshd
```

Résultat attendu : `Status for the jail: sshd` avec `Currently banned: 0`.

---

# Phase 2 — Installation de l'environnement

---

## Étape 2.1 — Installation de Node.js (via nvm)

**🎯 Objectif** : Installer Node.js LTS pour le build React et le futur backend Express.

**🛠️ Commandes :**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
nvm alias default node
```

**✅ Validation :**

```bash
node --version
npm --version
```

Résultat attendu : `v22.x.x` et `10.x.x` (ou versions LTS actuelles).

---

## Étape 2.2 — Installation de PM2

**🎯 Objectif** : Installer PM2 maintenant pour gérer le futur backend Express. PM2 ne sert que pour les processus Node.js — le frontend reste servi par Nginx seul.

**🛠️ Commandes :**

```bash
npm install -g pm2
pm2 startup systemd -u deploy --hp /home/deploy
```

Cette commande affiche une ligne à exécuter avec `sudo`. Copiez-la et exécutez-la. Elle ressemble à :

```bash
sudo env PATH=$PATH:/home/deploy/.nvm/versions/node/v22.x.x/bin \
  /home/deploy/.nvm/versions/node/v22.x.x/lib/node_modules/pm2/bin/pm2 \
  startup systemd -u deploy --hp /home/deploy
```

```bash
sudo systemctl enable pm2-deploy
```

**✅ Validation :**

```bash
pm2 --version
pm2 list
```

Résultat attendu : version affichée et liste vide (aucun processus pour l'instant — normal).

---

## Étape 2.3 — Installation de MySQL

**🎯 Objectif** : Installer et sécuriser MySQL pour le futur backend Express.

**🛠️ Commandes :**

```bash
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
```

**Sécurisation MySQL :**

```bash
sudo mysql_secure_installation
```

Répondez aux questions :
- VALIDATE PASSWORD COMPONENT → `No`
- Remove anonymous users → `Yes`
- Disallow root login remotely → `Yes`
- Remove test database → `Yes`
- Reload privilege tables → `Yes`

**Création de la base et de l'utilisateur :**

```bash
sudo mysql -u root -p
```

Dans le shell MySQL :

```sql
CREATE DATABASE inovamakers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'inovamakers_user'@'localhost' IDENTIFIED BY 'Inova2026@f.io';
GRANT ALL PRIVILEGES ON inovamakers.* TO 'inovamakers_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**✅ Validation :**

```bash
sudo systemctl status mysql
mysql -u inovamakers_user -p -e "SHOW DATABASES;"
```

Résultat attendu : `inovamakers` apparaît dans la liste des bases.

---

## Étape 2.4 — Installation de Nginx

**🎯 Objectif** : Installer Nginx comme serveur de fichiers statiques et reverse proxy.

**🛠️ Commandes :**

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

**✅ Validation :**

```bash
sudo systemctl status nginx
curl -I http://localhost
```

Résultat attendu : `Active: active (running)` et code HTTP `200 OK`.

---

## Étape 2.5 — Création des répertoires de déploiement

```bash
sudo mkdir -p /var/www/inovamakers/dist
sudo chown -R deploy:deploy /var/www/inovamakers
sudo chmod -R 755 /var/www/inovamakers
```

**✅ Validation :**

```bash
ls -la /var/www/
```

Résultat attendu : dossier `inovamakers` appartenant à `deploy:deploy`.

---

# Phase 3 — Configuration DNS (Namecheap → Cloudflare → VPS)

---

## Étape 3.1 — Création du compte Cloudflare et ajout du domaine

**🎯 Objectif** : Passer la gestion DNS à Cloudflare.

**Actions :**

1. Allez sur [cloudflare.com](https://cloudflare.com) → créez un compte gratuit
2. Cliquez sur **"Add a Site"** → entrez `inovamakers.io`
3. Choisissez le plan **Free**
4. Cloudflare scanne vos DNS existants → vérifiez et conservez les enregistrements pertinents
5. Cloudflare vous fournit **deux nameservers** du type :
   - `ada.ns.cloudflare.com`
   - `bart.ns.cloudflare.com`

**⚠️ Notez ces deux nameservers, vous en avez besoin à l'étape suivante.**

---

## Étape 3.2 — Mise à jour des nameservers chez Namecheap

**🎯 Objectif** : Faire pointer `inovamakers.io` vers les DNS Cloudflare depuis le panneau Namecheap (où le domaine est enregistré).

**Actions :**

1. Connectez-vous à votre compte [Namecheap](https://namecheap.com)
2. Allez dans **Domain List** → cliquez sur **Manage** à côté de `inovamakers.io`
3. Dans l'onglet **Nameservers**, sélectionnez **Custom DNS**
4. Entrez les deux nameservers Cloudflare de l'étape 3.1
5. Sauvegardez

**✅ Validation** (attendez 5 à 30 minutes pour la propagation) :

```bash
dig NS inovamakers.io +short
```

Résultat attendu : les nameservers Cloudflare apparaissent dans la réponse.

---

## Étape 3.3 — Création des enregistrements DNS dans Cloudflare

**🎯 Objectif** : Faire pointer le domaine et les sous-domaines vers votre VPS.

**Actions dans Cloudflare** (DNS → Add record) :

| Type | Nom | Contenu | Proxy | TTL |
|------|-----|---------|-------|-----|
| A | `@` | `203.161.43.215` | ✅ Orange (proxy) | Auto |
| A | `www` | `203.161.43.215` | ✅ Orange (proxy) | Auto |
| A | `api` | `203.161.43.215` | ✅ Orange (proxy) | Auto |
| A | `server1` | `203.161.43.215` | ❌ Gris (DNS only) | Auto |

Le proxy orange = trafic passe par Cloudflare (CDN + WAF + SSL).
Le record `server1` reste gris pour l'accès SSH direct sans proxy.

**✅ Validation** (après 5 à 15 minutes) :

```bash
dig A inovamakers.io +short
```

Résultat attendu : une IP Cloudflare (pas votre IP VPS — c'est normal avec le proxy activé).

---

# Phase 4 — Configuration Nginx (reverse proxy)

---

## Étape 4.1 — Configuration Nginx pour inovamakers.io (frontend)

**🎯 Objectif** : Servir le SPA React avec SPA fallback, cache statique et redirection www.

**🛠️ Commandes :**

```bash
sudo tee /etc/nginx/sites-available/inovamakers > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name inovamakers.io www.inovamakers.io;

    root /var/www/inovamakers/dist;
    index index.html;

    access_log /var/log/nginx/inovamakers_access.log;
    error_log /var/log/nginx/inovamakers_error.log;

    # SPA fallback : toutes les routes inconnues → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache long terme pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Interdire l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
    }

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
```

---

## Étape 4.2 — Préconfiguration Nginx pour api.inovamakers.io (backend futur)

**🎯 Objectif** : Bloc Nginx prêt pour l'API Express, en commentaire jusqu'au déploiement backend.

```bash
sudo tee /etc/nginx/sites-available/api-inovamakers > /dev/null <<'EOF'
# BLOC API — à activer lors du déploiement du backend Express
# Décommentez et retirez les # lorsque le backend est prêt.
#
# server {
#     listen 80;
#     listen [::]:80;
#     server_name api.inovamakers.io;
#
#     access_log /var/log/nginx/api_inovamakers_access.log;
#     error_log /var/log/nginx/api_inovamakers_error.log;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#         proxy_cache_bypass $http_upgrade;
#     }
# }
EOF
```

**Activation des sites et test :**

```bash
sudo ln -s /etc/nginx/sites-available/inovamakers /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**✅ Validation :**

```bash
sudo nginx -t
```

Résultat attendu : `nginx: configuration file /etc/nginx/nginx.conf test is successful`.

---

# Phase 5 — Déploiement manuel initial du frontend React

---

## Étape 5.1 — Cloner le repo et builder le projet

**🎯 Objectif** : Premier déploiement manuel pour valider la chaîne complète avant d'automatiser.

**🛠️ Commandes :**

```bash
cd /home/deploy
git clone https://github.com/VOTRE_USERNAME/inovamakers.git
cd inovamakers/frontend
npm install
npm run build
cp -r dist/* /var/www/inovamakers/dist/
```

Remplacez `VOTRE_USERNAME` par votre username GitHub réel.

**✅ Validation :**

```bash
ls /var/www/inovamakers/dist/
curl -I http://inovamakers.io
```

Résultat attendu : `index.html` et `assets/` présents, code HTTP `200 OK`.

**⚠️ Erreur fréquente** : `JavaScript heap out of memory` → le swap sauve la mise. Si ça persiste :

```bash
NODE_OPTIONS=--max-old-space-size=512 npm run build
```

---

# Phase 6 — Configuration SSL (HTTPS)

---

## Étape 6.1 — Installation de Certbot et obtention du certificat

**🎯 Objectif** : Certificat Let's Encrypt pour le VPS (SSL Full Strict Cloudflare).

**Important** : pour que Certbot valide le domaine, **désactivez temporairement le proxy Cloudflare** sur les enregistrements A `@`, `www` et `api` (passez-les en gris / DNS only).

Attendez 2 minutes après ce changement, puis :

```bash
sudo apt install certbot python3-certbot-nginx -y

sudo certbot --nginx \
  -d inovamakers.io \
  -d www.inovamakers.io \
  -d api.inovamakers.io \
  --non-interactive \
  --agree-tos \
  --email sergioahouangonou693@gmail.com \
  --redirect
```

Remplacez `votre@email.com` par votre vraie adresse email.

Une fois le certificat obtenu, **réactivez le proxy orange** dans Cloudflare pour `@`, `www` et `api`.

**✅ Validation :**

```bash
sudo certbot certificates
```

Résultat attendu : certificats valides pour `inovamakers.io`, `www.inovamakers.io`, `api.inovamakers.io`.

```bash
curl -I https://inovamakers.io
```

Résultat attendu : code `200 OK` via HTTPS.

---

## Étape 6.2 — Vérification du renouvellement automatique

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

Résultat attendu : `Active: active (waiting)` et `Congratulations, all simulated renewals succeeded`.

---

# Phase 7 — Configuration Cloudflare

---

## Étape 7.1 — Mode SSL Cloudflare

**Actions dans Cloudflare :**

- **SSL/TLS** → mode **Full (strict)**
- **Edge Certificates** → activer **Always Use HTTPS**
- **Edge Certificates** → activer **HSTS** (`max-age=31536000`, inclure les sous-domaines)
- **Edge Certificates** → activer **Automatic HTTPS Rewrites**

---

## Étape 7.2 — Sécurité et performance

**Security :**
- **WAF** → Managed ruleset Cloudflare activé (plan Free : protection de base)
- **Bots** → activer **Bot Fight Mode**

**Caching :**
- **Browser Cache TTL** → `4 hours`
- **Cache Level** → `Standard`

**Speed :**
- **Auto Minify** → activer HTML, CSS, JS
- **Brotli** → activer

**✅ Validation finale :**

Visitez `https://inovamakers.io` dans votre navigateur.

Résultat attendu : cadenas HTTPS, site affiché, aucune erreur de certificat.

Vérification via [SSL Labs](https://www.ssllabs.com/ssltest/) → entrez `inovamakers.io` → score attendu : **A** ou **A+**.

---

# Phase 8 — Pipeline CI/CD avec GitHub Actions

---

## Étape 8.1 — Génération de la clé SSH dédiée au CI/CD

**Sur votre machine locale :**

```bash
ssh-keygen -t ed25519 -C "github-actions-inovamakers" -f ~/.ssh/inovamakers_gha
```

Pas de passphrase (Entrée deux fois).

**Ajoutez la clé publique sur le VPS :**

```bash
cat ~/.ssh/inovamakers_gha.pub | ssh -i ~/.ssh/inovamakers_deploy deploy@203.161.43.215 \
  "cat >> ~/.ssh/authorized_keys"
```

**Affichez la clé privée** (à copier dans les secrets GitHub) :

```bash
cat ~/.ssh/inovamakers_gha
```

Copiez tout le contenu, de `-----BEGIN OPENSSH PRIVATE KEY-----` à `-----END OPENSSH PRIVATE KEY-----` inclus.

---

## Étape 8.2 — Configuration des GitHub Secrets

Dans votre repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** :

| Nom du secret | Valeur |
|---------------|--------|
| `VPS_HOST` | `203.161.43.215` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contenu complet de `~/.ssh/inovamakers_gha` (clé privée) |
| `VPS_PORT` | `22` |

---

## Étape 8.3 — Permission sudo pour reloader Nginx sans mot de passe

Sur le VPS :

```bash
echo "deploy ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx" | sudo tee /etc/sudoers.d/deploy-nginx
sudo chmod 440 /etc/sudoers.d/deploy-nginx
```

**✅ Validation :**

```bash
sudo systemctl reload nginx
```

Résultat attendu : aucune demande de mot de passe.

---

## Étape 8.4 — Création du workflow GitHub Actions

Sur votre machine locale, dans le repo :

```bash
mkdir -p .github/workflows
```

Créez le fichier `.github/workflows/deploy-frontend.yml` :

```yaml
name: Deploy Frontend — inovamakers.io

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'

jobs:
  deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build production
        run: |
          cd frontend
          npm run build

      - name: Deploy to VPS via SCP
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          source: "frontend/dist/*"
          target: "/var/www/inovamakers/dist/"
          strip_components: 2

      - name: Reload Nginx
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          script: sudo systemctl reload nginx
```

**Commitez et poussez :**

```bash
git add .github/workflows/deploy-frontend.yml
git commit -m "ci: add frontend deployment workflow"
git push origin main
```

**✅ Validation :**

- GitHub → **Actions** → le workflow se lance et passe en vert ✅
- Visitez `https://inovamakers.io` → le site est à jour

---

# Phase 9 — Tests de validation finale end-to-end

---

## Étape 9.1 — Checklist complète de validation

**Sécurité serveur :**

```bash
# Connexion SSH par clé uniquement
ssh -i ~/.ssh/inovamakers_deploy deploy@203.161.43.215

# Fail2ban actif
sudo fail2ban-client status sshd

# UFW actif
sudo ufw status verbose

# Ports ouverts (doit afficher uniquement 22, 80, 443)
sudo ss -tlnp
```

**Nginx, PM2 et MySQL :**

```bash
sudo systemctl status nginx
pm2 list
sudo systemctl status mysql
ls -la /var/www/inovamakers/dist/
curl -I http://localhost
```

**Domaine et SSL :**

```bash
# HTTPS fonctionnel
curl -I https://inovamakers.io

# Redirection HTTP → HTTPS
curl -I http://inovamakers.io

# Redirection www → non-www
curl -I http://www.inovamakers.io

# Certificat : dates de validité
echo | openssl s_client -connect inovamakers.io:443 2>/dev/null | openssl x509 -noout -dates
```

**CI/CD :**

1. Modifiez n'importe quel fichier dans `frontend/`
2. Committez et poussez sur `main`
3. GitHub Actions → vérifiez le déclenchement automatique et le succès

---

# Récapitulatif final

---

## GitHub Secrets à créer

| Secret | Description | Valeur |
|--------|-------------|--------|
| `VPS_HOST` | IP publique du VPS | `203.161.43.215` |
| `VPS_USER` | Utilisateur de déploiement | `deploy` |
| `VPS_SSH_KEY` | Clé privée SSH GitHub Actions | Contenu de `~/.ssh/inovamakers_gha` |
| `VPS_PORT` | Port SSH | `22` |

---

## Architecture finale déployée

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| DNS + CDN | Cloudflare (Free) | Proxy, WAF, cache, SSL edge |
| Serveur web | Nginx | Fichiers statiques React + SPA fallback |
| Gestionnaire de processus | PM2 | Prêt pour le backend Express (futur) |
| Base de données | MySQL 8.x | Prête pour le backend Express (futur) |
| SSL serveur | Let's Encrypt (Certbot) | Certificat pour SSL Full Strict Cloudflare |
| Sécurité OS | UFW + Fail2ban | Firewall + protection brute-force SSH |
| CI/CD | GitHub Actions | Build + déploiement automatique sur push main |
| Hébergement | VPS Namecheap Ubuntu 24.04 | Serveur physique |

---

## URLs finales

| URL | Comportement |
|-----|-------------|
| `https://inovamakers.io` | Site principal React (SPA) |
| `https://www.inovamakers.io` | Redirige vers `inovamakers.io` |
| `http://inovamakers.io` | Redirige automatiquement vers HTTPS |
| `https://api.inovamakers.io` | API Express — **à activer lors du déploiement backend** |
| `server1.inovamakers.io` | Accès SSH direct (DNS only, sans proxy Cloudflare) |

---

## Notes pour la suite — activation du backend Express

Lorsque votre backend Express sera prêt, voici les étapes à suivre :

1. **Déployer le backend** dans `/home/deploy/inovamakers/backend/`
2. **Démarrer avec PM2** : `pm2 start server.js --name inovamakers-api`
3. **Sauvegarder la config PM2** : `pm2 save`
4. **Activer le bloc Nginx API** : décommenter `/etc/nginx/sites-available/api-inovamakers`, créer le lien symbolique et recharger Nginx
5. **Ajouter le workflow GitHub Actions** pour le backend dans `.github/workflows/deploy-backend.yml`
6. **Ajouter les secrets backend** dans GitHub (variables d'environnement MySQL, JWT secret, etc.)

---

*Plan généré pour inovamakers.io — VPS Namecheap 203.161.43.215 — Ubuntu 24.04 LTS*
