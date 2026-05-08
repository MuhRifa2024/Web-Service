import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Descriptions, Spin, Button, message, Empty, Divider } from 'antd';
import {
  ArrowLeftOutlined,
  InboxOutlined,
  TagOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import StatusTag from '../components/atoms/StatusTag';
import KondisiBadge from '../components/atoms/KondisiBadge';
import { barangApi } from '../api/barangApi';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const DetailBarangPage = () => {
  const { kode } = useParams();
  const navigate = useNavigate();
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchBarang();
  }, [kode]);

  const fetchBarang = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await barangApi.getByKode(kode);
      setBarang(res.data.data);
    } catch (err) {
      setError(true);
      message.error('Barang tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    borderRadius: 16,
    border: 'none',
    background: isDark ? '#111827' : '#fff',
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
  };

  const headerGradient = isDark
    ? 'linear-gradient(135deg, #1e3a5f 0%, #1a1f2e 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" tip="Memuat data barang..." />
      </div>
    );
  }

  if (error || !barang) {
    return (
      <Card style={cardStyle}>
        <Empty
          description={
            <Text style={{ color: isDark ? '#9ca3af' : '#666' }}>
              Barang dengan kode <strong>{kode}</strong> tidak ditemukan
            </Text>
          }
        >
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/barang')}>
            Kembali ke Data Barang
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/barang')}
        style={{
          marginBottom: 16,
          color: isDark ? '#818cf8' : '#4F46E5',
          fontWeight: 600,
          fontSize: 15,
          padding: '4px 12px',
        }}
      >
        Kembali ke Data Barang
      </Button>

      {/* Header Card */}
      <Card
        style={{
          ...cardStyle,
          marginBottom: 20,
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            background: headerGradient,
            padding: '32px 32px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, right: 80,
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <InboxOutlined style={{ fontSize: 28, color: '#fff' }} />
            </div>
            <div>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'monospace', letterSpacing: 1 }}>
                {barang.kode_barang}
              </Text>
              <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                {barang.nama_barang}
              </Title>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20, position: 'relative', zIndex: 1 }}>
            <StatusTag status={barang.status} />
            <KondisiBadge kondisi={barang.kondisi} />
          </div>
        </div>

        {/* Detail Content */}
        <div style={{ padding: '28px 32px' }}>
          <Descriptions
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            size="middle"
            labelStyle={{
              fontWeight: 600,
              background: isDark ? '#1a2332' : '#fafafa',
              color: isDark ? '#d1d5db' : '#333',
              width: 180,
            }}
            contentStyle={{
              background: isDark ? '#111827' : '#fff',
              color: isDark ? '#e5e7eb' : '#333',
            }}
          >
            <Descriptions.Item
              label={<><TagOutlined style={{ marginRight: 6 }} />Kode Barang</>}
            >
              <Text strong style={{ fontFamily: 'monospace', fontSize: 14, color: isDark ? '#818cf8' : '#4F46E5' }}>
                {barang.kode_barang}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={<><InboxOutlined style={{ marginRight: 6 }} />Nama Barang</>}
            >
              {barang.nama_barang}
            </Descriptions.Item>

            <Descriptions.Item
              label={<><TagOutlined style={{ marginRight: 6 }} />Kategori</>}
            >
              {barang.kategori}
            </Descriptions.Item>

            <Descriptions.Item
              label={<><TagOutlined style={{ marginRight: 6 }} />Merek</>}
            >
              {barang.merek || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={<><InboxOutlined style={{ marginRight: 6 }} />Jumlah</>}
            >
              <Text strong style={{ fontSize: 16, color: isDark ? '#34d399' : '#10b981' }}>
                {barang.jumlah}
              </Text>
              <Text style={{ marginLeft: 4, color: isDark ? '#9ca3af' : '#999' }}>unit</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={<><EnvironmentOutlined style={{ marginRight: 6 }} />Lokasi</>}
            >
              {barang.lokasi}
            </Descriptions.Item>

            <Descriptions.Item
              label={<><CalendarOutlined style={{ marginRight: 6 }} />Tanggal Pengadaan</>}
            >
              {formatDate(barang.tanggal_pengadaan)}
            </Descriptions.Item>

            <Descriptions.Item
              label={<><DollarOutlined style={{ marginRight: 6 }} />Harga Satuan</>}
            >
              <Text strong style={{ color: isDark ? '#fbbf24' : '#d97706', fontSize: 15 }}>
                {formatRupiah(barang.harga_satuan)}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={<><DollarOutlined style={{ marginRight: 6 }} />Total Nilai</>}
            >
              <Text strong style={{ color: isDark ? '#f87171' : '#ef4444', fontSize: 15 }}>
                {formatRupiah(barang.harga_satuan * barang.jumlah)}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={<><InfoCircleOutlined style={{ marginRight: 6 }} />Kondisi</>}
            >
              <KondisiBadge kondisi={barang.kondisi} />
            </Descriptions.Item>

            <Descriptions.Item
              label={<><InfoCircleOutlined style={{ marginRight: 6 }} />Status</>}
            >
              <StatusTag status={barang.status} />
            </Descriptions.Item>

            <Descriptions.Item
              label={<><InfoCircleOutlined style={{ marginRight: 6 }} />Keterangan</>}
            >
              {barang.keterangan || '-'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </div>
  );
};

export default DetailBarangPage;
