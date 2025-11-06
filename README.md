# Game Sales Sheets

Application de gestion des ventes de jeux pour un salon de jeux.

## Structure du projet

```
game-sales-sheets/
├── backend/          # API Backend (JSON Server)
├── src/              # Frontend React
└── package.json      # Configuration Frontend
```

## Installation

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
```

## Démarrage

### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Le serveur API démarre sur `http://localhost:3001`

### Frontend (Terminal 2)
```bash
npm run dev
```
L'application démarre sur `http://localhost:8080`

## Scripts disponibles

### Frontend
- `npm run dev` - Démarre le serveur de développement Vite
- `npm run build` - Build de production
- `npm run preview` - Prévisualise le build de production

### Backend
- `cd backend && npm run dev` - Démarre JSON Server en mode développement
- `cd backend && npm start` - Démarre JSON Server en mode production

## Technologies

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: JSON Server
- **Base de données**: db.json (dans le dossier backend)

## Configuration de l'API

L'URL de l'API backend est configurée automatiquement :
- **Développement** : `http://localhost:3001` (par défaut)
- **Production** : `https://backendgame-sales-sheets.onrender.com` (automatique en mode production)

Pour personnaliser l'URL, créez un fichier `.env` à la racine du projet :
```env
VITE_API_URL=https://backendgame-sales-sheets.onrender.com
```

## Déploiement

### Backend
Le backend est déployé sur Render : `https://backendgame-sales-sheets.onrender.com`

Pour déployer le backend :
1. Connectez votre repository GitHub à Render
2. Configurez le service avec :
   - **Build Command** : `cd backend && npm install`
   - **Start Command** : `cd backend && npm start`
   - **Root Directory** : `/` (racine du projet)

### Frontend
Le frontend peut être déployé sur n'importe quel service d'hébergement statique (Vercel, Netlify, etc.)

**Note** : En mode production, l'application utilise automatiquement l'URL du backend déployé. Aucune configuration supplémentaire n'est nécessaire.
