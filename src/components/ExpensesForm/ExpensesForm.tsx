import { useEffect } from 'react';
import './ExpensesForm.css';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
} from 'antd';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { DATE_FORMAT } from '../../constants';
import { setIsError } from '../../reducers/appSlice';
import type { Dayjs } from 'dayjs';
import {
  setIsExpensesFormActive,
  setIsExpensesFormOpened,
} from '../../reducers/financeSlice';
import ExpensesCategorySelect from '../ExpensesCategorySelect/ExpensesCategorySelect';
import {
  formatToDecimalNumber,
  numberFormat,
  convertStrToNum,
} from '../../utils/format';
import { useAddExpenseMutation } from '../../reducers/apiSlice';

export default function ExpensesForm() {
  const [form] = Form.useForm<{
    categoryId: string;
    date: Dayjs;
    sum: string;
  }>();

  const { isExpensesFormOpened } = useAppSelector(
    (state) => state.financeState
  );

  const dispatch = useAppDispatch();

  const [
    addExpense,
    { isError, isLoading, isSuccess },
  ] = useAddExpenseMutation();

  function closeForm() {
    const isFormEmpty =
      Object.values(form.getFieldsValue()).filter(
        (field) => field
      ).length < 1;
    dispatch(setIsExpensesFormOpened(false));
    if (isFormEmpty) {
      dispatch(setIsExpensesFormActive(false));
    }
  }

  function handleNumberInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    form.setFieldValue(
      'sum',
      formatToDecimalNumber(e.target.value)
    );
  }

  function handleNumberInputBlur(
    e: React.FocusEvent<HTMLInputElement, Element>
  ) {
    form.setFieldValue(
      'sum',
      numberFormat(
        convertStrToNum(e.target.value)
      )
    );
  }

  function handleFormSubmit(values: {
    categoryId: string;
    date: Dayjs;
    sum: string;
  }) {
    const { categoryId, date, sum } = values;
    if (!isLoading) {
      addExpense({
        categoryId,
        date: date.toDate(),
        sum: convertStrToNum(sum),
      });
    }
  }

  function resetForm() {
    form.resetFields();
    dispatch(setIsExpensesFormOpened(false));
    dispatch(setIsExpensesFormActive(false));
  }

  // обработка результата отправки формы
  useEffect(() => {
    dispatch(setIsError(isError));
    if (isSuccess) {
      resetForm();
    }
  }, [isError, isSuccess]);

  return (
    <div className='expenses-form'>
      <Drawer
        title={'НОВЫЕ РАСХОДЫ'}
        open={isExpensesFormOpened}
        onClose={closeForm}>
        <Form
          form={form}
          name='addExpense'
          onFinish={handleFormSubmit}
          layout='vertical'
          requiredMark={false}>
          <Form.Item
            name='categoryId'
            label='категория'
            rules={[
              {
                required: true,
                message: 'выберите категорию',
              },
            ]}>
            <ExpensesCategorySelect />
          </Form.Item>

          <div className='expenses-form__container'>
            <Form.Item
              name='date'
              label=''
              rules={[
                {
                  required: true,
                  message: 'выберите дату',
                },
              ]}>
              <DatePicker
                format={DATE_FORMAT}
                placeholder=''
              />
            </Form.Item>

            <Form.Item
              className='reg-form__numeric-item'
              name='sum'
              label=''
              rules={[
                {
                  required: true,
                  message: 'введите сумму',
                },
              ]}>
              <Input
                suffix='₽'
                onChange={handleNumberInputChange}
                onBlur={handleNumberInputBlur}
                allowClear
              />
            </Form.Item>
          </div>

          <Form.Item className='expenses-form__btn-group'>
            <Button
              onClick={resetForm}
              className='expenses-form__btn'>
              отменить
            </Button>

            <Button
              htmlType='submit'
              type='primary'
              className='expenses-form__btn'
              loading={isLoading}>
              сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
