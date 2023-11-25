import { useEffect, useState } from 'react';
import './NoteForm.css';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Select,
} from 'antd';
import UserSelect from '../UserSelect/UserSelect';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  DATE_FORMAT,
  INITIAL_NOTE_FORM_VALUES,
  TIME_LIST,
} from '../../constants';
import { Note } from '../../types';
import { convertDateStrToDate } from '../../utils/date';
import dayjs from 'dayjs';
import {
  setIsNoteFormActive,
  setNoteFormValues,
} from '../../reducers/notesSlice';
import TextArea from 'antd/es/input/TextArea';
import { useAddNoteMutation } from '../../reducers/apiSlice';
import { setIsError } from '../../reducers/appSlice';

export default function NoteForm() {
  const [form] = Form.useForm();

  const { isNoteFormActive, noteFormValues } =
    useAppSelector((state) => state.notesState);
  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const [isFormOpened, setIsFormOpened] =
    useState(false);

  const dispatch = useAppDispatch();

  const [
    addNote,
    { isError, isLoading, isSuccess },
  ] = useAddNoteMutation();

  function openForm() {
    setIsFormOpened(true);
    dispatch(setIsNoteFormActive(true));
  }

  function closeForm() {
    const isFormEmpty =
      Object.values(form.getFieldsValue()).filter(
        (field) => field
      ).length < 2;
    setIsFormOpened(false);
    if (isFormEmpty) {
      dispatch(setIsNoteFormActive(false));
    }
  }

  function handleFormSubmit(values: {
    text: string;
    userId: string;
    time: string;
  }) {
    const { userId, text, time } = values;

    const body = {
      ...noteFormValues,
      text,
      userId: userId || null,
      masterId: currentMaster?.id,
      date: convertDateStrToDate(date),
      time,
    } as Note;
    addNote(body);
  }

  function resetForm() {
    form.resetFields();

    dispatch(
      setNoteFormValues({
        ...INITIAL_NOTE_FORM_VALUES,
        masterId: currentMaster?.id || '',
        date: convertDateStrToDate(date),
      })
    );

    dispatch(setIsNoteFormActive(false));
    setIsFormOpened(false);
  }

  // изменение даты
  useEffect(() => {
    form.setFieldValue(
      'date',
      dayjs(date, DATE_FORMAT)
    );
  }, [date]);

  // обработка результата отправки формы
  useEffect(() => {
    dispatch(setIsError(isError));
    if (isSuccess) {
      resetForm();
    }
  }, [isError, isSuccess]);

  return (
    <div className='note-form'>
      <Button
        type='primary'
        danger={!isNoteFormActive}
        onClick={openForm}>
        новая напоминалка
      </Button>

      <Drawer
        title={
          <h3 className='note-form__title'>
            новая напоминалка
          </h3>
        }
        open={isFormOpened}
        onClose={closeForm}>
        <Form
          form={form}
          name='note'
          onFinish={handleFormSubmit}
          layout='vertical'
          requiredMark={false}
          initialValues={{
            date: dayjs(date, DATE_FORMAT),
          }}>
          <Form.Item
            name='text'
            label='текст'
            rules={[
              {
                required: true,
                message: 'напишите текст',
              },
            ]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name='userId' label='клиент'>
            <UserSelect />
          </Form.Item>

          <div className='note-form__date-time-container'>
            <Form.Item
              name='date'
              label='дата'
              rules={[
                {
                  required: true,
                  message: 'выберите дату',
                },
              ]}>
              <DatePicker
                format={DATE_FORMAT}
                disabled
              />
            </Form.Item>

            <Form.Item
              name='time'
              label='время'
              style={{ minWidth: 135 }}
              rules={[
                {
                  required: true,
                  message: 'выберите время',
                },
              ]}>
              <Select
                options={TIME_LIST.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
              />
            </Form.Item>
          </div>

          <Form.Item className='note-form__btn-group'>
            <Button
              onClick={resetForm}
              className='note-form__btn'>
              отменить
            </Button>

            <Button
              htmlType='submit'
              type='primary'
              className='note-form__btn'
              loading={isLoading}>
              сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
