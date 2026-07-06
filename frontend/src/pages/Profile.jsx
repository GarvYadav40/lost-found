import { Link } from 'react-router-dom';
import { useProfile } from '../context/AuthContext';
import { User, Mail, Calendar, ClipboardList, Tag, RefreshCw } from 'lucide-react';

const Profile = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm text-gray-500 font-medium">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-sm">Unable to load profile. Please try again later.</p>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const stats = [
    { label: 'Total Posts', value: profile.stats.totalPosts, icon: ClipboardList, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Lost Items', value: profile.stats.lostPosts, icon: Tag, color: 'text-red-600 bg-red-50' },
    { label: 'Found Items', value: profile.stats.foundPosts, icon: Tag, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Your account information and activity summary.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-indigo-600" />
            )}
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/dashboard"
          className="flex-1 text-center bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 border border-gray-200 hover:border-indigo-200 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          View My Posts
        </Link>
        <Link
          to="/create"
          className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          Report New Item
        </Link>
      </div>
    </div>
  );
};

export default Profile;
