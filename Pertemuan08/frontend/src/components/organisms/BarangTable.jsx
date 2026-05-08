import { Table, Tooltip, Button, Space, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StatusTag from '../atoms/StatusTag';
import KondisiBadge from '../atoms/KondisiBadge';

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const BarangTable = ({ data, loading, pagination, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Kode',
      dataIndex: 'kode_barang',
      key: 'kode_barang',
      width: 110,
      sorter: (a, b) => a.kode_barang.localeCompare(b.kode_barang),
      render: (text) => <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'nama_barang',
      key: 'nama_barang',
      ellipsis: true,
      sorter: (a, b) => a.nama_barang.localeCompare(b.nama_barang),
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
      width: 140,
      sorter: (a, b) => a.kategori.localeCompare(b.kategori),
    },
    {
      title: 'Merek',
      dataIndex: 'merek',
      key: 'merek',
      width: 130,
      render: (text) => text || '-',
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
      width: 90,
      align: 'center',
      sorter: (a, b) => a.jumlah - b.jumlah,
    },
    {
      title: 'Lokasi',
      dataIndex: 'lokasi',
      key: 'lokasi',
      width: 150,
    },
    {
      title: 'Kondisi',
      dataIndex: 'kondisi',
      key: 'kondisi',
      width: 130,
      render: (kondisi) => <KondisiBadge kondisi={kondisi} />,
    },
    {
      title: 'Harga Satuan',
      dataIndex: 'harga_satuan',
      key: 'harga_satuan',
      width: 150,
      align: 'right',
      sorter: (a, b) => a.harga_satuan - b.harga_satuan,
      render: (value) => formatRupiah(value),
    },
    {
      title: 'Tgl Pengadaan',
      dataIndex: 'tanggal_pengadaan',
      key: 'tanggal_pengadaan',
      width: 130,
      sorter: (a, b) => new Date(a.tanggal_pengadaan) - new Date(b.tanggal_pengadaan),
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      key: 'keterangan',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text || '-'}
        </Tooltip>
      ),
    },
    {
      title: 'Aksi',
      key: 'aksi',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Detail">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/barang/${record.kode_barang}`)}
              style={{ color: '#4F46E5' }}
            />
          </Tooltip>
          {onEdit && (
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                style={{ color: '#10B981' }}
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Hapus">
              <Popconfirm
                title="Hapus Data Barang"
                description="Yakin ingin menghapus barang ini?"
                onConfirm={() => onDelete(record.kode_barang)}
                okText="Ya, Hapus"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="kode_barang"
      pagination={pagination !== false ? { pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} barang` } : false}
      scroll={{ x: 1600 }}
      size="middle"
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
};

export default BarangTable;
