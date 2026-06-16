import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};
export const studentsAPI = {
  getAll: (p) => api.get('/students', { params: p }),
  getById: (id) => api.get(`/students/${id}`),
  create: (d) => api.post('/students', d),
  update: (id, d) => api.put(`/students/${id}`, d),
  delete: (id) => api.delete(`/students/${id}`),
};
export const subjectsAPI = {
  getAll: (p) => api.get('/subjects', { params: p }),
  create: (d) => api.post('/subjects', d),
  update: (id, d) => api.put(`/subjects/${id}`, d),
  delete: (id) => api.delete(`/subjects/${id}`),
};
export const assignmentsAPI = {
  getAll: (p) => api.get('/assignments', { params: p }),
  create: (d) => api.post('/assignments', d),
  update: (id, d) => api.put(`/assignments/${id}`, d),
  delete: (id) => api.delete(`/assignments/${id}`),
};
export const materialsAPI = {
  getAll: (p) => api.get('/materials', { params: p }),
  create: (d) => api.post('/materials', d),
  update: (id, d) => api.put(`/materials/${id}`, d),
  delete: (id) => api.delete(`/materials/${id}`),
};
export const examsAPI = {
  getAll: (p) => api.get('/exams', { params: p }),
  create: (d) => api.post('/exams', d),
  update: (id, d) => api.put(`/exams/${id}`, d),
  delete: (id) => api.delete(`/exams/${id}`),
};
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  create: (d) => api.post('/announcements', d),
  update: (id, d) => api.put(`/announcements/${id}`, d),
  delete: (id) => api.delete(`/announcements/${id}`),
};
export const communityAPI = {
  getAll: () => api.get('/community'),
  create: (d) => api.post('/community', d),
  update: (id, d) => api.put(`/community/${id}`, d),
  delete: (id) => api.delete(`/community/${id}`),
};
export const enrollmentsAPI = {
  getAll: () => api.get('/enrollments'),
  create: (d) => api.post('/enrollments', d),
  delete: (d) => api.delete('/enrollments', { data: d }),
};

export default api;
