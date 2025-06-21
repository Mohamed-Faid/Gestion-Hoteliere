# Hotel Management Frontend

A React-based frontend application for managing a hotel system, interfacing with a FastAPI backend. Features include user authentication, user management (admin-only), room management, client management, reservations, and additional services.

## Prerequisites

- Node.js (v16 or higher)
- Backend API running at `http://localhost:8000` (see backend documentation)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hotel-management-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- **Authentication**: Login with email and password, JWT-based.
- **User Management**: Admins can create, edit, and delete users.
- **Room Management**: Create, edit, delete, and view rooms with availability checks.
- **Client Management**: Manage client information.
- **Reservations**: Create and manage reservations with available room filtering.
- **Services**: Add and manage additional services for reservations.
- **Dashboard**: View key statistics (total rooms, occupied rooms, etc.).

## Project Structure

```
hotel-management-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── Auth/
│   │   ├── Common/
│   │   ├── Dashboard/
│   │   ├── Users/
│   │   ├── Rooms/
│   │   ├── Clients/
│   │   ├── Reservations/
│   │   ├── Services/
│   ├── contexts/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── package.json
└── README.md
```

## Usage

1. Access the app at `http://localhost:3000`.
2. Log in with valid credentials.
3. Navigate through the sidebar to manage users, rooms, clients, reservations, or services.
4. Admins have exclusive access to user management.

## Notes

- Ensure the backend API is running and accessible.
- Update `API_URL` in `src/services/api.js` if the backend is hosted elsewhere.
- Use environment variables for sensitive data in production.

## License

MIT License