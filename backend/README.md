# Backend - Game Sales Sheets API

Backend API utilisant JSON Server pour gérer les données des ventes de jeux.

## Installation

```bash
npm install
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur le port 3001.

## Endpoints

- `GET /games` - Liste tous les jeux
- `POST /games` - Créer un nouveau jeu
- `GET /games/:id` - Obtenir un jeu par ID
- `PUT /games/:id` - Mettre à jour un jeu
- `DELETE /games/:id` - Supprimer un jeu

- `GET /sheets` - Liste toutes les feuilles de vente
- `POST /sheets` - Créer une nouvelle feuille
- `GET /sheets/:id` - Obtenir une feuille par ID
- `PUT /sheets/:id` - Mettre à jour une feuille
- `DELETE /sheets/:id` - Supprimer une feuille

- `GET /users` - Liste tous les utilisateurs
- `POST /users` - Créer un nouvel utilisateur
- `GET /users/:id` - Obtenir un utilisateur par ID
- `PUT /users/:id` - Mettre à jour un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

## Données

Les données sont stockées dans `db.json` et sont automatiquement sauvegardées lors des modifications.

