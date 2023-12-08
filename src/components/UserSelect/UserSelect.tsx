import './UserSelect.css';
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
} from 'antd';
import {
  useAddUserMutation,
  useGetUserListQuery,
} from '../../reducers/apiSlice';
import {
  PlusOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { phoneFormat } from '../../utils/format';
import { useAppDispatch } from '../../store';
import { setIsError } from '../../reducers/appSlice';
import { RegUser } from '../../types';

interface UserSelectProps {
  suffixIcon?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}

export default function UserSelect({
  suffixIcon = <DownOutlined rev={undefined} />,
  value,
  onChange,
}: UserSelectProps) {
  const { data: users } = useGetUserListQuery();

  const [isUserFormOpened, setIsUserFormOpened] =
    useState(false);

  const [
    addUser,
    { isLoading, isError, isSuccess },
  ] = useAddUserMutation();

  const dispatch = useAppDispatch();

  const { Option } = Select;

  function renderOptionContent(user: RegUser) {
    return (
      <div className='user-select__option'>
        <span className='user-select__option-item user-select__option-item_name_name'>
          {user.name}
        </span>
        <span className='user-select__option-item user-select__option-item_name_phone'>
          {phoneFormat(user.phone)}
        </span>
      </div>
    );
  }

  function handleAddUserBtnClick() {
    setIsUserFormOpened(true);
  }

  function closeForm() {
    setIsUserFormOpened(false);
  }

  function handleFormSubmit(
    values: Omit<RegUser, 'id'>
  ) {
    if (!isLoading) {
      addUser({
        ...values,
        phone: '+7' + values.phone,
      });
    }
  }

  // обработка результата отправки формы регистрации
  useEffect(() => {
    dispatch(setIsError(isError));
    if (isSuccess) closeForm();
  }, [isError, isSuccess]);

  return (
    <Select
      value={value}
      onChange={onChange}
      className='user-select'
      notFoundContent={<></>}
      optionLabelProp='label'
      onDropdownVisibleChange={closeForm}
      listHeight={150}
      showSearch
      allowClear
      suffixIcon={suffixIcon}
      optionFilterProp='children'
      filterOption={(input, option) => {
        return !!users
          ?.find(
            (user) => user.id === option?.value
          )
          ?.name.toLowerCase()
          .includes(input.toLowerCase());
      }}
      dropdownRender={(menu) => (
        <>
          {menu}

          {isUserFormOpened && (
            <>
              <Divider
                style={{ margin: '8px 0' }}
              />
              <Button
                type='text'
                icon={
                  <CloseOutlined
                    rev={undefined}
                  />
                }
                onClick={closeForm}
                style={{
                  color: 'rgba(60, 60, 60, 0.45)',
                }}
              />
              <Form
                name='addUser'
                onFinish={handleFormSubmit}
                layout='vertical'
                requiredMark={false}>
                <Form.Item
                  name='name'
                  label='имя'
                  rules={[
                    {
                      required: true,
                      message: 'введите имя',
                    },
                  ]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  name='phone'
                  label='телефон'
                  rules={[
                    {
                      required: true,
                      message:
                        'введите номер телефона',
                    },
                    {
                      min: 10,
                      message:
                        'минимальное количествосимволов 10',
                    },
                  ]}>
                  <Input
                    addonBefore={'+7'}
                    maxLength={10}
                  />
                </Form.Item>

                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 8,
                  }}>
                  <Button
                    htmlType='submit'
                    type='primary'
                    loading={isLoading}>
                    сохранить
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

          {!isUserFormOpened && (
            <Button
              type='primary'
              icon={
                <PlusOutlined rev={undefined} />
              }
              onClick={handleAddUserBtnClick}
              style={{ margin: 12 }}>
              новый клиент
            </Button>
          )}
        </>
      )}>
      {!isUserFormOpened &&
        users?.map((user) => {
          const content =
            renderOptionContent(user);
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
