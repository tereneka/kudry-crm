import { Select } from 'antd';
import { ReactNode } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Service } from '../../types';
import './ServicesSelect.css';

interface ServicesSelectProps {
  serviceList: Service[] | undefined;
  value?: string[];
  suffixIcon?: ReactNode;
  onChange?: (...args: any) => void;
  disabled?: boolean;
}

export default function ServicesSelect({
  serviceList,
  value,
  suffixIcon = <DownOutlined rev={undefined} />,
  onChange = () => null,
  disabled = false,
}: ServicesSelectProps) {
  return (
    <Select
      className='services-select'
      value={value}
      options={serviceList?.map((service) => {
        return {
          value: service.id,
          label: service.name,
        };
      })}
      mode='multiple'
      showSearch
      allowClear
      suffixIcon={suffixIcon}
      optionFilterProp='children'
      filterOption={(input, option) =>
        (option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      onChange={onChange}
      disabled={disabled}
    />
  );
}
