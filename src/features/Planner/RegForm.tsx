import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Space,
} from 'antd';
import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  setIsRegFormOpen,
  setIsUserFormOpen,
} from './plannerSlice';
import {
  useGetRegCategoryListQuery,
  useGetServiceListQuery,
  useGetUserListQuery,
} from '../../reducers/apiSlice';
import UserSelect from '../../components/UserSelect/UserSelect';
import { DATE_FORMAT } from '../../constants';
import dayjs from 'dayjs';

export default function RegForm() {
  const [form] = Form.useForm();
  const { isRegFormOpen } = useAppSelector(
    (state) => state.plannerState
  );

  const { data: users } = useGetUserListQuery();
  const { data: categories } =
    useGetRegCategoryListQuery();
  const { data: services } =
    useGetServiceListQuery();

  const dispatch = useAppDispatch();

  const [filtredServices, setFiltredServices] =
    useState(services);
  const selectedServicesId: string[] =
    Form.useWatch('services', form);

  const selectedCategoryId: string =
    Form.useWatch('services', form);

  const isHairCategory =
    categories?.find(
      (category) =>
        category.id === selectedCategoryId
    )?.name === 'парикмахерские услуги';
  const isDurationIndexFormItemAbled =
    isHairCategory
      ? !!selectedServicesId.some((serviceId) => {
          const servise = filtredServices?.find(
            (service) => service.id === serviceId
          );
          return (
            servise && servise.duration.length > 1
          );
        })
      : false;

  function closeDrawer() {
    dispatch(setIsRegFormOpen(false));
    dispatch(setIsUserFormOpen(false));
  }

  function handleCategoryChange(value: string) {
    setFiltredServices(
      services?.filter(
        (service) => service.categoryId === value
      )
    );
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
          <UserSelect
            showErrMessage={() => console.log('')}
          />
        </Form.Item>

        <Form.Item
          name='category'
          label='категория услуг'
          rules={[
            {
              required: true,
              message: 'выберите категорию услуг',
            },
          ]}>
          <Select
            options={categories?.map(
              (category) => {
                return {
                  value: category.id,
                  label: category.name,
                };
              }
            )}
            onChange={handleCategoryChange}
          />
        </Form.Item>

        <Form.Item
          name='services'
          label='услуги'
          rules={[
            {
              required: true,
              message: 'выберите услуги',
            },
          ]}>
          <Select
            options={filtredServices?.map(
              (service) => {
                return {
                  value: service.id,
                  label: service.name,
                };
              }
            )}
            mode='multiple'
            allowClear
            // onClear={handleServicesClear}
          />
        </Form.Item>

        <Form.Item
          name='durationIndex'
          label='длина волос'
          rules={[
            {
              required: true,
              message: 'выберите длину волос',
            },
          ]}>
          <Select
            options={[
              'короткие',
              'средние',
              'длинные',
            ].map((option, index) => {
              return {
                value: index,
                label: option,
              };
            })}
            disabled={
              !isDurationIndexFormItemAbled
            }
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
