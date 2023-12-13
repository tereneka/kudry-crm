import './ClientSelect.css';
import { Button, Select } from 'antd';
import { useGetUserListQuery } from '../../reducers/apiSlice';
import {
  PlusOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';
import { phoneFormat } from '../../utils/format';
import { Client } from '../../types';

interface UserSelectProps {
  suffixIcon?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  isAddClientBtn?: boolean;
  onAddClientBtnClick?: () => void;
}

export default function ClientSelect({
  suffixIcon = <DownOutlined rev={undefined} />,
  value,
  onChange = () => null,
  isAddClientBtn = false,
  onAddClientBtnClick = () => null,
}: UserSelectProps) {
  const { data: clientList } =
    useGetUserListQuery();

  const { Option } = Select;

  function renderOptionContent(user: Client) {
    return (
      <div className='client-select__option'>
        <span className='client-select__option-item client-select__option-item_name_name'>
          {user.name}
        </span>
        <span className='client-select__option-item client-select__option-item_name_phone'>
          {phoneFormat(user.phone)}
        </span>
      </div>
    );
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      className='client-select'
      notFoundContent={<></>}
      optionLabelProp='label'
      listHeight={150}
      showSearch
      allowClear
      suffixIcon={suffixIcon}
      optionFilterProp='children'
      filterOption={(input, option) => {
        return !!clientList
          ?.find(
            (user) => user.id === option?.value
          )
          ?.name.toLowerCase()
          .includes(input.toLowerCase());
      }}
      dropdownRender={(menu) => (
        <>
          {isAddClientBtn && (
            <Button
              type='primary'
              icon={
                <PlusOutlined rev={undefined} />
              }
              onClick={onAddClientBtnClick}
              style={{ margin: 12, fontSize: 11 }}
              size='small'>
              новый клиент
            </Button>
          )}
          {menu}
        </>
      )}>
      {clientList?.map((user) => {
        const content = renderOptionContent(user);
        return (
          <Option
            key={user.id}
            value={user.id}
            label={content}>
            {content}
          </Option>
        );
      })}
    </Select>
  );
}
