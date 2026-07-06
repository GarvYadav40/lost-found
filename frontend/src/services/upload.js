export const uploadImage = async (api, file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.imageUrl;
};
