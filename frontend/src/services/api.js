import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send the HttpOnly cookie on every request
});

// If any response returns 401 (session expired / not authenticated),
// redirect to the login page so the user can re-authenticate.
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(err);
  }
);

export const studentsAPI = {
  getAll: () => api.get('/students'),
  getOne: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  getOne: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
};

export const analyticsAPI = {
  overview: () => api.get('/analytics/overview'),
  distribution: () => api.get('/analytics/distribution'),
  topBottom: () => api.get('/analytics/top-bottom'),
  subjectOverview: () => api.get('/analytics/subject-overview'),
  monthly: () => api.get('/analytics/monthly'),
  defaulters: (params) => api.get('/analytics/defaulters', { params }),
  student: (id) => api.get(`/analytics/student/${id}`),
  subject: (id) => api.get(`/analytics/subject/${id}`),
};

export default api;
