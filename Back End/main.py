from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
import mysql.connector
from mysql.connector import Error
import hashlib
import jwt
from passlib.context import CryptContext
import os

# Configuration
app = FastAPI(title="API Gestion Hôtelière", version="1.0.0")
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this to match your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Configuration base de données
DB_CONFIG = {
    'host': 'localhost',
    'database': 'gestion_hoteliere',
    'user': 'root',
    'password': ''  # À modifier selon votre configuration
}

SECRET_KEY = "ensi2025"  # À modifier pour la production
ALGORITHM = "HS256"

# Modèles Pydantic
class ChambreBase(BaseModel):
    numero: str
    type: str
    prix_nuit: float
    capacite: int
    etage: int
    statut: str = "disponible"
    derniere_maintenance: Optional[date] = None

class ChambreCreate(ChambreBase):
    pass

class ChambreUpdate(BaseModel):
    numero: Optional[str] = None
    type: Optional[str] = None
    prix_nuit: Optional[float] = None
    capacite: Optional[int] = None
    etage: Optional[int] = None
    statut: Optional[str] = None
    derniere_maintenance: Optional[date] = None

class Chambre(ChambreBase):
    id: int

    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    nom: str
    prenom: str
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    nationalite: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    nationalite: Optional[str] = None

class Client(ClientBase):
    id: int
    date_inscription: date

    class Config:
        from_attributes = True

class UtilisateurBase(BaseModel):
    email: EmailStr
    nom: str
    prenom: str
    admin: bool = False

class UtilisateurCreate(UtilisateurBase):
    motdepasse: str

class UtilisateurUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nom: Optional[str] = None
    prenom: Optional[str] = None
    admin: Optional[bool] = None
    motdepasse: Optional[str] = None

class Utilisateur(UtilisateurBase):
    id: int

    class Config:
        from_attributes = True

class ReservationBase(BaseModel):
    client_id: int
    chambre_id: int
    date_arrivee: date
    date_depart: date
    nombre_personnes: int
    prix_total: Optional[float] = None
    statut: str = "confirmee"
    observations: Optional[str] = None

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    client_id: Optional[int] = None
    chambre_id: Optional[int] = None
    date_arrivee: Optional[date] = None
    date_depart: Optional[date] = None
    nombre_personnes: Optional[int] = None
    prix_total: Optional[float] = None
    statut: Optional[str] = None
    observations: Optional[str] = None

class Reservation(ReservationBase):
    id: int
    utilisateur_id: int
    date_reservation: datetime

    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    reservation_id: int
    type_service: str
    description: Optional[str] = None
    prix: float
    date_service: date
    statut: str = "demande"

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    reservation_id: Optional[int] = None
    type_service: Optional[str] = None
    description: Optional[str] = None
    prix: Optional[float] = None
    date_service: Optional[date] = None
    statut: Optional[str] = None

class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    motdepasse: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Fonctions utilitaires
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur de connexion à la base de données: {str(e)}")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

# Endpoints d'authentification
@app.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM utilisateurs WHERE email = %s", (login_data.email,))
        user = cursor.fetchone()
        
        if not user or not verify_password(login_data.motdepasse, user['motdepasse']):
            raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
        
        access_token = create_access_token({"user_id": user['id'], "admin": user['admin']})
        return {"access_token": access_token, "token_type": "bearer"}
    
    finally:
        cursor.close()
        conn.close()

# CRUD Chambres
@app.get("/chambres", response_model=List[Chambre])
async def get_chambres(current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM chambres")
        chambres = cursor.fetchall()
        return chambres
    finally:
        cursor.close()
        conn.close()

@app.get("/chambres/{chambre_id}", response_model=Chambre)
async def get_chambre(chambre_id: int, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM chambres WHERE id = %s", (chambre_id,))
        chambre = cursor.fetchone()
        if not chambre:
            raise HTTPException(status_code=404, detail="Chambre non trouvée")
        return chambre
    finally:
        cursor.close()
        conn.close()

@app.post("/chambres", response_model=Chambre)
async def create_chambre(chambre: ChambreCreate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        insert_query = """
        INSERT INTO chambres (numero, type, prix_nuit, capacite, etage, statut, derniere_maintenance)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            chambre.numero, chambre.type, chambre.prix_nuit, chambre.capacite,
            chambre.etage, chambre.statut, chambre.derniere_maintenance
        ))
        conn.commit()
        
        cursor.execute("SELECT * FROM chambres WHERE id = %s", (cursor.lastrowid,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

@app.put("/chambres/{chambre_id}", response_model=Chambre)
async def update_chambre(chambre_id: int, chambre: ChambreUpdate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Vérifier si la chambre existe
        cursor.execute("SELECT * FROM chambres WHERE id = %s", (chambre_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Chambre non trouvée")
        
        # Construire la requête de mise à jour
        update_fields = []
        values = []
        
        for field, value in chambre.dict(exclude_unset=True).items():
            update_fields.append(f"{field} = %s")
            values.append(value)
        
        if update_fields:
            values.append(chambre_id)
            update_query = f"UPDATE chambres SET {', '.join(update_fields)} WHERE id = %s"
            cursor.execute(update_query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM chambres WHERE id = %s", (chambre_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

@app.delete("/chambres/{chambre_id}")
async def delete_chambre(chambre_id: int, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM chambres WHERE id = %s", (chambre_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Chambre non trouvée")
        
        cursor.execute("DELETE FROM chambres WHERE id = %s", (chambre_id,))
        conn.commit()
        return {"message": "Chambre supprimée avec succès"}
    finally:
        cursor.close()
        conn.close()

# CRUD Clients
@app.get("/clients", response_model=List[Client])
async def get_clients(current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM clients")
        clients = cursor.fetchall()
        return clients
    finally:
        cursor.close()
        conn.close()

@app.get("/clients/{client_id}", response_model=Client)
async def get_client(client_id: int, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
        client = cursor.fetchone()
        if not client:
            raise HTTPException(status_code=404, detail="Client non trouvé")
        return client
    finally:
        cursor.close()
        conn.close()

@app.post("/clients", response_model=Client)
async def create_client(client: ClientCreate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        insert_query = """
        INSERT INTO clients (nom, prenom, telephone, email, nationalite)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            client.nom, client.prenom, client.telephone, client.email, client.nationalite
        ))
        conn.commit()
        
        cursor.execute("SELECT * FROM clients WHERE id = %s", (cursor.lastrowid,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

@app.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: int, client: ClientUpdate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Client non trouvé")
        
        update_fields = []
        values = []
        
        for field, value in client.dict(exclude_unset=True).items():
            update_fields.append(f"{field} = %s")
            values.append(value)
        
        if update_fields:
            values.append(client_id)
            update_query = f"UPDATE clients SET {', '.join(update_fields)} WHERE id = %s"
            cursor.execute(update_query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

@app.delete("/clients/{client_id}")
async def delete_client(client_id: int, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM clients WHERE id = %s", (client_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Client non trouvé")
        
        cursor.execute("DELETE FROM clients WHERE id = %s", (client_id,))
        conn.commit()
        return {"message": "Client supprimé avec succès"}
    finally:
        cursor.close()
        conn.close()

# CRUD Utilisateurs
@app.get("/utilisateurs", response_model=List[Utilisateur])
async def get_utilisateurs(current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT id, email, nom, prenom, admin FROM utilisateurs")
        utilisateurs = cursor.fetchall()
        return utilisateurs
    finally:
        cursor.close()
        conn.close()

@app.post("/utilisateurs", response_model=Utilisateur)
async def create_utilisateur(utilisateur: UtilisateurCreate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        hashed_password = hash_password(utilisateur.motdepasse)
        insert_query = """
        INSERT INTO utilisateurs (email, motdepasse, nom, prenom, admin)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            utilisateur.email, hashed_password, utilisateur.nom, utilisateur.prenom, utilisateur.admin
        ))
        conn.commit()
        
        cursor.execute("SELECT id, email, nom, prenom, admin FROM utilisateurs WHERE id = %s", (cursor.lastrowid,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

# CRUD Réservations
@app.get("/reservations", response_model=List[Reservation])
async def get_reservations(current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM reservations")
        reservations = cursor.fetchall()
        return reservations
    finally:
        cursor.close()
        conn.close()

@app.post("/reservations", response_model=Reservation)
async def create_reservation(reservation: ReservationCreate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        insert_query = """
        INSERT INTO reservations (client_id, chambre_id, utilisateur_id, date_arrivee, date_depart, 
                                nombre_personnes, prix_total, statut, observations)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            reservation.client_id, reservation.chambre_id, current_user, reservation.date_arrivee,
            reservation.date_depart, reservation.nombre_personnes, reservation.prix_total,
            reservation.statut, reservation.observations
        ))
        conn.commit()
        
        cursor.execute("SELECT * FROM reservations WHERE id = %s", (cursor.lastrowid,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

@app.put("/reservations/{reservation_id}", response_model=Reservation)
async def update_reservation(reservation_id: int, reservation: ReservationUpdate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM reservations WHERE id = %s", (reservation_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Réservation non trouvée")
        
        update_fields = []
        values = []
        
        for field, value in reservation.dict(exclude_unset=True).items():
            update_fields.append(f"{field} = %s")
            values.append(value)
        
        if update_fields:
            values.append(reservation_id)
            update_query = f"UPDATE reservations SET {', '.join(update_fields)} WHERE id = %s"
            cursor.execute(update_query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM reservations WHERE id = %s", (reservation_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

# CRUD Services additionnels
@app.get("/services", response_model=List[Service])
async def get_services(current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM services_additionnels")
        services = cursor.fetchall()
        return services
    finally:
        cursor.close()
        conn.close()

@app.post("/services", response_model=Service)
async def create_service(service: ServiceCreate, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        insert_query = """
        INSERT INTO services_additionnels (reservation_id, type_service, description, prix, date_service, statut)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            service.reservation_id, service.type_service, service.description,
            service.prix, service.date_service, service.statut
        ))
        conn.commit()
        
        cursor.execute("SELECT * FROM services_additionnels WHERE id = %s", (cursor.lastrowid,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

# Endpoints spéciaux
@app.get("/chambres/disponibles/{date_debut}/{date_fin}")
async def get_chambres_disponibles(date_debut: date, date_fin: date, current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
        SELECT * FROM chambres 
        WHERE statut = 'disponible' 
        AND id NOT IN (
            SELECT chambre_id FROM reservations 
            WHERE (date_arrivee <= %s AND date_depart >= %s)
            AND statut IN ('confirmee', 'arrivee')
        )
        """
        cursor.execute(query, (date_fin, date_debut))
        chambres = cursor.fetchall()
        return chambres
    finally:
        cursor.close()
        conn.close()

@app.get("/dashboard/stats")
async def get_dashboard_stats(current_user: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        stats = {}
        
        # Nombre total de chambres
        cursor.execute("SELECT COUNT(*) as total FROM chambres")
        stats['total_chambres'] = cursor.fetchone()['total']
        
        # Chambres occupées
        cursor.execute("SELECT COUNT(*) as occupees FROM chambres WHERE statut = 'occupee'")
        stats['chambres_occupees'] = cursor.fetchone()['occupees']
        
        # Réservations aujourd'hui
        cursor.execute("SELECT COUNT(*) as today FROM reservations WHERE DATE(date_reservation) = CURDATE()")
        stats['reservations_today'] = cursor.fetchone()['today']
        
        # Revenus du mois
        cursor.execute("""
        SELECT COALESCE(SUM(prix_total), 0) as revenus 
        FROM reservations 
        WHERE MONTH(date_reservation) = MONTH(CURDATE()) 
        AND YEAR(date_reservation) = YEAR(CURDATE())
        """)
        stats['revenus_mois'] = cursor.fetchone()['revenus']
        
        return stats
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)