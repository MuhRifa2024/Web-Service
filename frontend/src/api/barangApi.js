import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Barang API calls
export const barangApi = {
  getAll: () => API.get('/barang'),
  getByKode: (kode) => API.get(`/barang/${kode}`),
  create: (data) => API.post('/barang', data),
  update: (kode, data) => API.put(`/barang/${kode}`, data),
  delete: (kode) => API.delete(`/barang/${kode}`),
};

// Peminjaman API calls
export const peminjamanApi = {
  getAll: () => API.get('/peminjaman'),
  getById: (id) => API.get(`/peminjaman/${id}`),
  create: (data) => API.post('/peminjaman', data),
  update: (id, data) => API.put(`/peminjaman/${id}`, data),
  delete: (id) => API.delete(`/peminjaman/${id}`),
};

export default API;
