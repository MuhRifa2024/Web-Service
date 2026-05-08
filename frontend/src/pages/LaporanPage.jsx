import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Spin, Empty } from 'antd';
import { InboxOutlined, SwapOutlined, CheckCircleOutlined, ToolOutlined, EnvironmentOutlined } from '@ant-design/icons';
import StatCard from '../components/molecules/StatCard';
import { barangApi, peminjamanApi } from '../api/barangApi';
import { useTheme } from '../context/ThemeContext';

const { Title } = Typography;
const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const LaporanPage = () => {
  const [barang, setBarang] = useState([]);
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    Promise.all([barangApi.getAll(), peminjamanApi.getAll()])
      .then(([b, p]) => { setBarang(b.data.data || []); setPeminjaman(p.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cs = { borderRadius: 12, border: 'none', background: isDark ? '#111827' : '#fff', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' };

  // Stats
  const tersedia = barang.filter(b => b.status === 'tersedia').length;
  const dipinjam = barang.filter(b => b.status === 'dipinjam').length;
  const perbaikan = barang.filter(b => b.status === 'dalam_perbaikan').length;
  const baik = barang.filter(b => b.kondisi === 'Baik').length;
  const rusakRingan = barang.filter(b => b.kondisi === 'Rusak Ringan').length;
  const rusakBerat = barang.filter(b => b.kondisi === 'Rusak Berat').length;
  const pinjamAktif = peminjaman.filter(p => p.status_pinjam === 'dipinjam').length;
  const pinjamSelesai = peminjaman.filter(p => p.status_pinjam === 'dikembalikan').length;
  const totalAset = barang.reduce((s, b) => s + b.harga_satuan * b.jumlah, 0);

  // Group by lokasi
  const byLokasi = barang.reduce((a, i) => { (a[i.lokasi] = a[i.lokasi] || []).push(i); return a; }, {});
  const lokasiData = Object.entries(byLokasi).map(([lokasi, items]) => ({
    lokasi, jumlah: items.length, totalUnit: items.reduce((s, i) => s + i.jumlah, 0),
    nilai: items.reduce((s, i) => s + i.harga_satuan * i.jumlah, 0),
  })).sort((a, b) => b.nilai - a.nilai);

  const statusCols = [
    { title: 'Status Barang', dataIndex: 'label', key: 'label' },
    { title: 'Jumlah', dataIndex: 'value', key: 'value', align: 'center' },
  ];
  const statusData = [
    { key: '1', label: 'Tersedia', value: tersedia },
    { key: '2', label: 'Dipinjam', value: dipinjam },
    { key: '3', label: 'Dalam Perbaikan', value: perbaikan },
  ];

  const kondisiCols = [
    { title: 'Kondisi', dataIndex: 'label', key: 'label' },
    { title: 'Jumlah', dataIndex: 'value', key: 'value', align: 'center' },
  ];
  const kondisiData = [
    { key: '1', label: 'Baik', value: baik },
    { key: '2', label: 'Rusak Ringan', value: rusakRingan },
    { key: '3', label: 'Rusak Berat', value: rusakBerat },
  ];

  const pinjamCols = [
    { title: 'Status Peminjaman', dataIndex: 'label', key: 'label' },
    { title: 'Jumlah', dataIndex: 'value', key: 'value', align: 'center' },
  ];
  const pinjamData = [
    { key: '1', label: 'Sedang Dipinjam', value: pinjamAktif },
    { key: '2', label: 'Sudah Dikembalikan', value: pinjamSelesai },
    { key: '3', label: 'Total Peminjaman', value: peminjaman.length },
  ];

  const lokasiCols = [
    { title: 'Lokasi', dataIndex: 'lokasi', key: 'lokasi' },
    { title: 'Jenis Barang', dataIndex: 'jumlah', key: 'jumlah', align: 'center' },
    { title: 'Total Unit', dataIndex: 'totalUnit', key: 'totalUnit', align: 'center' },
    { title: 'Nilai Aset', dataIndex: 'nilai', key: 'nilai', align: 'right', render: v => fmt(v) },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>;

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <StatCard title="Total Barang" value={barang.length} icon={<InboxOutlined />} color="#4F46E5" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Total Peminjaman" value={peminjaman.length} icon={<SwapOutlined />} color="#F59E0B" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Total Nilai Aset" value={fmt(totalAset)} icon={<CheckCircleOutlined />} color="#10B981" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Per Status Barang</Title>} style={cs} bodyStyle={{ padding: 0 }}>
            <Table columns={statusCols} dataSource={statusData} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Per Kondisi</Title>} style={cs} bodyStyle={{ padding: 0 }}>
            <Table columns={kondisiCols} dataSource={kondisiData} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Peminjaman</Title>} style={cs} bodyStyle={{ padding: 0 }}>
            <Table columns={pinjamCols} dataSource={pinjamData} pagination={false} size="small" />
          </Card>
        </Col>
      </Row>

      <Card title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined /><Title level={5} style={{ margin: 0 }}>Distribusi Per Lokasi</Title></div>} style={cs} bodyStyle={{ padding: 0 }}>
        <Table columns={lokasiCols} dataSource={lokasiData} rowKey="lokasi" pagination={false} size="small" />
      </Card>
    </div>
  );
};

export default LaporanPage;
