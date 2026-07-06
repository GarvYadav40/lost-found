import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useProfile } from '../context/AuthContext';
import ItemForm from '../components/ItemForm';
import { createItem } from '../services/items';
import { uploadImage } from '../services/upload';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateItem = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

      const response = await createItem(api, payload);
      await refreshProfile();
      navigate(`/items/${response.data.id}`);
    } catch (err) {
      console.error('Error creating item:', err);
      const message =
        err.response?.data?.details?.[0]?.message ||
        err.response?.data?.error ||
        'Failed to create item. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Report an Item</h1>
          <p className="text-sm text-gray-500 mt-1">
            Share details about something you lost or found to help reunite it with its owner.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <ItemForm onSubmit={handleSubmit} submitLabel="Create Post" isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateItem;
