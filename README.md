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

## Déploiement

### Frontend
Le frontend peut être déployé sur n'importe quel service d'hébergement statique (Vercel, Netlify, etc.)

### Backend
Le backend peut être déployé sur un service supportant Node.js (Heroku, Railway, etc.)

**Important**: N'oubliez pas de mettre à jour l'URL de l'API dans `src/lib/storage.ts` et `src/lib/auth.ts` lors du déploiement.
