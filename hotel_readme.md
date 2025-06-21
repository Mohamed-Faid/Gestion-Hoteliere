# Gestion Hôtelière 🏨

Une application web REST monolithique pour la gestion des réservations d'un hôtel, développée avec FastAPI pour le backend et React.js pour le frontend.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de la base de données](#configuration-de-la-base-de-données)
- [Démarrage de l'application](#démarrage-de-lapplication)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Contribution](#contribution)

## ✨ Fonctionnalités

- 🏨 Gestion des chambres et leurs disponibilités
- 📅 Système de réservation en ligne
- 👥 Gestion des clients
- 💰 Gestion des tarifs et facturation
- 📊 Tableau de bord administrateur
- 🔐 Authentification et autorisation
- 📱 Interface responsive

## 🛠 Technologies utilisées

### Backend
- **FastAPI** - Framework web moderne et rapide
- **SQLAlchemy** - ORM pour la gestion de base de données
- **PostgreSQL/MySQL** - Base de données relationnelle
- **Pydantic** - Validation des données
- **JWT** - Authentification

### Frontend
- **React.js** - Bibliothèque JavaScript pour l'interface utilisateur
- **Axios** - Client HTTP pour les requêtes API
- **React Router** - Navigation côté client
- **Material-UI/Tailwind CSS** - Framework CSS pour le design

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.8+**
- **Node.js 16+** et **npm**
- **MySQL**
- **Git**

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Mohamed-Faid/Gestion-Hoteliere.git
cd Gestion-Hoteliere
```

### 2. Configuration du Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows
venv\Scripts\activate
# Sur macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Configuration du Frontend

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances Node.js
npm install
```

## 🗃 Configuration de la base de données

### 1. Créer la base de données


**Pour MySQL :**
```sql
CREATE DATABASE gestion_hoteliere;
CREATE USER 'hotel_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON gestion_hoteliere.* TO 'hotel_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configuration des variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
# Configuration de la base de données
DATABASE_URL=postgresql://hotel_user:votre_mot_de_passe@localhost/gestion_hoteliere
# ou pour MySQL
# DATABASE_URL=mysql://hotel_user:votre_mot_de_passe@localhost/gestion_hoteliere

# Configuration JWT
SECRET_KEY=votre_clé_secrète_très_sécurisée
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuration de l'application
DEBUG=True
HOST=localhost
PORT=8000
```

### 3. Initialiser la base de données

```bash
# Depuis le dossier backend avec l'environnement virtuel activé
cd backend

# Créer les tables
python -m alembic upgrade head

# Ou si vous utilisez un script d'initialisation
python init_db.py
```

## 🚀 Démarrage de l'application

### 1. Démarrer le Backend (FastAPI)

```bash
# Depuis le dossier backend avec l'environnement virtuel activé
cd backend

# Démarrer le serveur de développement
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# L'API sera accessible sur http://localhost:8000
# Documentation automatique sur http://localhost:8000/docs
```

### 2. Démarrer le Frontend (React)

```bash
# Ouvrir un nouveau terminal et naviguer vers le dossier frontend
cd frontend

# Démarrer le serveur de développement
npm start

# L'application sera accessible sur http://localhost:3000
```

## 📁 Structure du projet

```
Gestion-Hoteliere/
├── backend/
│   ├── app/
│   │   ├── models/          # Modèles SQLAlchemy
│   │   ├── schemas/         # Schémas Pydantic
│   │   ├── crud/            # Opérations CRUD
│   │   ├── api/             # Endpoints API
│   │   ├── core/            # Configuration et sécurité
│   │   └── db/              # Configuration base de données
│   ├── alembic/             # Migrations de base de données
│   ├── requirements.txt     # Dépendances Python
│   ├── main.py             # Point d'entrée FastAPI
│   └── .env                # Variables d'environnement
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── utils/          # Utilitaires
│   │   └── styles/         # Styles CSS
│   ├── package.json        # Dépendances Node.js
│   └── .env                # Variables d'environnement frontend
└── README.md
```

## 📚 API Documentation

Une fois le backend démarré, vous pouvez accéder à :

- **Documentation interactive Swagger** : http://localhost:8000/docs
- **Documentation ReDoc** : http://localhost:8000/redoc

### Endpoints principaux

- `POST /auth/login` - Connexion utilisateur
- `GET /rooms` - Liste des chambres
- `POST /reservations` - Créer une réservation
- `GET /reservations/{id}` - Détails d'une réservation
- `PUT /reservations/{id}` - Modifier une réservation
- `DELETE /reservations/{id}` - Supprimer une réservation

## 🧪 Tests

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 🔧 Scripts utiles

### Backend
```bash
# Créer une migration
alembic revision --autogenerate -m "Description de la migration"

# Appliquer les migrations
alembic upgrade head

# Revenir à une migration précédente
alembic downgrade -1
```

### Frontend
```bash
# Build pour la production
npm run build

# Analyser le bundle
npm run analyze
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Mohamed Faid** - [GitHub](https://github.com/Mohamed-Faid)

## 🐛 Signaler un bug

Si vous trouvez un bug, veuillez créer une [issue](https://github.com/Mohamed-Faid/Gestion-Hoteliere/issues) avec :
- Une description claire du problème
- Les étapes pour reproduire le bug
- Votre environnement (OS, versions des outils)
- Des captures d'écran si nécessaire

---

⭐ N'hésitez pas à donner une étoile au projet si vous le trouvez utile !
