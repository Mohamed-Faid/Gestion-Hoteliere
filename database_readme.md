# Configuration de la Base de Données MySQL 🗃️

Ce guide vous explique comment créer et configurer la base de données MySQL pour l'application **Gestion Hôtelière**.

## 📋 Prérequis

- **MySQL 8.0+** ou **MariaDB 10.4+**
- Accès administrateur à MySQL
- Client MySQL (MySQL Workbench, phpMyAdmin, ou ligne de commande)

## 🚀 Installation et Configuration

### 1. Connexion à MySQL

```bash
# Via ligne de commande
mysql -u root -p

# Ou utilisez votre client MySQL préféré (Workbench, phpMyAdmin, etc.)
```

### 2. Création de la Base de Données

```sql
-- Créer la base de données
CREATE DATABASE gestion_hoteliere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE gestion_hoteliere;
```

### 3. Création des Tables

#### Table `utilisateurs`
```sql
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    motdepasse VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `clients`
```sql
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    nationalite VARCHAR(50),
    date_inscription DATE DEFAULT (CURRENT_DATE)
);
```

#### Table `chambres`
```sql
CREATE TABLE chambres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    type ENUM('simple', 'double', 'triple', 'suite', 'deluxe') NOT NULL,
    prix_nuit DECIMAL(10,2) NOT NULL,
    capacite INT NOT NULL,
    etage INT NOT NULL,
    statut ENUM('disponible', 'occupee', 'maintenance', 'nettoyage') DEFAULT 'disponible',
    derniere_maintenance DATE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `reservations`
```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    chambre_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    nombre_personnes INT NOT NULL,
    prix_total DECIMAL(10,2),
    statut ENUM('confirmee', 'arrivee', 'terminee', 'annulee') DEFAULT 'confirmee',
    observations TEXT,
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    FOREIGN KEY (chambre_id) REFERENCES chambres(id) ON DELETE RESTRICT,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE RESTRICT
);
```

#### Table `services_additionnels`
```sql
CREATE TABLE services_additionnels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    type_service ENUM('spa', 'restaurant', 'blanchisserie', 'transport', 'excursion', 'autre') NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    date_service DATE NOT NULL,
    statut ENUM('demande', 'confirme', 'termine', 'annule') DEFAULT 'demande',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);
```

### 4. Création des Index (Optionnel mais Recommandé)

```sql
-- Index pour améliorer les performances
CREATE INDEX idx_reservations_dates ON reservations(date_arrivee, date_depart);
CREATE INDEX idx_reservations_client ON reservations(client_id);
CREATE INDEX idx_reservations_chambre ON reservations(chambre_id);
CREATE INDEX idx_chambres_statut ON chambres(statut);
CREATE INDEX idx_clients_email ON clients(email);
```

### 5. Données d'Exemple (Optionnel)

```sql
-- Utilisateur administrateur par défaut
INSERT INTO utilisateurs (email, motdepasse, nom, prenom, admin) VALUES 
('admin@hotel.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2LJMj7QW2q', 'Admin', 'Hotel', TRUE);
-- Mot de passe: admin123

-- Chambres d'exemple
INSERT INTO chambres (numero, type, prix_nuit, capacite, etage) VALUES 
('101', 'simple', 80.00, 1, 1),
('102', 'double', 120.00, 2, 1),
('201', 'triple', 150.00, 3, 2),
('301', 'suite', 250.00, 4, 3),
('302', 'deluxe', 350.00, 2, 3);

-- Clients d'exemple
INSERT INTO clients (nom, prenom, telephone, email, nationalite) VALUES 
('Dupont', 'Jean', '+33123456789', 'jean.dupont@email.com', 'Française'),
('Smith', 'John', '+1234567890', 'john.smith@email.com', 'Américaine'),
('Hassan', 'Ahmed', '+212654321098', 'ahmed.hassan@email.com', 'Marocaine');
```

## ⚙️ Configuration de l'Application

### Fichier `.env` (Backend)
Créez un fichier `.env` dans le dossier backend avec :

```env
# Configuration MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestion_hoteliere
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

# Configuration JWT
SECRET_KEY=votre_clé_secrète_très_sécurisée
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuration de l'application
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Mise à jour du code (main.py)
Modifiez la configuration dans `main.py` :

```python
# Configuration base de données
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'database': os.getenv('DB_NAME', 'gestion_hoteliere'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '')
}
```

## 🔧 Vérification de l'Installation

### 1. Test de Connexion
```sql
-- Vérifier les tables créées
SHOW TABLES;

-- Vérifier la structure d'une table
DESCRIBE chambres;

-- Compter les enregistrements
SELECT COUNT(*) FROM chambres;
```

### 2. Test avec l'Application
```bash
# Démarrer le backend
cd backend
uvicorn main:app --reload

# Tester l'endpoint de login
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@hotel.com", "motdepasse": "admin123"}'
```

## 🛡️ Sécurité

### Recommandations de Production
1. **Créer un utilisateur dédié** (ne pas utiliser root) :
```sql
CREATE USER 'hotel_app'@'localhost' IDENTIFIED BY 'mot_de_passe_sécurisé';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_hoteliere.* TO 'hotel_app'@'localhost';
FLUSH PRIVILEGES;
```

2. **Sauvegardes régulières** :
```bash
# Sauvegarde complète
mysqldump -u root -p gestion_hoteliere > backup_$(date +%Y%m%d).sql

# Restauration
mysql -u root -p gestion_hoteliere < backup_20241201.sql
```

## 🚨 Dépannage

### Erreurs Courantes

**Erreur de connexion :**
- Vérifiez que MySQL est démarré
- Vérifiez les paramètres de connexion
- Vérifiez les permissions utilisateur

**Erreur de charset :**
```sql
ALTER DATABASE gestion_hoteliere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Tables manquantes :**
- Réexécutez les scripts de création
- Vérifiez les erreurs dans les logs MySQL

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs MySQL : `/var/log/mysql/error.log`
2. Consultez la documentation MySQL
3. Créez une issue sur le repository GitHub

---

📝 **Note :** Ce script est optimisé pour MySQL 8.0+. Pour des versions antérieures, certaines syntaxes peuvent nécessiter des ajustements.