import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchFilter = ({ onSearch, filters, onFilterChange, searchPlaceholder }) => {
  return (
    <Space wrap size="middle" style={{ marginBottom: 16, width: '100%' }}>
      <Search
        placeholder={searchPlaceholder || 'Cari...'}
        allowClear
        onSearch={onSearch}
        onChange={(e) => !e.target.value && onSearch('')}
        style={{ width: 300 }}
        prefix={<SearchOutlined />}
      />
      {filters && filters.map((filter) => (
        <Select
          key={filter.key}
          placeholder={filter.placeholder}
          allowClear
          onChange={(value) => onFilterChange(filter.key, value)}
          style={{ width: 180 }}
          options={filter.options}
        />
      ))}
    </Space>
  );
};

export default SearchFilter;
