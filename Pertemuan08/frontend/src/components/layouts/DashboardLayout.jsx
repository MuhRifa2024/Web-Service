import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import HeaderBar from '../organisms/HeaderBar';
import { useTheme } from '../../context/ThemeContext';

const { Content } = Layout;

const DashboardLayout = () => {
  const { isDark } = useTheme();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250, transition: 'margin-left 0.3s ease' }}>
        <HeaderBar />
        <Content style={{
          margin: 24,
          padding: 24,
          minHeight: 'calc(100vh - 112px)',
          background: isDark ? '#0a0f1a' : '#f0f2f5',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
