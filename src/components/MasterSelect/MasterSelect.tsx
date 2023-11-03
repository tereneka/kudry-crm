import { useGetMasterListQuery } from '../../reducers/apiSlice';
import { Avatar, Select } from 'antd';
import { Master } from '../../types';
import { nanoid } from 'nanoid';
import './MasterSelect.css';

interface Props {
  isAllOption: boolean;
  currentMaster: Master | null | undefined;
  onChange: (value: string) => void;
}

export default function MasterSelect({
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
        size='large'
        style={{ background: '#10899e' }}
        src={master.photoUrl}
        alt='фото мастера'
      />{' '}
      {master.name}
    </div>
  );
  return (
    <div className='master-select'>
      <Select
        size='large'
        value={currentMaster?.id}
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
    </div>
  );
}
