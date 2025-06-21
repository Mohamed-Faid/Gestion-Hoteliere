import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClients, updateClient } from '../../services/api.js';

function ClientEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    nationalite: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await getClients();
        const client = response.data.find((c) => c.id === parseInt(id));
        if (client) {
          setFormData({
            nom: client.nom,
            prenom: client.prenom,
            telephone: client.telephone || '',
            email: client.email || '',
            nationalite: client.nationalite || '',
          });
        } else {
          setError('Client not found');
        }
      } catch (err) {
        setError('Failed to fetch client');
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClient(id, formData);
      navigate('/clients');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update client');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nom">
            Last Name
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="prenom">
            First Name
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="telephone">
            Phone
          </label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nationalite">
            Nationality
          </label>
          <input
            type="text"
            name="nationalite"
            value={formData.nationalite}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Client
        </button>
      </div>
    </div>
  );
}

export default ClientEdit;