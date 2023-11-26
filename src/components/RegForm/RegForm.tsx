import { useEffect, useState } from 'react';
import './RegForm.css';
import {
  Badge,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
} from 'antd';
import UserSelect from '../UserSelect/UserSelect';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  useAddRegistrationMutation,
  useGetCategoryListQuery,
  useGetServiceListQuery,
  useUpdateIncomeMutation,
} from '../../reducers/apiSlice';
import {
  setIsRegFormActive,
  setRegFormTime,
} from '../../reducers/regSlice';
import {
  DATE_FORMAT,
  HAIR_LENGTH_LIST,
  MAILE_HAIRCAT_LIST,
  TIME_LIST,
} from '../../constants';
import { useWatch } from 'antd/es/form/Form';
import {
  calculateRegDurationAndIncome,
  changeIncome,
  filterServicesByGender,
  filterServicesByMaster,
  hasMasterHairCategory,
  isIndexSelect,
  isMastersCategoriesSame,
} from '../../utils/reg';
import { Registration } from '../../types';
import { convertDateStrToDate } from '../../utils/date';
import { plural } from '../../utils/format';
import ServicesSelect from '../ServicesSelect/ServicesSelect';
import { setIsError } from '../../reducers/appSlice';
import dayjs from 'dayjs';

export default function RegForm() {
  const [form] = Form.useForm();

  const genderFormItemValue:
    | 'male'
    | 'female'
    | undefined = useWatch('gender', form);
  const serviceIdListFormItemValue = useWatch(
    'serviceIdList',
    form
  );
  const indexFormItemValue = useWatch(
    'index',
    form
  );
  const durationFormItemValue = useWatch(
    'duration',
    form
  );

  const { isRegFormActive, regFormTime } =
    useAppSelector((state) => state.regState);
  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { data: serviceList } =
    useGetServiceListQuery();
  const { data: categoryList } =
    useGetCategoryListQuery();

  const [
    addReg,
    {
      isLoading: isRegLoading,
      isError,
      isSuccess,
    },
  ] = useAddRegistrationMutation();
  const [
    updateIncome,
    { isLoading: isIncomeLoading },
  ] = useUpdateIncomeMutation();

  const [isFormOpened, setIsFormOpened] =
    useState(false);
  const [
    isIndexSelectVisible,
    setIsIndexSelectVisible,
  ] = useState(false);
  const [index, setIndex] = useState(0);
  const [dateTimeError, setDateTimeError] =
    useState('');
  const [caculatedIncome, setCaculatedIncome] =
    useState(0);

  const isHairCategory = hasMasterHairCategory(
    currentMaster,
    categoryList
  );
  const filteredServicesByMaster =
    filterServicesByMaster(
      serviceList,
      currentMaster
    );
  const indexSelectOptionList =
    genderFormItemValue
      ? genderFormItemValue === 'female'
        ? HAIR_LENGTH_LIST
        : MAILE_HAIRCAT_LIST
      : [];

  const dispatch = useAppDispatch();

  function openForm() {
    setIsFormOpened(true);
    dispatch(setIsRegFormActive(true));
  }

  function closeForm() {
    const isFormEmpty =
      Object.values(form.getFieldsValue()).filter(
        (field) => field
      ).length < 2;
    setIsFormOpened(false);
    if (isFormEmpty) {
      dispatch(setIsRegFormActive(false));
    }
  }

  function handleGenderChange() {
    form.resetFields(['serviceIdList', 'index']);
    setIsIndexSelectVisible(false);
  }

  function handleServicesChange(
    selectedServiceList: string[]
  ) {
    if (isHairCategory) {
      setIsIndexSelectVisible(
        isIndexSelect(
          selectedServiceList,
          serviceList
        )
      );
    }
  }

  function handleFormSubmit(values: {
    userId: string;
    serviceIdList: string[];
    duration: number;
    income: number;
    index?: number;
    gender?: 'male' | 'female';
  }) {
    const {
      userId,
      serviceIdList,
      duration,
      income,
      index,
      gender,
    } = values;
    const body = {
      userId,
      serviceIdList,
      masterId: currentMaster?.id,
      date: convertDateStrToDate(date),
      time: regFormTime,
      duration,
      income,
      priceCorrection: income / caculatedIncome,
      serviceIndex: index || 0,
      gender:
        gender === undefined ? null : gender,
    } as Registration;

    if (
      regFormTime &&
      date &&
      !isRegLoading &&
      !isIncomeLoading
    ) {
      changeIncome(
        serviceIdList,
        serviceList,
        convertDateStrToDate(date),
        index || 0,
        income / caculatedIncome,
        'plus',
        updateIncome
      );
      addReg(body);
    } else if (!regFormTime || !date) {
      setDateTimeError(
        '← выберите дату и время в планере'
      );
    }
  }

  function resetForm() {
    form.resetFields();
    dispatch(setRegFormTime(''));
    dispatch(setIsRegFormActive(false));
    setIsFormOpened(false);
    setIsIndexSelectVisible(false);
    setDateTimeError('');
  }

  // определяем индекс для массива продолжительности
  // услуги и прайса в зависимости от выбранной длины волос
  useEffect(() => {
    setIndex(indexFormItemValue || 0);
  }, [indexFormItemValue]);

  // вычисляем продолжительность регистрации и стоимость
  useEffect(() => {
    if (serviceIdListFormItemValue) {
      const { duration, income } =
        calculateRegDurationAndIncome(
          serviceIdListFormItemValue,
          serviceList,
          index
        );
      form.setFieldsValue({
        duration: duration,
        income,
      });
      setCaculatedIncome(income);
    } else {
      form.setFieldsValue({
        duration: 0,
        income: 0,
      });
      setCaculatedIncome(0);
    }
    form.validateFields(['duration', 'income']);
  }, [serviceIdListFormItemValue, index]);

  // изменение и валидация полей даты и времени
  useEffect(() => {
    if (regFormTime) {
      setDateTimeError('');
      form.setFieldValue('time', regFormTime);
    }
  }, [regFormTime]);

  useEffect(() => {
    form.setFieldValue(
      'date',
      dayjs(date, DATE_FORMAT)
    );
  }, [date]);

  // описываем действия при смене мастера
  useEffect(() => {
    if (isRegFormActive) {
      if (
        isMastersCategoriesSame(
          prevMaster,
          currentMaster
        )
      ) {
        dispatch(setRegFormTime(''));
      } else {
        setIsIndexSelectVisible(false);
        resetForm();
      }
    }
  }, [currentMaster]);

  // обработка результата отправки формы регистрации
  useEffect(() => {
    dispatch(setIsError(isError));
    if (isSuccess) {
      resetForm();
      setIsIndexSelectVisible(false);
    }
  }, [isError, isSuccess]);

  return (
    <div className='reg-form'>
      <Badge
        count={
          isRegFormActive
            ? durationFormItemValue + 'ч.'
            : 0
        }
        showZero={false}
        size='small'
        offset={[-20, 0]}>
        <Button
          type='primary'
          danger={!isRegFormActive}
          onClick={openForm}>
          новая запись
        </Button>
      </Badge>

      <Drawer
        title='НОВАЯ ЗАПИСЬ'
        width={400}
        open={isFormOpened}
        onClose={closeForm}>
        <Form
          form={form}
          name='reg'
          onFinish={handleFormSubmit}
          onFinishFailed={() => {
            if (!regFormTime) {
              setDateTimeError(
                '← выберите дату и время в планере'
              );
            }
          }}
          layout='vertical'
          requiredMark={false}
          initialValues={{
            date: dayjs(date, DATE_FORMAT),
            duration: 0,
            income: 0,
          }}>
          {isHairCategory && (
            <Form.Item
              name='gender'
              label='зал'
              rules={[
                {
                  required: true,
                  message: 'выберите зал',
                },
              ]}>
              <Select
                options={[
                  'женский',
                  'мужской',
                ].map((item) => {
                  return {
                    value:
                      item === 'мужской'
                        ? 'male'
                        : 'female',
                    label: item,
                  };
                })}
                onChange={handleGenderChange}
              />
            </Form.Item>
          )}

          <Form.Item
            name='serviceIdList'
            label='услуги'
            rules={[
              {
                required: true,
                message: 'выберите услуги',
              },
            ]}>
            <ServicesSelect
              serviceList={filterServicesByGender(
                filteredServicesByMaster,
                genderFormItemValue
              )}
              onChange={handleServicesChange}
              disabled={
                isHairCategory &&
                !!!genderFormItemValue
              }
            />
          </Form.Item>

          {isIndexSelectVisible && (
            <Form.Item
              name='index'
              label={
                genderFormItemValue === 'female'
                  ? 'длина волос'
                  : 'тип стрижки'
              }
              rules={[
                {
                  required: isIndexSelectVisible,
                  message: 'заполните поле',
                },
              ]}>
              <Select
                options={indexSelectOptionList.map(
                  (item, index) => {
                    return {
                      value: index,
                      label: item,
                    };
                  }
                )}
                allowClear
                onSelect={(v) => setIndex(v)}
              />
            </Form.Item>
          )}

          <div className='reg-form__flex-container'>
            <Form.Item
              name='duration'
              label='длительность'
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
              ]}>
              <Input
                suffix={plural(
                  Math.floor(
                    durationFormItemValue
                  ),
                  {
                    one: 'час',
                    few: 'часа',
                    many: 'часов',
                  }
                )}
              />
            </Form.Item>

            <Form.Item
              name='income'
              label='стоимость'
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
              ]}>
              <Input suffix='₽' />
            </Form.Item>
          </div>

          <Form.Item
            name='userId'
            label='клиент'
            rules={[
              {
                required: true,
                message: 'выберите клиента',
              },
            ]}>
            <UserSelect />
          </Form.Item>

          <div className='reg-form__flex-container'>
            <Form.Item name='date' label='дата'>
              <DatePicker
                format={DATE_FORMAT}
                disabled
              />
            </Form.Item>

            <Form.Item
              name='time'
              label='время'
              style={{ minWidth: 100 }}>
              <Select
                options={TIME_LIST.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
                disabled
              />
            </Form.Item>
          </div>

          <div className='reg-form__date-time-error'>
            {dateTimeError}
          </div>

          <Form.Item className='reg-form__btn-group'>
            <Button
              onClick={resetForm}
              className='reg-form__btn'>
              отменить
            </Button>

            <Button
              htmlType='submit'
              type='primary'
              className='reg-form__btn'
              loading={
                isRegLoading || isIncomeLoading
              }>
              сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
