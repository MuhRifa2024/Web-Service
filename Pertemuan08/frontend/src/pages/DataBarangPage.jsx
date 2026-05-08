import { useState, useEffect, useMemo } from 'react';
import { Card, Typography, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BarangTable from '../components/organisms/BarangTable';
import SearchFilter from '../components/molecules/SearchFilter';
import BarangFormModal from '../components/organisms/BarangFormModal';
import { barangApi } from '../api/barangApi';
import { useTheme } from '../context/ThemeContext';

const { Title } = Typography;

const DataBarangPage = () => {
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
      const res = await barangApi.getAll();
      setData(res.data.data || []);
    } catch (error) {
      message.error('Gagal mengambil data barang');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (kode_barang) => {
    try {
      await barangApi.delete(kode_barang);
      message.success('Barang berhasil dihapus');
      fetchData();
    } catch (error) {
      message.error('Gagal menghapus barang');
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
      key: 'kategori',
      placeholder: 'Filter Kategori',
      options: [...new Set(data.map((d) => d.kategori))].map((k) => ({ value: k, label: k })),
    },
    {
      key: 'kondisi',
      placeholder: 'Filter Kondisi',
      options: [
        { value: 'Baik', label: 'Baik' },
        { value: 'Rusak Ringan', label: 'Rusak Ringan' },
        { value: 'Rusak Berat', label: 'Rusak Berat' },
      ],
    },
    {
      key: 'status',
      placeholder: 'Filter Status',
      options: [
        { value: 'tersedia', label: 'Tersedia' },
        { value: 'dipinjam', label: 'Dipinjam' },
        { value: 'dalam_perbaikan', label: 'Dalam Perbaikan' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      const matchesSearch = !searchText ||
        item.nama_barang.toLowerCase().includes(searchText.toLowerCase()) ||
        item.kode_barang.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.merek && item.merek.toLowerCase().includes(searchText.toLowerCase()));

      // Dropdown filters
      const matchesKategori = !filters.kategori || item.kategori === filters.kategori;
      const matchesKondisi = !filters.kondisi || item.kondisi === filters.kondisi;
      const matchesStatus = !filters.status || item.status === filters.status;

      return matchesSearch && matchesKategori && matchesKondisi && matchesStatus;
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
            Daftar Barang Inventaris
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
            Tambah Barang
          </Button>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <SearchFilter
            onSearch={setSearchText}
            filters={filterConfigs}
            onFilterChange={handleFilterChange}
            searchPlaceholder="Cari nama, kode, atau merek barang..."
          />
        </div>
        
        <BarangTable 
          data={filteredData} 
          loading={loading} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <BarangFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
        editingData={editingData}
        barangList={data}
      />
    </div>
  );
};

export default DataBarangPage;
