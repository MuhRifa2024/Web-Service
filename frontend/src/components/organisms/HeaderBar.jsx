import { Layout, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../atoms/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const { Header } = Layout;
const { Title } = Typography;

const pageTitles = {
  '/': 'Dashboard',
  '/barang': 'Data Barang',
  '/peminjaman': 'Peminjaman',
  '/kategori': 'Kategori',
  '/laporan': 'Laporan',
};

const HeaderBar = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const title = pageTitles[location.pathname] || 'InvenTrack';

  return (
    <Header style={{
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${isDark ? '#1f2937' : '#f0f0f0'}`,
      height: 64,
      lineHeight: '64px',
    }}>
      <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
        {title}
      </Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280' }}>
          Muhamad Rifaidi
        </span>
        <ThemeToggle />
      </div>
    </Header>
  );
};

export default HeaderBar;
