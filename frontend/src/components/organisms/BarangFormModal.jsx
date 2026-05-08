import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useTheme } from '../../context/ThemeContext';
import { barangApi } from '../../api/barangApi';

const { Option } = Select;
const { TextArea } = Input;

const BarangFormModal = ({ visible, onCancel, onSuccess, editingData, barangList }) => {
  const [form] = Form.useForm();
  const { isDark } = useTheme();

  useEffect(() => {
    if (visible) {
      if (editingData) {
        // Populate form for editing
        form.setFieldsValue({
          ...editingData,
          tanggal_pengadaan: editingData.tanggal_pengadaan ? dayjs(editingData.tanggal_pengadaan) : null,
        });
      } else {
        form.resetFields();
        // Generate Auto Code
        let nextCode = 'INV-001';
        if (barangList && barangList.length > 0) {
          const codes = barangList
            .map(b => b.kode_barang)
            .filter(code => code && code.startsWith('INV-'))
            .map(code => parseInt(code.replace('INV-', ''), 10))
            .filter(num => !isNaN(num));
            
          if (codes.length > 0) {
            const maxCode = Math.max(...codes);
            nextCode = `INV-${String(maxCode + 1).padStart(3, '0')}`;
          }
        }
        form.setFieldsValue({ kode_barang: nextCode });
      }
    }
  }, [visible, editingData, form, barangList]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format date back to string
      if (values.tanggal_pengadaan) {
        values.tanggal_pengadaan = values.tanggal_pengadaan.format('YYYY-MM-DD');
      }

      if (editingData) {
        await barangApi.update(editingData.kode_barang, values);
        message.success('Data barang berhasil diperbarui');
      } else {
        await barangApi.create(values);
        message.success('Barang baru berhasil ditambahkan');
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
      title={editingData ? "Edit Data Barang" : "Tambah Barang Baru"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            name="kode_barang"
            label="Kode Barang"
            rules={[{ required: true, message: 'Kode barang wajib diisi' }]}
          >
            <Input disabled={!!editingData} placeholder="Contoh: INV-001" />
          </Form.Item>

          <Form.Item
            name="nama_barang"
            label="Nama Barang"
            rules={[{ required: true, message: 'Nama barang wajib diisi' }]}
          >
            <Input placeholder="Masukkan nama barang" />
          </Form.Item>

          <Form.Item
            name="kategori"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori wajib dipilih' }]}
          >
            <Select placeholder="Pilih kategori">
              <Option value="Elektronik">Elektronik</Option>
              <Option value="Furniture">Furniture</Option>
              <Option value="ATK">ATK</Option>
              <Option value="Peralatan Kantor">Peralatan Kantor</Option>
              <Option value="Lainnya">Lainnya</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="merek"
            label="Merek"
          >
            <Input placeholder="Masukkan merek (opsional)" />
          </Form.Item>

          <Form.Item
            name="jumlah"
            label="Jumlah"
            rules={[{ required: true, message: 'Jumlah wajib diisi' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>

          <Form.Item
            name="harga_satuan"
            label="Harga Satuan (Rp)"
            rules={[{ required: true, message: 'Harga satuan wajib diisi' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="lokasi"
            label="Lokasi"
            rules={[{ required: true, message: 'Lokasi wajib diisi' }]}
          >
            <Input placeholder="Contoh: Ruang IT" />
          </Form.Item>

          <Form.Item
            name="tanggal_pengadaan"
            label="Tanggal Pengadaan"
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="kondisi"
            label="Kondisi"
            rules={[{ required: true, message: 'Kondisi wajib dipilih' }]}
          >
            <Select placeholder="Pilih kondisi">
              <Option value="Baik">Baik</Option>
              <Option value="Rusak Ringan">Rusak Ringan</Option>
              <Option value="Rusak Berat">Rusak Berat</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="tersedia"
          >
            <Select>
              <Option value="tersedia">Tersedia</Option>
              <Option value="dipinjam">Dipinjam</Option>
              <Option value="dalam_perbaikan">Dalam Perbaikan</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="keterangan"
          label="Keterangan"
        >
          <TextArea rows={3} placeholder="Tambahkan keterangan jika ada..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BarangFormModal;
