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
} from '@ant-design/icons';
import { User } from '../../types';
import { useEffect, useState } from 'react';

interface UserSelectProps {
  showErrMessage: () => void;
}

export default function UserSelect({
  showErrMessage,
}: UserSelectProps) {
  const { data: users } = useGetUserListQuery();

  const [isUserFormOpened, setIsUserFormOpened] =
    useState(false);

  const [
    addUser,
    { isLoading, isError, isSuccess },
  ] = useAddUserMutation();

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
    if (isError) showErrMessage();
    if (isSuccess) closeForm();
  }, [isError, isSuccess]);

  return (
    <Form.Item
      name='userId'
      label='клиент'
      rules={[
        {
          required: true,
          message: 'выберите клиента',
        },
      ]}>
      <Select
        notFoundContent={<></>}
        options={
          isUserFormOpened
            ? []
            : users?.map((user) => {
                return {
                  value: user.id,
                  label: user.name,
                };
              })
        }
        onDropdownVisibleChange={closeForm}
        dropdownStyle={{
          position: 'fixed',
        }}
        showSearch
        allowClear
        optionFilterProp='children'
        filterOption={(input, option) =>
          (
            option?.label.toLocaleLowerCase() ??
            ''
          ).includes(input.toLocaleLowerCase())
        }
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
                  icon={<CloseOutlined />}
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
                icon={<PlusOutlined />}
                onClick={handleAddUserBtnClick}
                style={{ margin: 12 }}>
                новый клиент
              </Button>
            )}
          </>
        )}
      />
    </Form.Item>
  );
}
