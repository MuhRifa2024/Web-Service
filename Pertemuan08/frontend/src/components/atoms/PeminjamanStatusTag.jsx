import { Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const statusConfig = {
  dipinjam: { color: 'orange', icon: <ClockCircleOutlined />, label: 'Dipinjam' },
  dikembalikan: { color: 'green', icon: <CheckCircleOutlined />, label: 'Dikembalikan' },
};

const PeminjamanStatusTag = ({ status }) => {
  const config = statusConfig[status] || { color: 'default', label: status };
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

export default PeminjamanStatusTag;
