import { Tag } from 'antd';

const kondisiConfig = {
  'Baik': { color: '#52c41a' },
  'Rusak Ringan': { color: '#faad14' },
  'Rusak Berat': { color: '#ff4d4f' },
};

const KondisiBadge = ({ kondisi }) => {
  const config = kondisiConfig[kondisi] || { color: '#999' };
  return <Tag color={config.color}>{kondisi}</Tag>;
};

export default KondisiBadge;
