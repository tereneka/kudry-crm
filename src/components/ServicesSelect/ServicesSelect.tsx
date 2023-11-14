import { Form, Select, Tag } from 'antd';
import { ReactNode } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Service } from '../../types';

interface ServicesSelectProps {
  serviceList: Service[] | undefined;
  label?: string;
  suffixIcon?: ReactNode;
  onChange?: (...args: any) => void;
  disabled?: boolean;
}

export default function ServicesSelect({
  serviceList,
  label = '',
  suffixIcon = <DownOutlined rev={undefined} />,
  onChange = () => null,
  disabled = false,
}: ServicesSelectProps) {
  return (
    <Form.Item
      name='serviceIdList'
      label={label}
      rules={[
        {
          required: true,
          message: 'выберите услуги',
        },
      ]}>
      <Select
        options={serviceList?.map((service) => {
          return {
            value: service.id,
            label: service.name,
          };
        })}
        mode='multiple'
        style={{ width: 320, maxWidth: '100%' }}
        showSearch
        allowClear
        suffixIcon={suffixIcon}
        optionFilterProp='children'
        filterOption={(input, option) =>
          (option?.label ?? '').includes(input)
        }
        onChange={onChange}
        disabled={disabled}
      />
    </Form.Item>
  );
}
