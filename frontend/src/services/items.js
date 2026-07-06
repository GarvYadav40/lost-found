export const fetchItems = (apiClient, params) => apiClient.get('/api/items', { params });

export const fetchItemById = (apiClient, id) => apiClient.get(`/api/items/${id}`);

export const createItem = (apiClient, data) => apiClient.post('/api/items', data);

export const updateItem = (apiClient, id, data) => apiClient.put(`/api/items/${id}`, data);

export const deleteItem = (apiClient, id) => apiClient.delete(`/api/items/${id}`);

export const fetchDashboardItems = (apiClient) => apiClient.get('/api/dashboard/items');
