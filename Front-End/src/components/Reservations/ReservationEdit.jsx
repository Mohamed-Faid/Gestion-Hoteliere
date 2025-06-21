import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReservations, updateReservation, getClients, getAvailableRooms } from '../../services/api.js';

function ReservationEdit() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const resResponse = await getReservations();
        const reservation = resResponse.data.find((r) => r.id === parseInt(id));
        if (reservation) {
          setFormData({
            client_id: reservation.client_id,
            chambre_id: reservation.chambre_id,
            date_arrivee: reservation.date_arrivee,
            date_depart: reservation.date_depart,
            nombre_personnes: reservation.nombre_personnes,
            prix_total: reservation.prix_total || '',
            statut: reservation.statut,
            observations: reservation.observations || '',
          });
        } else {
          setError('Reservation not found');
        }

        const clientsRes = await getClients();
        setClients(clientsRes.data);

        if (reservation?.date_arrivee && reservation?.date_depart) {
          const roomsRes = await getAvailableRooms(
            reservation.date_arrivee,
            reservation.date_depart
          );
          setRooms(roomsRes.data);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'date_arrivee' || name === 'date_depart') {
      try {
        const roomsRes = await getAvailableRooms(
          name === 'date_arrivee' ? value : formData.date_arrivee,
          name === 'date_depart' ? value : formData.date_depart
        );
        setRooms(roomsRes.data);
      } catch (err) {
        setError('Failed to fetch available rooms');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReservation(id, {
        ...formData,
        client_id: parseInt(formData.client_id) || null,
        chambre_id: parseInt(formData.chambre_id) || null,
        nombre_personnes: parseInt(formData.nombre_personnes) || null,
        prix_total: parseFloat(formData.prix_total) || null,
      });
      navigate('/reservations');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update reservation');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Reservation</h1>
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
            onChange={handleDateChange}
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
            onChange={handleDateChange}
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
          Update Reservation
        </button>
      </div>
    </div>
  );
}

export default ReservationEdit;