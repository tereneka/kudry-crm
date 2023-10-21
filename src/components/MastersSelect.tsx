import React from 'react';
import { useGetMasterListQuery } from '../features/api/apiSlise';
import { Avatar, Select } from 'antd';
import { Master } from '../types';
import { nanoid } from 'nanoid';

interface Props {
  isAllOption: boolean;
  currentMaster: string | null;
  onChange: any;
}

export default function MastersSelect({
  isAllOption,
  currentMaster,
  onChange,
}: Props) {
  const { data: masterList } =
    useGetMasterListQuery();

  const { Option } = Select;

  const optionContent = (master: Master) => (
    <div>
      <Avatar
        style={{ background: '#10899e' }}
        src={master.photoUrl}
        alt='фото мастера'
      />{' '}
      {master.name}
    </div>
  );

  return (
    <Select
      className='master-select'
      value={currentMaster}
      onChange={onChange}
      placeholder={'Выберите мастера'}
      optionLabelProp='label'
      suffixIcon={<></>}>
      {isAllOption && (
        <Option
          key={nanoid()}
          value={'all'}
          label={'Все мастера'}>
          {'Все мастера'}
        </Option>
      )}

      {masterList?.map((master) => {
        const content = optionContent(master);
        return (
          <Option
            key={master.id}
            value={master.id}
            label={content}>
            {content}
          </Option>
        );
      })}
    </Select>
  );
}
