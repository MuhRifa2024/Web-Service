import { DatabaseOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';

const Logo = ({ collapsed }) => {
  const { isDark } = useTheme();
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? '20px 0' : '20px 24px',
      gap: 12,
      borderBottom: `1px solid ${isDark ? '#1f2937' : '#f0f0f0'}`,
      marginBottom: 8,
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <DatabaseOutlined style={{ color: '#fff', fontSize: 18 }} />
      </div>
      {!collapsed && (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{
            fontWeight: 700,
            fontSize: 15,
            color: isDark ? '#f3f4f6' : '#111827',
            lineHeight: 1.2,
          }}>
            InvenTrack
          </div>
          <div style={{
            fontSize: 11,
            color: isDark ? '#9ca3af' : '#6b7280',
            lineHeight: 1.2,
          }}>
            Inventaris Kantor
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
