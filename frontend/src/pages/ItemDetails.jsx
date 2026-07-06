import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useApi } from '../hooks/useApi';
import axios from '../api/axios';
import { MapPin, Calendar, Tag, PhoneCall, User, Edit3, Trash2, ChevronLeft, RefreshCw } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { userId: clerkUserId } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/items/${id}`);
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Item not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await api.delete(`/api/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm text-gray-500 font-medium">Loading details...</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-6 text-sm font-medium">
          {error || 'Item not found'}
        </div>
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          <ChevronLeft className="h-4 w-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  const { title, description, category, status, imageUrl, location, date, contactInfo, user, createdAt } = item;
  const isLost = status === 'Lost';
  const isOwner = clerkUserId && user && user.clerkId === clerkUserId;

  const formattedItemDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedCreatedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Browse
      </Link>

      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2 bg-gray-50 h-80 md:h-auto min-h-[350px] relative flex items-center justify-center border-r border-gray-50">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <Tag className="h-16 w-16 mb-2 stroke-[1.2]" />
              <span className="text-sm">No image available</span>
            </div>
          )}
          <span className={`absolute top-4 left-4 px-3.5 py-1.5 text-xs font-bold rounded-full border shadow-sm ${
            isLost ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {status}
          </span>
        </div>

        {/* Right Column: Content Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-gray-100 px-2.5 py-0.5 rounded-md text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-xs text-gray-400 mt-1">Reported on {formattedCreatedDate}</p>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>

            <div className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Location</span>
                  <span>{location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Date</span>
                  <span>{formattedItemDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Contact Information</span>
                  <span>{contactInfo}</span>
                </div>
              </div>

              {user && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <User className="h-5 w-5 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Posted By</span>
                    <span className="font-semibold text-gray-800">{user.name}</span>
                    <span className="block text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Owner Authorized Actions */}
          {isOwner && (
            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
              <Link
                to={`/edit/${id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 border border-gray-200 hover:border-indigo-200 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Edit3 className="h-4 w-4" />
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
