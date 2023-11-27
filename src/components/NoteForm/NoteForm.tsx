import { useEffect } from 'react';
import './NoteForm.css';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  TimePicker,
} from 'antd';
import UserSelect from '../UserSelect/UserSelect';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  DATE_FORMAT,
  TIME_FORMAT,
} from '../../constants';
import { Note } from '../../types';
import {
  convertDateStrToDate,
  convertDbDateToStr,
} from '../../utils/date';
import dayjs from 'dayjs';
import {
  setIsNoteFormActive,
  setOpenedNoteForm,
} from '../../reducers/notesSlice';
import TextArea from 'antd/es/input/TextArea';
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
} from '../../reducers/apiSlice';
import { setIsError } from '../../reducers/appSlice';
import {
  setNoteCardInfo,
  setNoteCardUser,
} from '../../reducers/noteCardSlice';
import type { Dayjs } from 'dayjs';

interface NoteFormProps {
  isOpenBtn?: boolean;
}

export default function NoteForm({
  isOpenBtn = false,
}: NoteFormProps) {
  const [form] = Form.useForm();

  const { isNoteFormActive, openedNoteForm } =
    useAppSelector((state) => state.notesState);
  const { noteCardInfo, noteCardUser } =
    useAppSelector(
      (state) => state.noteCardState
    );
  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const dispatch = useAppDispatch();

  const [
    addNote,
    {
      isError: isAddNoteError,
      isLoading: isAddNoteLoading,
      isSuccess: isAddNoteSuccess,
    },
  ] = useAddNoteMutation();

  const [
    updateNote,
    {
      isError: isUpdateNoteError,
      isLoading: isUpdateNoteLoading,
      isSuccess: isUpdateNoteSuccess,
    },
  ] = useUpdateNoteMutation();

  function openForm() {
    dispatch(setOpenedNoteForm('add'));
    dispatch(setIsNoteFormActive(true));
  }

  function closeForm() {
    const isFormEmpty =
      Object.values(form.getFieldsValue()).filter(
        (field) => field
      ).length < 2;
    dispatch(setOpenedNoteForm(''));
    dispatch(setNoteCardInfo(null));
    dispatch(setNoteCardUser(null));
    if (isFormEmpty) {
      resetForm();
    }
  }

  function handleFormSubmit(values: {
    text: string;
    userId: string;
    date: Dayjs;
    time: Dayjs;
  }) {
    const { userId, text, date, time } = values;

    const body = {
      text,
      userId: userId || null,
      masterId: currentMaster?.id,
      date: convertDateStrToDate(
        date.format(DATE_FORMAT)
      ),
      time: time.format(TIME_FORMAT),
    } as Note;

    if (openedNoteForm === 'add') {
      addNote(body);
    } else if (openedNoteForm === 'edit') {
      updateNote({
        id: noteCardInfo?.id || '',
        body,
      });
    }
  }

  function resetForm() {
    form.resetFields();
    dispatch(setIsNoteFormActive(false));
    dispatch(setOpenedNoteForm(''));
  }

  // вносим изначальные данные при обновлении
  useEffect(() => {
    if (noteCardInfo) {
      form.setFieldsValue({
        text: noteCardInfo.text,
        userId: noteCardUser?.id,
        date: dayjs(
          convertDbDateToStr(noteCardInfo?.date),
          DATE_FORMAT
        ),
        time: dayjs(
          noteCardInfo?.time,
          TIME_FORMAT
        ),
      });
    } else {
      form.resetFields();
    }
  }, [noteCardInfo, noteCardUser]);

  // изменение даты
  useEffect(() => {
    form.setFieldValue(
      'date',
      dayjs(date, DATE_FORMAT)
    );
  }, [date]);

  // обработка результата отправки формы
  useEffect(() => {
    dispatch(setIsError(isAddNoteError));
    if (isAddNoteSuccess) {
      resetForm();
    }
  }, [isAddNoteError, isAddNoteSuccess]);

  useEffect(() => {
    dispatch(setIsError(isUpdateNoteError));
    if (isUpdateNoteSuccess) {
      resetForm();
    }
  }, [isUpdateNoteError, isUpdateNoteSuccess]);

  return (
    <div className='note-form'>
      {isOpenBtn && (
        <Button
          type='primary'
          danger={!isNoteFormActive}
          onClick={openForm}>
          новая напоминалка
        </Button>
      )}

      <Drawer
        title={
          <h3 className='note-form__title'>
            {openedNoteForm === 'add'
              ? 'новая напоминалка'
              : 'изменить напоминалку'}
          </h3>
        }
        open={!!openedNoteForm}
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
            <TextArea autoSize />
          </Form.Item>

          <Form.Item name='userId' label='клиент'>
            <UserSelect />
          </Form.Item>

          <div className='note-form__date-time-container'>
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
              name='time'
              label=''
              style={{ minWidth: 135 }}
              rules={[
                {
                  required: true,
                  message: 'выберите время',
                },
              ]}>
              <TimePicker
                format={TIME_FORMAT}
                placeholder=''
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
              loading={
                isAddNoteLoading ||
                isUpdateNoteLoading
              }>
              сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
