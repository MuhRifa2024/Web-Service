import { useState, useEffect, useMemo } from 'react';
import { Card, Typography, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PeminjamanTable from '../components/organisms/PeminjamanTable';
import SearchFilter from '../components/molecules/SearchFilter';
import PeminjamanFormModal from '../components/organisms/PeminjamanFormModal';
import { peminjamanApi } from '../api/barangApi';
import { useTheme } from '../context/ThemeContext';

const { Title } = Typography;

const PeminjamanPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({});
  const { isDark } = useTheme();

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await peminjamanApi.getAll();
      setData(res.data.data || []);
    } catch (error) {
      message.error('Gagal mengambil data peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await peminjamanApi.delete(id);
      message.success('Data peminjaman berhasil dihapus');
      fetchData();
    } catch (error) {
      message.error('Gagal menghapus data peminjaman');
    }
  };

  const handleEdit = (record) => {
    setEditingData(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingData(null);
    setIsModalVisible(true);
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    fetchData();
  };

  const filterConfigs = [
    {
      key: 'status_pinjam',
      placeholder: 'Filter Status',
      options: [
        { value: 'dipinjam', label: 'Dipinjam' },
        { value: 'dikembalikan', label: 'Dikembalikan' },
      ],
    },
    {
      key: 'departemen',
      placeholder: 'Filter Departemen',
      options: [...new Set(data.map((d) => d.departemen))].map((dep) => ({ value: dep, label: dep })),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = !searchText ||
        item.nama_peminjam.toLowerCase().includes(searchText.toLowerCase()) ||
        item.kode_barang.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.nama_barang && item.nama_barang.toLowerCase().includes(searchText.toLowerCase()));

      const matchesStatus = !filters.status_pinjam || item.status_pinjam === filters.status_pinjam;
      const matchesDepartemen = !filters.departemen || item.departemen === filters.departemen;

      return matchesSearch && matchesStatus && matchesDepartemen;
    });
  }, [data, searchText, filters]);

  return (
    <div>
      <Card style={{
        borderRadius: 12,
        border: 'none',
        background: isDark ? '#111827' : '#fff',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            Data Peminjaman Barang
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            }}
          >
            Tambah Peminjaman
          </Button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <SearchFilter
            onSearch={setSearchText}
            filters={filterConfigs}
            onFilterChange={handleFilterChange}
            searchPlaceholder="Cari nama peminjam, kode, atau nama barang..."
          />
        </div>
        <PeminjamanTable 
          data={filteredData} 
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <PeminjamanFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
        editingData={editingData}
      />
    </div>
  );
};

export default PeminjamanPage;
