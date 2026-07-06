import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';

const ItemCard = ({ item }) => {
  const { id, title, description, category, status, imageUrl, location, date } = item;

  const isLost = status === 'Lost';
  const statusColors = isLost
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {/* Image Preview */}
      <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Tag className="h-10 w-10 mb-2 stroke-[1.5]" />
            <span className="text-xs">No image provided</span>
          </div>
        )}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors} shadow-sm`}
        >
          {status}
        </span>
      </div>

      {/* Item Body */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
            {category}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        {/* Metadata */}
        <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-50 pt-4 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Link
          to={`/items/${id}`}
          className="w-full text-center inline-flex items-center justify-center bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:border-indigo-200 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
