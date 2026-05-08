import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useTheme } from '../../context/ThemeContext';
import { peminjamanApi, barangApi } from '../../api/barangApi';

const { Option } = Select;

const PeminjamanFormModal = ({ visible, onCancel, onSuccess, editingData }) => {
  const [form] = Form.useForm();
  const { isDark } = useTheme();
  const [barangList, setBarangList] = useState([]);
  const [loadingBarang, setLoadingBarang] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchBarang();
      if (editingData) {
        form.setFieldsValue({
          ...editingData,
          tanggal_pinjam: editingData.tanggal_pinjam ? dayjs(editingData.tanggal_pinjam) : null,
          tanggal_kembali: editingData.tanggal_kembali ? dayjs(editingData.tanggal_kembali) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingData, form]);

  const fetchBarang = async () => {
    setLoadingBarang(true);
    try {
      const res = await barangApi.getAll();
      setBarangList(res.data.data || []);
    } catch (error) {
      message.error('Gagal mengambil daftar barang');
    } finally {
      setLoadingBarang(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (values.tanggal_pinjam) {
        values.tanggal_pinjam = values.tanggal_pinjam.format('YYYY-MM-DD');
      }
      if (values.tanggal_kembali) {
        values.tanggal_kembali = values.tanggal_kembali.format('YYYY-MM-DD');
      }

      if (editingData) {
        await peminjamanApi.update(editingData.id_peminjaman, values);
        message.success('Data peminjaman berhasil diperbarui');
      } else {
        await peminjamanApi.create(values);
        message.success('Peminjaman baru berhasil ditambahkan');
      }
      
      onSuccess();
    } catch (error) {
      if (error.response) {
        message.error(`Gagal menyimpan: ${error.response.data.error || error.response.data.message}`);
      } else if (error.errorFields) {
        message.warning('Harap lengkapi form dengan benar');
      } else {
        message.error('Terjadi kesalahan saat menyimpan data');
      }
    }
  };

  return (
    <Modal
      title={editingData ? "Edit Peminjaman" : "Tambah Peminjaman Baru"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      okText="Simpan"
      cancelText="Batal"
      styles={{
        content: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
        },
        header: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderBottom: isDark ? '1px solid #374151' : '1px solid #f0f0f0',
          paddingBottom: 16,
        },
        title: {
          color: isDark ? '#ffffff' : '#000000',
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="kode_barang"
          label="Barang"
          rules={[{ required: true, message: 'Barang wajib dipilih' }]}
        >
          <Select 
            placeholder="Pilih barang"
            loading={loadingBarang}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={barangList.map(b => ({
              value: b.kode_barang,
              label: `${b.kode_barang} - ${b.nama_barang}`
            }))}
          />
        </Form.Item>

        <Form.Item
          name="nama_peminjam"
          label="Nama Peminjam"
          rules={[{ required: true, message: 'Nama peminjam wajib diisi' }]}
        >
          <Input placeholder="Masukkan nama peminjam" />
        </Form.Item>

        <Form.Item
          name="departemen"
          label="Departemen"
          rules={[{ required: true, message: 'Departemen wajib diisi' }]}
        >
          <Input placeholder="Contoh: IT, HRD, Marketing" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            name="jumlah_pinjam"
            label="Jumlah Pinjam"
            rules={[{ required: true, message: 'Jumlah pinjam wajib diisi' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
          </Form.Item>

          <Form.Item
            name="status_pinjam"
            label="Status Peminjaman"
            initialValue="dipinjam"
          >
            <Select>
              <Option value="dipinjam">Dipinjam</Option>
              <Option value="dikembalikan">Dikembalikan</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            name="tanggal_pinjam"
            label="Tanggal Pinjam"
            rules={[{ required: true, message: 'Tanggal pinjam wajib diisi' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="tanggal_kembali"
            label="Tanggal Kembali"
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Kosongkan jika belum" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default PeminjamanFormModal;
