import {
  Button,
  Divider,
  Form,
  Input,
  Select,
} from 'antd';
import {
  useAddExpensesCategoryMutation,
  useGetExpensesCategoryListQuery,
} from '../../reducers/apiSlice';
import {
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { setIsError } from '../../reducers/appSlice';
import { ExpensesCategory } from '../../types';

interface ExpensesCategorySelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ExpensesCategorySelect({
  value,
  onChange,
}: ExpensesCategorySelectProps) {
  const { data: categoryList } =
    useGetExpensesCategoryListQuery();

  const [isFormOpened, setIsFormOpened] =
    useState(false);

  const [
    addCategory,
    { isLoading, isError, isSuccess },
  ] = useAddExpensesCategoryMutation();

  const dispatch = useAppDispatch();

  const { Option } = Select;

  function openForm() {
    setIsFormOpened(true);
  }

  function closeForm() {
    setIsFormOpened(false);
  }

  function handleFormSubmit(
    values: Omit<ExpensesCategory, 'id'>
  ) {
    if (!isLoading) {
      addCategory(values);
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
      notFoundContent={<></>}
      optionLabelProp='label'
      onDropdownVisibleChange={closeForm}
      listHeight={150}
      showSearch
      allowClear
      optionFilterProp='children'
      filterOption={(input, option) => {
        return !!categoryList
          ?.find(
            (category) =>
              category.id === option?.value
          )
          ?.name.toLowerCase()
          .includes(input.toLowerCase());
      }}
      dropdownRender={(menu) => (
        <>
          {menu}

          {isFormOpened && (
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
                name='addExpensesCategory'
                onFinish={handleFormSubmit}
                layout='vertical'
                requiredMark={false}>
                <Form.Item
                  name='name'
                  label='название'
                  rules={[
                    {
                      required: true,
                      message: 'введите название',
                    },
                  ]}>
                  <Input />
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

          {!isFormOpened && (
            <Button
              type='primary'
              icon={
                <PlusOutlined rev={undefined} />
              }
              onClick={openForm}
              style={{
                marginTop: 12,
                marginBottom: 12,
              }}>
              новая категория
            </Button>
          )}
        </>
      )}>
      {!isFormOpened &&
        categoryList?.map((category) => {
          return (
            <Option
              key={category.id}
              value={category.id}
              label={category.name}>
              {category.name}
            </Option>
          );
        })}
    </Select>
  );
}
