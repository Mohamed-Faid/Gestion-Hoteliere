import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRooms, updateRoom } from '../../services/api.js';

function RoomEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    numero: '',
    type: '',
    prix_nuit: '',
    capacite: '',
    etage: '',
    statut: 'disponible',
    derniere_maintenance: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await getRooms();
        const room = response.data.find((r) => r.id === parseInt(id));
        if (room) {
          setFormData({
            numero: room.numero,
            type: room.type,
            prix_nuit: room.prix_nuit,
            capacite: room.capacite,
            etage: room.etage,
            statut: room.statut,
            derniere_maintenance: room.derniere_maintenance || '',
          });
        } else {
          setError('Room not found');
        }
      } catch (err) {
        setError('Failed to fetch room');
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRoom(id, {
        ...formData,
        prix_nuit: parseFloat(formData.prix_nuit) || null,
        capacite: parseInt(formData.capacite) || null,
        etage: parseInt(formData.etage) || null,
        derniere_maintenance: formData.derniere_maintenance || null,
      });
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update room');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Room</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="numero">
            Room Number
          </label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="type">
            Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="prix_nuit">
            Price per Night
          </label>
          <input
            type="number"
            name="prix_nuit"
            value={formData.prix_nuit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="capacite">
            Capacity
          </label>
          <input
            type="number"
            name="capacite"
            value={formData.capacite}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="etage">
            Floor
          </label>
          <input
            type="number"
            name="etage"
            value={formData.etage}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="statut">
            Status
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="disponible">Available</option>
            <option value="occupee">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 mb-2"
            htmlFor="derniere_maintenance"
          >
            Last Maintenance
          </label>
          <input
            type="date"
            name="derniere_maintenance"
            value={formData.derniere_maintenance}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Room
        </button>
      </div>
    </div>
  );
}

export default RoomEdit;