import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServices, updateService, getReservations } from '../../services/api.js';

function ServiceEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    reservation_id: '',
    type_service: '',
    description: '',
    prix: '',
    date_service: '',
    statut: 'demande',
  });
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const serviceResponse = await getServices();
        const service = serviceResponse.data.find((s) => s.id === parseInt(id));
        if (service) {
          setFormData({
            reservation_id: service.reservation_id,
            type_service: service.type_service,
            description: service.description || '',
            prix: service.prix,
            date_service: service.date_service,
            statut: service.statut,
          });
        } else {
          setError('Service not found');
        }

        const reservationsRes = await getReservations();
        setReservations(reservationsRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch data');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateService(id, {
        ...formData,
        reservation_id: parseInt(formData.reservation_id) || null,
        prix: parseFloat(formData.prix) || null,
      });
      navigate('/services');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update service');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="reservation_id">
            Reservation
          </label>
          <select
            name="reservation_id"
            value={formData.reservation_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Reservation</option>
            {reservations.map((res) => (
              <option key={res.id} value={res.id}>
                Reservation {res.id} (Client ID: {res.client_id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="type_service">
            Service Type
          </label>
          <input
            type="text"
            name="type_service"
            value={formData.type_service}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="prix">
            Price
          </label>
          <input
            type="number"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date_service">
            Service Date
          </label>
          <input
            type="date"
            name="date_service"
            value={formData.date_service}
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
            <option value="demande">Requested</option>
            <option value="confirme">Confirmed</option>
            <option value="termine">Completed</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Service
        </button>
      </div>
    </div>
  );
}

export default ServiceEdit;