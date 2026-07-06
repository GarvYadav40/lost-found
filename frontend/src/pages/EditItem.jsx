import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useProfile } from '../context/AuthContext';
import ItemForm from '../components/ItemForm';
import { fetchItemById, updateItem } from '../services/items';
import { uploadImage } from '../services/upload';
import { ChevronLeft, RefreshCw } from 'lucide-react';

const EditItem = () => {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchItemById(api, id);
        const item = response.data;

        setInitialData({
          title: item.title,
          description: item.description,
          category: item.category,
          status: item.status,
          location: item.location,
          date: new Date(item.date).toISOString().split('T')[0],
          contactInfo: item.contactInfo,
          imageUrl: item.imageUrl || '',
        });
      } catch (err) {
        console.error('Error loading item:', err);
        setError('Item not found or you do not have permission to edit it.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.imageUrl || '';

      if (formData.imageFile) {
        imageUrl = await uploadImage(api, formData.imageFile);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        location: formData.location,
        date: formData.date,
        contactInfo: formData.contactInfo,
        imageUrl: imageUrl || '',
      };

      await updateItem(api, id, payload);
      await refreshProfile();
      navigate(`/items/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
      const message =
        err.response?.data?.details?.[0]?.message ||
        err.response?.data?.error ||
        'Failed to update item. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm text-gray-500 font-medium">Loading item...</span>
      </div>
    );
  }

  if (error && !initialData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-6 text-sm font-medium">
          {error}
        </div>
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Link
        to={`/items/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Item
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Post</h1>
          <p className="text-sm text-gray-500 mt-1">Update the details of your lost or found item.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <ItemForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditItem;
