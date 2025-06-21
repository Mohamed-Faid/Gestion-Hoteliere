import { useState, useEffect } from 'react';
import { getReservations, deleteReservation } from '../../services/api.js';
import { Link } from 'react-router-dom';

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await getReservations();
        setReservations(response.data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await deleteReservation(id);
        setReservations(reservations.filter((res) => res.id !== id));
      } catch (error) {
        console.error('Failed to delete reservation:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Link
          to="/reservations/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Reservation
        </Link>
      </div>
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Client ID</th>
            <th className="p-3 text-left">Room ID</th>
            <th className="p-3 text-left">Check-in</th>
            <th className="p-3 text-left">Check-out</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="border-t">
              <td className="p-3">{res.client_id}</td>
              <td className="p-3">{res.chambre_id}</td>
              <td className="p-3">{res.date_arrivee}</td>
              <td className="p-3">{res.date_depart}</td>
              <td className="p-3">{res.statut}</td>
              <td className="p-3">
                <Link
                  to={`/reservations/${res.id}/edit`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationList;