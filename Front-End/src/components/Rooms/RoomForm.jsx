import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../services/api.js';

function RoomForm() {
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoom({
        ...formData,
        prix_nuit: parseFloat(formData.prix_nuit),
        capacite: parseInt(formData.capacite),
        etage: parseInt(formData.etage),
        derniere_maintenance: formData.derniere_maintenance || null,
      });
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create room');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>
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
          Create Room
        </button>
      </div>
    </div>
  );
}

export default RoomForm;