# 🚀 Guide de déploiement complet — Samuel Portfolio

## Structure finale de ton projet

```
Portfolio-Samuel/
├── index.html          ← ton portfolio
├── style.css
├── script.js           ← modifier API_URL ligne 10
├── images/
│   ├── PROFIL.jpg
│   ├── profil.png
│   ├── Cv-Samuel-FR.pdf   ← renomme ton CV français
│   └── Cv-Samuel-EN.pdf   ← renomme ton CV anglais
└── backend/
    ├── server.js
    ├── .env            ← tes secrets (NE PAS partager)
    ├── .gitignore
    ├── package.json
    ├── models/Contact.js
    ├── routes/contact.js
    └── services/emailService.js
```

---

## ⏱ Durée totale : environ 25 minutes

---

## ÉTAPE 1 — MongoDB Atlas (base de données gratuite)
**Durée : ~8 min**

1. Va sur **https://cloud.mongodb.com** → Crée un compte gratuit
2. Clique **"Build a Database"** → Choisis **M0 Free**
3. Provider : **AWS** — Région : **Europe (Paris)**
4. Dans **"Security Quickstart"** :
   - Username : `samuel`
   - Password : génère un mot de passe fort → **note-le**
5. **"Network Access"** → **"Add IP Address"** → **"Allow Access From Anywhere"** (`0.0.0.0/0`)
6. **"Database"** → **"Connect"** → **"Drivers"** → copie l'URI qui ressemble à :
   ```
   mongodb+srv://samuel:<password>@cluster0.xxxxx.mongodb.net/
   ```
7. Modifie l'URI ainsi (remplace `<password>` et ajoute `portfolio`) :
   ```
   mongodb+srv://samuel:TONMOTDEPASSE@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
8. Ouvre le fichier `backend/.env` et colle :
   ```
   MONGODB_URI=mongodb+srv://samuel:TONMOTDEPASSE@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

---

## ÉTAPE 2 — Gmail App Password (pour recevoir les emails)
**Durée : ~5 min**

1. Va sur **https://myaccount.google.com/security**
2. Active la **"Validation en 2 étapes"** si pas encore fait
3. Recherche **"Mots de passe des applications"** dans la barre de recherche
4. Application : sélectionne **"Autre"** → tape `Portfolio Node`
5. Clique **"Générer"** → note le mot de passe de 16 caractères
6. Dans `backend/.env`, remplis :
   ```
   GMAIL_USER=samuelchetk@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   EMAIL_TO=samuelchetk@gmail.com
   ```

---

## ÉTAPE 3 — Test en local
**Durée : ~3 min**

```bash
# Ouvre un terminal dans le dossier backend
cd backend
npm install
node server.js
```

Tu dois voir :
```
✅ MongoDB connecté
🚀 Serveur démarré sur http://localhost:3000
```

**Teste avec ton navigateur :**
Ouvre `http://localhost:3000/health` → tu dois voir `{"status":"ok",...}`

**Teste le formulaire :**
Ouvre ton `index.html` dans le navigateur (avec Live Server ou similaire),
remplis le formulaire → tu dois recevoir un email sur `samuelchetk@gmail.com`.

---

## ÉTAPE 4 — Déploiement Railway (hébergement gratuit)
**Durée : ~8 min**

### 4a. Push le backend sur GitHub

```bash
cd backend
git init
git add .
git commit -m "Backend portfolio Samuel"
```

Sur **https://github.com** → **New repository** → nomme-le `portfolio-backend` → **Create**

```bash
git remote add origin https://github.com/TON_USERNAME/portfolio-backend.git
git branch -M main
git push -u origin main
```

> ⚠️ Le fichier `.env` ne sera PAS uploadé (il est dans `.gitignore`) — c'est normal.

### 4b. Déployer sur Railway

1. Va sur **https://railway.app** → **"Start a New Project"**
2. **"Deploy from GitHub repo"** → connecte ton GitHub → sélectionne `portfolio-backend`
3. Railway détecte automatiquement Node.js → clique **"Deploy"**
4. Va dans **"Variables"** → ajoute ces 5 variables une par une :

   | Variable | Valeur |
   |----------|--------|
   | `MONGODB_URI` | ton URI MongoDB complet |
   | `GMAIL_USER` | `samuelchetk@gmail.com` |
   | `GMAIL_APP_PASSWORD` | ton mot de passe 16 caractères |
   | `EMAIL_TO` | `samuelchetk@gmail.com` |
   | `FRONTEND_URL` | `*` |
   | `ADMIN_KEY` | génère une clé secrète (ex: `samuel2026secret`) |

5. Railway redémarre automatiquement → attends 1-2 minutes
6. Clique sur ton projet → **"Settings"** → **"Domains"** → copie ton URL :
   ```
   https://portfolio-backend-xxxxx.up.railway.app
   ```

---

## ÉTAPE 5 — Connecter le frontend
**Durée : ~1 min**

Ouvre `script.js` — ligne 10, remplace :
```javascript
const API_URL = 'http://localhost:3000';
```
Par ton URL Railway :
```javascript
const API_URL = 'https://portfolio-backend-xxxxx.up.railway.app';
```

Sauvegarde. C'est terminé ✅

---

## ✅ Vérification finale

1. Ouvre ton portfolio → remplis le formulaire de contact
2. Tu dois recevoir un email de notification avec les détails du message
3. Le client reçoit un email de confirmation automatique
4. Va sur **cloud.mongodb.com** → ton cluster → **"Browse Collections"** → `portfolio` → `contacts` → tu vois le message enregistré

---

## 📊 Voir tous tes contacts enregistrés

Via MongoDB Atlas (interface graphique) :
- cloud.mongodb.com → ton cluster → Browse Collections → portfolio → contacts

Via l'API (terminal) :
```bash
curl https://portfolio-backend-xxxxx.up.railway.app/api/contact \
  -H "x-admin-key: samuel2026secret"
```

---

## 🆘 Problèmes fréquents

**"Failed to fetch" dans le formulaire**
→ Vérifie que `API_URL` dans `script.js` pointe bien vers ton URL Railway

**Pas d'email reçu**
→ Vérifie `GMAIL_APP_PASSWORD` (pas le mot de passe Gmail normal, le mot de passe d'application)
→ Vérifie que la validation en 2 étapes est activée sur ton compte Google

**Erreur MongoDB**
→ Vérifie que `0.0.0.0/0` est bien dans Network Access sur Atlas
→ Vérifie que le mot de passe dans l'URI est correct

**Railway ne démarre pas**
→ Clique sur "Deployments" → regarde les logs d'erreur
