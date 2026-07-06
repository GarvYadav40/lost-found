import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { CATEGORIES } from '../constants/categories';
import ItemCard from '../components/ItemCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const Home = () => {
  const api = useApi();
  // Query States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // '' (All), 'Lost', 'Found'
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest', 'oldest'
  const [page, setPage] = useState(1);

  // Response States
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Items function
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        sort,
      };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;

      const response = await api.get('/api/items', { params });
      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Could not retrieve items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [api, page, search, status, category, sort]);

  // Fetch items on state change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-br from-indigo-50 to-white py-12 md:py-16 px-4 rounded-3xl border border-indigo-100 max-w-7xl mx-auto mt-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Lost something? <span className="text-indigo-600">Found something?</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          TraceBack is a modern community lost-and-found hub. Report lost items or reconnect found belongings with their rightful owners instantly.
        </p>

        {/* Quick Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-md border border-gray-150 p-2 max-w-3xl mx-auto flex flex-col md:flex-row gap-2"
        >
          <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-gray-100 py-1">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search title, category, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Search
          </button>
        </form>
      </section>

      {/* Main Browse Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['', 'Lost', 'Found'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatus(st);
                      setPage(1);
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      status === st
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {st === '' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Sort Order
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </aside>

          {/* Right Panel: Items Grid & Results */}
          <main className="flex-1 space-y-6">
            {/* Header / Stats */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                {loading ? 'Searching...' : `Showing ${pagination.totalItems} items`}
              </span>
            </div>

            {/* Loading / Error States */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                <span className="text-sm text-gray-500 font-medium">Loading items...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-6 text-center text-sm font-medium">
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl py-20 text-center space-y-3">
                <p className="text-gray-500 text-base font-semibold">No items match your criteria.</p>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Try adjusting your filters, clearing your search input, or reporting a new item!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrevPage}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                    pagination.hasPrevPage
                      ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 text-gray-300 border-gray-25 px-4 py-2 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex gap-1.5">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 text-sm font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        page === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNextPage}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                    pagination.hasNextPage
                      ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 text-gray-300 border-gray-25 px-4 py-2 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
