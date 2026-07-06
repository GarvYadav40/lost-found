import { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { Upload, X, Tag } from 'lucide-react';

const defaultFormData = {
  title: '',
  description: '',
  category: '',
  status: 'Lost',
  location: '',
  date: '',
  contactInfo: '',
  imageUrl: '',
};

const ItemForm = ({ initialData, onSubmit, submitLabel, isSubmitting }) => {
  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Only JPG, PNG, and WebP images are allowed' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be smaller than 5MB' }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact info is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...formData,
      imageFile,
      imageUrl: formData.imageUrl || imagePreview || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Toggle */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Item Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Lost', 'Found'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, status: st }))}
              className={`py-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                formData.status === st
                  ? st === 'Lost'
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Black leather wallet"
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the item in detail..."
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
            errors.description ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
            errors.category ? 'border-red-300' : 'border-gray-200'
          }`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
      </div>

      {/* Location & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where was it lost/found?"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.location ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.date ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <label htmlFor="contactInfo" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Contact Information
        </label>
        <input
          id="contactInfo"
          name="contactInfo"
          type="text"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder="Email or phone number"
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.contactInfo ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {errors.contactInfo && <p className="text-xs text-red-600 mt-1">{errors.contactInfo}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Image (optional)
        </label>

        {imagePreview ? (
          <div className="relative w-full h-48 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-full shadow-sm border border-gray-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <Tag className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 font-medium">Click to upload an image</span>
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}

        {!imagePreview && (
          <label className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Choose file
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}

        {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ItemForm;
