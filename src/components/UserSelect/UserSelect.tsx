import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  message,
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
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setIsUserFormOpen } from '../../features/Planner/plannerSlice';

export default function UserSelect() {
  const { data: users } = useGetUserListQuery();

  const { isUserFormOpen } = useAppSelector(
    (state) => state.plannerState
  );

  const dispatch = useAppDispatch();

  const [addUser, { isLoading }] =
    useAddUserMutation();

  const [messageApi, errorMessage] =
    message.useMessage();

  function handleAddUserBtnClick() {
    dispatch(setIsUserFormOpen(true));
  }

  function closeForm() {
    dispatch(setIsUserFormOpen(false));
  }

  function showErrMessage() {
    messageApi.open({
      type: 'error',
      content: 'Произошла ошибка :(',
      duration: 4,
    });
  }

  function handleFormSubmit(
    values: Omit<User, 'id'>
  ) {
    if (!isLoading) {
      addUser(values)
        .then(() => {
          closeForm();
        })
        .catch(() => showErrMessage());
    }
  }

  return (
    <>
      {errorMessage}
      <Select
        options={users?.map((user) => {
          return {
            value: user.id,
            label: user.name,
          };
        })}
        onDropdownVisibleChange={closeForm}
        showSearch
        allowClear
        optionFilterProp='children'
        filterOption={(input, option) =>
          (option?.label ?? '').includes(input)
        }
        dropdownRender={(menu) => (
          <>
            {menu}

            {isUserFormOpen && (
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
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}>
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
                    wrapperCol={{
                      offset: 4,
                      span: 14,
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

            {!isUserFormOpen && (
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
    </>
  );
}
