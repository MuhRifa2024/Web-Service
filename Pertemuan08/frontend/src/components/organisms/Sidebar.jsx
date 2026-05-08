import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  InboxOutlined,
  SwapOutlined,
  AppstoreOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import Logo from '../atoms/Logo';
import { useTheme } from '../../context/ThemeContext';

const { Sider } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/barang', icon: <InboxOutlined />, label: 'Data Barang' },
  { key: '/peminjaman', icon: <SwapOutlined />, label: 'Peminjaman' },
  { key: '/kategori', icon: <AppstoreOutlined />, label: 'Kategori' },
  { key: '/laporan', icon: <FileTextOutlined />, label: 'Laporan' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        borderRight: `1px solid ${isDark ? '#1f2937' : '#f0f0f0'}`,
        zIndex: 100,
      }}
      theme={isDark ? 'dark' : 'light'}
    >
      <Logo collapsed={collapsed} />
      <Menu
        theme={isDark ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          border: 'none',
          padding: '0 8px',
        }}
      />
    </Sider>
  );
};

export default Sidebar;
export { menuItems };
