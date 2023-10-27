import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
} from 'antd';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  setIsRegFormOpen,
  setIsUserFormOpen,
} from './plannerSlice';
import { useGetUserListQuery } from '../api/apiSlise';
import { services } from '../../data';
import UsersSelect from './UsersSelect';

export default function RegForm() {
  const { isRegFormOpen } = useAppSelector(
    (state) => state.plannerState
  );

  const { data: users } = useGetUserListQuery();

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  function closeDrawer() {
    dispatch(setIsRegFormOpen(false));
    dispatch(setIsUserFormOpen(false));
  }

  function handleFormSubmit() {
    closeDrawer();
  }

  return (
    <Drawer
      title='НОВАЯ ЗАПИСЬ'
      height={'100vh'}
      placement='bottom'
      open={isRegFormOpen}
      onClose={closeDrawer}
      //   styles={{
      //     body: {
      //       paddingBottom: 80,
      //     },
      //   }}
      extra={
        <Space>
          <Button onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            type='primary'>
            Submit
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name='reg'
        // initialValues={
        //   registrationFormList[
        //     currentRegistrationPage
        //   ].initialValues
        // }
        onFinish={handleFormSubmit}
        onFinishFailed={() =>
          window.scrollTo(
            0,
            document.body.scrollHeight
          )
        }
        layout={
          window.innerWidth < 700
            ? 'vertical'
            : 'horizontal'
        }>
        <Form.Item
          name='user'
          label='клиент'
          rules={[
            {
              required: true,
              message: 'выберите клиента',
            },
          ]}>
          <UsersSelect />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
