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
import { User } from '../../types';
import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { phoneFormat } from '../../utils/format';
import { classByCondition } from '../../utils/className';
import { useAppDispatch } from '../../store';
import { setIsError } from '../../reducers/appSlice';

interface UserSelectProps {
  label?: string;
  suffixIcon?: ReactNode;
  classModifier?: string;
}

export default function UserSelect({
  label = '',
  suffixIcon = <DownOutlined rev={undefined} />,
  classModifier,
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

  function renderOptionContent(user: User) {
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
    values: Omit<User, 'id'>
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
    <Form.Item
      name='userId'
      label={label}
      rules={[
        {
          required: true,
          message: 'выберите клиента',
        },
      ]}>
      <Select
        className={classByCondition(
          'user-select',
          !!classModifier,
          classModifier
        )}
        notFoundContent={<></>}
        optionLabelProp='label'
        onDropdownVisibleChange={closeForm}
        listHeight={150}
        style={{ width: 320, maxWidth: '100%' }}
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
                    color:
                      'rgba(60, 60, 60, 0.45)',
                  }}
                />
                <Form
                  name='user'
                  onFinish={handleFormSubmit}
                  layout='vertical'>
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
    </Form.Item>
  );
}
