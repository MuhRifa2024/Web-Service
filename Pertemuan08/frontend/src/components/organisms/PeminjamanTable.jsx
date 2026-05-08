import { Table, Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PeminjamanStatusTag from '../atoms/PeminjamanStatusTag';

const PeminjamanTable = ({ data, loading, pagination, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_peminjaman',
      key: 'id_peminjaman',
      width: 70,
      align: 'center',
      sorter: (a, b) => a.id_peminjaman - b.id_peminjaman,
    },
    {
      title: 'Kode Barang',
      dataIndex: 'kode_barang',
      key: 'kode_barang',
      width: 120,
      render: (text) => <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'nama_barang',
      key: 'nama_barang',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Peminjam',
      dataIndex: 'nama_peminjam',
      key: 'nama_peminjam',
      width: 160,
      sorter: (a, b) => a.nama_peminjam.localeCompare(b.nama_peminjam),
    },
    {
      title: 'Departemen',
      dataIndex: 'departemen',
      key: 'departemen',
      width: 130,
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah_pinjam',
      key: 'jumlah_pinjam',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tgl Pinjam',
      dataIndex: 'tanggal_pinjam',
      key: 'tanggal_pinjam',
      width: 130,
      sorter: (a, b) => new Date(a.tanggal_pinjam) - new Date(b.tanggal_pinjam),
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      },
    },
    {
      title: 'Tgl Kembali',
      dataIndex: 'tanggal_kembali',
      key: 'tanggal_kembali',
      width: 130,
      render: (date) => {
        if (!date) return <span style={{ color: '#faad14', fontStyle: 'italic' }}>Belum kembali</span>;
        const d = new Date(date);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      },
    },
    {
      title: 'Status',
      dataIndex: 'status_pinjam',
      key: 'status_pinjam',
      width: 140,
      render: (status) => <PeminjamanStatusTag status={status} />,
    },
    {
      title: 'Aksi',
      key: 'aksi',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
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
                title="Hapus Data Peminjaman"
                description="Yakin ingin menghapus data ini?"
                onConfirm={() => onDelete(record.id_peminjaman)}
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
      rowKey="id_peminjaman"
      pagination={pagination !== false ? { pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} peminjaman` } : false}
      scroll={{ x: 1100 }}
      size="middle"
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
};

export default PeminjamanTable;
