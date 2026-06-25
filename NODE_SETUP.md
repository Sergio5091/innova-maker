# Setup Node.js — INOVA Makers

## Le problème rencontré

**Next.js 16 active Turbopack par défaut.** Turbopack utilise un binaire natif Rust
(`@next/swc-win32-x64-msvc`) qui cause un **Segmentation fault** sur cette machine
au moment de compiler la première page (`○ Compiling / ...`).

Le serveur démarrait (`✓ Ready`) mais crashait avant de pouvoir servir quoi que ce soit.

Ni changer de version de Node.js, ni les variables d'environnement ne pouvaient
désactiver Turbopack dans Next.js 16 — il l'ignore et le force quand même.

---

## La solution appliquée

**Downgrade de Next.js 16.1.6 → 15.3.3**

Next.js 15 utilise **webpack par défaut** — Turbopack est opt-in avec `--turbopack`.
Plus de binaire Rust natif, plus de segfault.

```json
"next": "15.3.3",
"react": "19.0.0",
"react-dom": "19.0.0"
```

---

## Comment lancer le projet

### Première fois (ou après un `git pull` avec changements de dépendances)

```bash
cd ~/Documents/innova-maker/frontend
npm install --legacy-peer-deps
```

### Lancer le serveur de développement

```bash
cd ~/Documents/innova-maker/frontend
npm run dev
```

Ouvre ensuite : http://localhost:3000

### Lancer le backend

```bash
cd ~/Documents/innova-maker/backend
npm run dev
```

API disponible sur : http://localhost:8000

---

## Node.js utilisé sur cette machine

Le Node.js par défaut de Laragon causait aussi le segfault.
Un Node.js portable (sans droits admin) a été configuré :

```
C:\Users\Sergio.ahouangonou\Downloads\node-v20.19.0-win-x64\node-v20.19.0-win-x64
```

Cette ligne est dans `~/.bashrc` :
```bash
export PATH="/c/Users/Sergio.ahouangonou/Downloads/node-v20.19.0-win-x64/node-v20.19.0-win-x64:$PATH"
```

> Si tu ouvres un nouveau terminal et que `node --version` ne répond pas,
> tape `source ~/.bashrc` pour recharger le PATH.

---

## Si le segfault revient un jour

1. Vérifier que Turbopack n'est pas activé : `next.config.mjs` ne doit pas contenir `experimental.turbo`
2. Ne jamais utiliser `next dev --turbopack`
3. Si Next.js est mis à jour vers une version qui force Turbopack, revenir à 15.x

---

## À faire pour avoir les droits admin (long terme)

Demander à l'IT d'installer **nvm-windows** :
- Télécharger `nvm-setup.exe` sur https://github.com/coreybutler/nvm-windows/releases
- Installer en admin
- `nvm install 20` puis `nvm use 20`

Cela remplacera proprement le Node.js Laragon et le Node.js portable.
