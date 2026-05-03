const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('ep_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// Normalize a MongoDB event doc to match the shape the frontend expects
export const normalizeEvent = (event) => ({
  ...event,
  id: event._id,
  tags: event.tags || [],
  rating: event.rating || 4.5,
  reviews: event.reviews || 0,
  originalPrice: event.originalPrice ?? event.price,
  featured: event.featured || false,
  city: event.city || event.location?.split(',')[0] || 'UAE',
  status: event.status || 'upcoming',
});

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
};

export const eventsAPI = {
  getAll: async () => {
    const data = await request('/events');
    return data.map(normalizeEvent);
  },
  getOne: async (id) => {
    const data = await request(`/events/${id}`);
    return normalizeEvent(data);
  },
  create: (eventData) =>
    request('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  update: (id, eventData) =>
    request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};

export const bookingsAPI = {
  create: (bookingData) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMy: () => request('/bookings/my'),
  getAll: () => request('/bookings'),
  cancel: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' }),
};

export const adminAPI = {
  getUsers: () => request('/admin/users'),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  getStats: () => request('/admin/stats'),
};

export const categoriesAPI = {
  getAll: () => request('/categories'),
};
