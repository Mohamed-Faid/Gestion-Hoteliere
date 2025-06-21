import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Hotel Management</div>
      <div className="flex items-center">
        <span className="mr-4">Welcome, {user?.admin ? 'Admin' : 'User'}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;