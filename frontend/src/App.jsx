import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import DataBarangPage from './pages/DataBarangPage';
import DetailBarangPage from './pages/DetailBarangPage';
import PeminjamanPage from './pages/PeminjamanPage';
import KategoriPage from './pages/KategoriPage';
import LaporanPage from './pages/LaporanPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/barang" element={<DataBarangPage />} />
            <Route path="/barang/:kode" element={<DetailBarangPage />} />
            <Route path="/peminjaman" element={<PeminjamanPage />} />
            <Route path="/kategori" element={<KategoriPage />} />
            <Route path="/laporan" element={<LaporanPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
