import './Login.css';
import {
  Button,
  Form,
  Input,
  Result,
} from 'antd';
import { useSigninMutation } from '../../reducers/apiSlice';
import { classByCondition } from '../../utils/className';

export default function Login() {
  const [form] = Form.useForm();

  const [signin, { isLoading, isError }] =
    useSigninMutation();

  function handleFormSubmit(values: {
    email: string;
    password: string;
  }) {
    if (!isLoading) {
      signin(values);
    }
  }

  return (
    <div className='login'>
      <Result
        className={classByCondition(
          'login__error',
          isError,
          'visible'
        )}
        status='error'
        title='Неверный логин или пароль. Попробуйте ещё раз.'
      />

      <Form
        className='login__form'
        form={form}
        name='login'
        onFinish={handleFormSubmit}
        onFinishFailed={(v) => console.log(v)}
        layout='vertical'
        requiredMark={false}>
        <Form.Item
          name='email'
          label='email'
          rules={[
            {
              type: 'email',
              message: 'email некорректный',
            },
            {
              required: true,
              message: 'введите email',
            },
          ]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name='password'
          label='пароль'
          rules={[
            {
              required: true,
              message: 'введите пароль',
            },
          ]}>
          <Input.Password allowClear />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType='submit'
            type='primary'
            block
            loading={isLoading}>
            войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
