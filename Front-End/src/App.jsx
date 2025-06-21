import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import UserList from './components/Users/UserList.jsx';
import UserForm from './components/Users/UserForm.jsx';
import UserEdit from './components/Users/UserEdit.jsx';
import RoomList from './components/Rooms/RoomList.jsx';
import RoomForm from './components/Rooms/RoomForm.jsx';
import RoomEdit from './components/Rooms/RoomEdit.jsx';
import ClientList from './components/Clients/ClientList.jsx';
import ClientForm from './components/Clients/ClientForm.jsx';
import ClientEdit from './components/Clients/ClientEdit.jsx';
import ReservationList from './components/Reservations/ReservationList.jsx';
import ReservationForm from './components/Reservations/ReservationForm.jsx';
import ReservationEdit from './components/Reservations/ReservationEdit.jsx';
import ServiceList from './components/Services/ServiceList.jsx';
import ServiceForm from './components/Services/ServiceForm.jsx';
import ServiceEdit from './components/Services/ServiceEdit.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import Navbar from './components/Common/Navbar.jsx';
import Sidebar from './components/Common/Sidebar.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && <Navbar />}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ProtectedRoute adminOnly>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute adminOnly>
                  <UserEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <RoomList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/new"
              element={
                <ProtectedRoute>
                  <RoomForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id/edit"
              element={
                <ProtectedRoute>
                  <RoomEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <ClientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute>
                  <ClientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id/edit"
              element={
                <ProtectedRoute>
                  <ClientEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <ReservationList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations/new"
              element={
                <ProtectedRoute>
                  <ReservationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations/:id/edit"
              element={
                <ProtectedRoute>
                  <ReservationEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <ServiceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/new"
              element={
                <ProtectedRoute>
                  <ServiceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/:id/edit"
              element={
                <ProtectedRoute>
                  <ServiceEdit />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;