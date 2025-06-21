import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReservation, getClients, getAvailableRooms } from '../../services/api.js';

function ReservationForm() {
  const [formData, setFormData] = useState({
    client_id: '',
    chambre_id: '',
    date_arrivee: '',
    date_depart: '',
    nombre_personnes: '',
    prix_total: '',
    statut: 'confirmee',
    observations: '',
  });
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const clientsRes = await getClients();
        setClients(clientsRes.data);
        if (formData.date_arrivee && formData.date_depart) {
          const roomsRes = await getAvailableRooms(
            formData.date_arrivee,
            formData.date_depart
          );
          setRooms(roomsRes.data);
        }
      } catch (err) {
        setError('Failed to fetch data');
      }
    }
    fetchData();
  }, [formData.date_arrivee, formData.date_depart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReservation({
        ...formData,
        client_id: parseInt(formData.client_id),
        chambre_id: parseInt(formData.chambre_id),
        nombre_personnes: parseInt(formData.nombre_personnes),
        prix_total: parseFloat(formData.prix_total) || null,
      });
      navigate('/reservations');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create reservation');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Reservation</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="client_id">
            Client
          </label>
          <select
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {`${client.nom} ${client.prenom}`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date_arrivee">
            Check-in Date
          </label>
          <input
            type="date"
            name="date_arrivee"
            value={formData.date_arrivee}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date_depart">
            Check-out Date
          </label>
          <input
            type="date"
            name="date_depart"
            value={formData.date_depart}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="chambre_id">
            Room
          </label>
          <select
            name="chambre_id"
            value={formData.chambre_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {`Room ${room.numero} (${room.type})`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nombre_personnes">
            Number of Guests
          </label>
          <input
            type="number"
            name="nombre_personnes"
            value={formData.nombre_personnes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="prix_total">
            Total Price
          </label>
          <input
            type="number"
            name="prix_total"
            value={formData.prix_total}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
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
            <option value="confirmee">Confirmed</option>
            <option value="arrivee">Arrived</option>
            <option value="annulee">Cancelled</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="observations">
            Observations
          </label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          ></textarea>
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Reservation
        </button>
      </div>
    </div>
  );
}

export default ReservationForm;