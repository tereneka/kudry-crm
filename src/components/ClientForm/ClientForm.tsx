import './ClientForm.css';
import { Form, Input, Button } from 'antd';
import { Client } from '../../types';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { setIsClientFormActive } from '../../reducers/clientsSlice';
import { classByCondition } from '../../utils/className';

export interface FormValues {
  name: string;
  phone: string;
}

interface ClientFormProps {
  name?: 'add' | 'edit';
  client?: Client;
  className?: string;
  isLabels?: boolean;
  isBtnGroupCollapsed?: boolean;
  onFinish?: any;
  isLoading?: boolean;
  closeForm?: () => void;
  isFormOpened?: boolean;
}

export default function ClientForm({
  name = 'add',
  client,
  className,
  isLabels = false,
  isBtnGroupCollapsed = false,
  onFinish,
  isLoading = false,
  closeForm,
  isFormOpened,
}: ClientFormProps) {
  const [form] = Form.useForm<FormValues>();

  const dispatch = useAppDispatch();

  const [
    isBtnGroupVisible,
    setIsBtnGroupVisible,
  ] = useState(!isBtnGroupCollapsed);

  function handleInputChange() {
    if (isFormOpened !== undefined) {
      const isFormEmpty =
        Object.values(
          form.getFieldsValue()
        ).filter((field) => field).length < 1;
      if (isFormEmpty) {
        dispatch(setIsClientFormActive(false));
      }
    }

    if (
      isBtnGroupCollapsed &&
      !isBtnGroupVisible
    ) {
      setIsBtnGroupVisible(true);
    }
  }

  function handleFormSubmit(values: FormValues) {
    if (name === 'add') {
      onFinish(values, form);
    } else {
      onFinish(values, client?.id || '');
      setTimeout(() => {
        if (!isLoading) {
          setIsBtnGroupVisible(false);
        }
      }, 800);
    }
  }

  function handleFormReset() {
    form.resetFields();
    if (closeForm) {
      closeForm();
    }
    if (isBtnGroupCollapsed) {
      setIsBtnGroupVisible(false);
    }
  }

  useEffect(() => {
    if (isFormOpened !== undefined) {
      const isFormEmpty =
        Object.values(
          form.getFieldsValue()
        ).filter((field) => field).length < 1;
      if (isFormEmpty && !isFormOpened) {
        form.resetFields();
        dispatch(setIsClientFormActive(false));
      }
    }
  }, [isFormOpened]);

  return (
    <Form
      className={`client-form ${className}`}
      name={name + 'Client'}
      form={form}
      onFinish={handleFormSubmit}
      layout='vertical'
      requiredMark={false}
      initialValues={{
        name: client?.name,
        phone: client?.phone.slice(2),
      }}>
      <Form.Item
        name='name'
        label={isLabels ? 'имя' : ''}
        rules={[
          {
            required: true,
            message: 'введите имя',
          },
        ]}>
        <Input
          onChange={handleInputChange}
          allowClear
        />
      </Form.Item>

      <Form.Item
        name='phone'
        label={isLabels ? 'телефон' : ''}
        rules={[
          {
            required: true,
            message: 'введите номер телефона',
          },
          {
            min: 10,
            message:
              'минимальное количествосимволов 10',
          },
        ]}>
        <Input
          prefix={'+7'}
          maxLength={10}
          onChange={handleInputChange}
          allowClear
        />
      </Form.Item>

      <Form.Item
        className={classByCondition(
          'client-form__btn-group',
          !isBtnGroupVisible,
          'invisible'
        )}>
        <Button
          onClick={handleFormReset}
          style={{
            marginRight: 8,
            fontSize: 11,
          }}>
          отменить
        </Button>

        <Button
          htmlType='submit'
          type='primary'
          loading={isLoading}
          style={{
            fontSize: 11,
          }}>
          {name === 'add'
            ? 'сохранить'
            : 'изменить'}
        </Button>
      </Form.Item>
    </Form>
  );
}
