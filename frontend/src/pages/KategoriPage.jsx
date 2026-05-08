import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Tag, Empty, Spin } from 'antd';
import { LaptopOutlined, BuildOutlined, HighlightOutlined, ToolOutlined } from '@ant-design/icons';
import StatusTag from '../components/atoms/StatusTag';
import KondisiBadge from '../components/atoms/KondisiBadge';
import { barangApi } from '../api/barangApi';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

const icons = { 'Elektronik': <LaptopOutlined />, 'Furniture': <BuildOutlined />, 'ATK': <HighlightOutlined />, 'Peralatan Kantor': <ToolOutlined /> };
const colors = { 'Elektronik': '#4F46E5', 'Furniture': '#10B981', 'ATK': '#F59E0B', 'Peralatan Kantor': '#EF4444' };
const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const KategoriPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => { barangApi.getAll().then(r => { setData(r.data.data || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const grouped = data.reduce((a, i) => { (a[i.kategori] = a[i.kategori] || []).push(i); return a; }, {});
  const cs = { borderRadius: 12, border: 'none', background: isDark ? '#111827' : '#fff', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' };
  const cols = [
    { title: 'Kode', dataIndex: 'kode_barang', width: 100, render: t => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t}</span> },
    { title: 'Nama Barang', dataIndex: 'nama_barang', ellipsis: true },
    { title: 'Merek', dataIndex: 'merek', width: 120, render: t => t || '-' },
    { title: 'Jumlah', dataIndex: 'jumlah', width: 80, align: 'center' },
    { title: 'Kondisi', dataIndex: 'kondisi', width: 120, render: k => <KondisiBadge kondisi={k} /> },
    { title: 'Status', dataIndex: 'status', width: 150, render: s => <StatusTag status={s} /> },
    { title: 'Harga', dataIndex: 'harga_satuan', width: 140, align: 'right', render: v => fmt(v) },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>;
  if (!Object.keys(grouped).length) return <Empty description="Tidak ada data" />;

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {Object.entries(grouped).map(([k, items]) => (
          <Col xs={24} sm={12} md={6} key={k}>
            <Card style={{ ...cs, textAlign: 'center', borderTop: `3px solid ${colors[k] || '#999'}` }}>
              <div style={{ fontSize: 28, color: colors[k] || '#999', marginBottom: 8 }}>{icons[k] || <ToolOutlined />}</div>
              <Title level={5} style={{ margin: 0 }}>{k}</Title>
              <Text type="secondary">{items.length} barang</Text>
            </Card>
          </Col>
        ))}
      </Row>
      {Object.entries(grouped).map(([k, items]) => (
        <Card key={k} style={{ ...cs, marginBottom: 20 }} bodyStyle={{ padding: 0 }}
          title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: colors[k], fontSize: 18 }}>{icons[k]}</span>
            <Title level={5} style={{ margin: 0 }}>{k}</Title>
            <Tag color={colors[k]}>{items.length} barang</Tag>
          </div>}>
          <Table columns={cols} dataSource={items} rowKey="kode_barang" pagination={false} size="small" scroll={{ x: 800 }} />
        </Card>
      ))}
    </div>
  );
};

export default KategoriPage;
