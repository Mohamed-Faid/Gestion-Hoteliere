import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white h-full">
      <nav className="flex flex-col p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'p-2 bg-blue-600 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Dashboard
        </NavLink>
        {user.admin && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? 'p-2 bg-blue-600 rounded' : 'p-2 hover:bg-blue-600 rounded'
            }
          >
            Users
          </NavLink>
        )}
        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            isActive ? 'p-2 bg-blue-600 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Rooms
        </NavLink>
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            isActive ? 'p-2 bg-blue-600 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Clients
        </NavLink>
        <NavLink
          to="/reservations"
          className={({ isActive }) =>
            isActive ? 'p-2 bg-blue-600 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Reservations
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? 'p-2 bg-blue-600 rounded' : 'p-2 hover:bg-blue-600 rounded'
          }
        >
          Services
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;