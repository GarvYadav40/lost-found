import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { PlusCircle, Edit, Trash2, Tag, MapPin, Calendar, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const api = useApi();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dashboard/items');
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching dashboard items:', err);
      setError('Failed to load your posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/items/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your reported lost and found items.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Create New Post
        </Link>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
          <span className="text-sm text-gray-500 font-medium">Loading your posts...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-6 text-center text-sm font-medium">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-2xl py-20 text-center space-y-4 max-w-xl mx-auto">
          <p className="text-gray-500 text-base font-semibold">You haven't posted any items yet.</p>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Report lost belongings or register things you've found to display them here.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const isLost = item.status === 'Lost';
            const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
              >
                {/* Image & Status Badge */}
                <div className="h-40 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="h-8 w-8 text-gray-400 stroke-[1.5]" />
                  )}
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-3xs font-bold rounded-full border shadow-sm ${
                      isLost
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-4xs font-bold text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-900 line-clamp-1 mt-1 text-sm">
                      {item.title}
                    </h3>
                  </div>

                  <div className="space-y-1 text-3xs text-gray-500 border-t border-gray-50 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 mt-2">
                    <Link
                      to={`/edit/${item.id}`}
                      className="inline-flex items-center justify-center gap-1 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 border border-gray-250 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
