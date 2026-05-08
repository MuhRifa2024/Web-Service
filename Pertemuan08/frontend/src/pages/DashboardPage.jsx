import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table } from 'antd';
import {
  InboxOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import StatCard from '../components/molecules/StatCard';
import StatusTag from '../components/atoms/StatusTag';
import PeminjamanStatusTag from '../components/atoms/PeminjamanStatusTag';
import { barangApi, peminjamanApi } from '../api/barangApi';
import { useTheme } from '../context/ThemeContext';

const { Title } = Typography;

const DashboardPage = () => {
  const [barangData, setBarangData] = useState([]);
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [barangRes, peminjamanRes] = await Promise.all([
        barangApi.getAll(),
        peminjamanApi.getAll(),
      ]);
      setBarangData(barangRes.data.data || []);
      setPeminjamanData(peminjamanRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBarang = barangData.length;
  const kategoriSet = new Set(barangData.map((b) => b.kategori));
  const totalKategori = kategoriSet.size;
  const barangTersedia = barangData.filter((b) => b.status === 'tersedia').length;
  const peminjamanAktif = peminjamanData.filter((p) => p.status_pinjam === 'dipinjam').length;
  const totalNilaiAset = barangData.reduce((sum, b) => sum + (b.harga_satuan * b.jumlah), 0);

  const formatRupiah = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(value);

  const recentBarangColumns = [
    { title: 'Kode', dataIndex: 'kode_barang', key: 'kode_barang', width: 100,
      render: (t) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t}</span> },
    { title: 'Nama Barang', dataIndex: 'nama_barang', key: 'nama_barang', ellipsis: true },
    { title: 'Kategori', dataIndex: 'kategori', key: 'kategori', width: 130 },
    { title: 'Jumlah', dataIndex: 'jumlah', key: 'jumlah', width: 80, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 150, render: (s) => <StatusTag status={s} /> },
  ];

  const recentPeminjamanColumns = [
    { title: 'Peminjam', dataIndex: 'nama_peminjam', key: 'nama_peminjam' },
    { title: 'Barang', dataIndex: 'nama_barang', key: 'nama_barang', ellipsis: true, render: (t) => t || '-' },
    { title: 'Departemen', dataIndex: 'departemen', key: 'departemen', width: 120 },
    { title: 'Tgl Pinjam', dataIndex: 'tanggal_pinjam', key: 'tanggal_pinjam', width: 120,
      render: (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
    { title: 'Status', dataIndex: 'status_pinjam', key: 'status_pinjam', width: 140,
      render: (s) => <PeminjamanStatusTag status={s} /> },
  ];

  const cardStyle = {
    borderRadius: 12,
    border: 'none',
    background: isDark ? '#111827' : '#fff',
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="Total Barang" value={totalBarang} icon={<InboxOutlined />} color="#4F46E5" loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="Total Kategori" value={totalKategori} icon={<AppstoreOutlined />} color="#7C3AED" loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="Barang Tersedia" value={barangTersedia} icon={<CheckCircleOutlined />} color="#10B981" loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard title="Sedang Dipinjam" value={peminjamanAktif} icon={<SwapOutlined />} color="#F59E0B" loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="Nilai Aset" value={formatRupiah(totalNilaiAset)} icon={<DollarOutlined />} color="#EF4444" loading={loading} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Barang Terbaru</Title>} style={cardStyle} bodyStyle={{ padding: 0 }}>
            <Table
              columns={recentBarangColumns}
              dataSource={barangData.slice(0, 5)}
              loading={loading}
              rowKey="kode_barang"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Peminjaman Terbaru</Title>} style={cardStyle} bodyStyle={{ padding: 0 }}>
            <Table
              columns={recentPeminjamanColumns}
              dataSource={peminjamanData.slice(0, 5)}
              loading={loading}
              rowKey="id_peminjaman"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
