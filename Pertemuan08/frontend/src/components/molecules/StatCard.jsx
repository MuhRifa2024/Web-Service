import { Card, Statistic } from 'antd';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, prefix, suffix, icon, color, loading }) => {
  const { isDark } = useTheme();
  return (
    <Card
      loading={loading}
      style={{
        borderRadius: 12,
        border: 'none',
        background: isDark
          ? 'linear-gradient(135deg, #1a1f2e, #111827)'
          : 'linear-gradient(135deg, #ffffff, #f8fafc)',
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.06)',
      }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          color: color,
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontSize: 13,
            color: isDark ? '#9ca3af' : '#6b7280',
            marginBottom: 2,
          }}>
            {title}
          </div>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{
              fontSize: 24,
              fontWeight: 700,
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
