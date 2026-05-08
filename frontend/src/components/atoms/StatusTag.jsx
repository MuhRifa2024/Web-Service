import { Tag } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ToolOutlined } from '@ant-design/icons';

const statusConfig = {
  tersedia: { color: 'success', icon: <CheckCircleOutlined />, label: 'Tersedia' },
  dipinjam: { color: 'processing', icon: <SyncOutlined spin />, label: 'Dipinjam' },
  dalam_perbaikan: { color: 'warning', icon: <ToolOutlined />, label: 'Dalam Perbaikan' },
};

const StatusTag = ({ status }) => {
  const config = statusConfig[status] || { color: 'default', label: status };
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

export default StatusTag;
