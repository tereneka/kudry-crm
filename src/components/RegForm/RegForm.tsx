import { useEffect, useState } from 'react';
import './RegForm.css';
import {
  Badge,
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
  useAddRegistrationMutation,
  useGetCategoryListQuery,
  useGetServiceListQuery,
  useUpdateIncomeMutation,
} from '../../reducers/apiSlice';
import {
  setIsRegFormActive,
  setRegFormValues,
} from '../../reducers/regSlice';
import {
  DATE_FORMAT,
  HAIR_LENGTH_LIST,
  INITIAL_REG_FORM_VALUES,
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

  const { isRegFormActive, regFormValues } =
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

  const durationCounterText = `${
    regFormValues.duration / 2
  } 
            ${plural(
              Math.floor(
                regFormValues.duration / 2
              ),
              {
                one: 'час',
                few: 'часа',
                many: 'часов',
              }
            )}`;

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

  function handleServiceChange(
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
    index?: number;
    gender?: 'male' | 'female';
  }) {
    const {
      userId,
      serviceIdList,
      index,
      gender,
    } = values;
    const regBody = {
      ...regFormValues,
      masterId: currentMaster?.id,
      date: convertDateStrToDate(date),
      serviceIdList,
      userId,
      serviceIndex: index || 0,
      gender:
        gender === undefined ? null : gender,
    } as Registration;

    dispatch(setRegFormValues(regBody));

    if (
      regFormValues.time &&
      regFormValues.date &&
      !isRegLoading &&
      !isIncomeLoading
    ) {
      changeIncome(
        serviceIdList,
        serviceList,
        convertDateStrToDate(date),
        index || 0,
        'plus',
        updateIncome
      );
      addReg(regBody);
    } else if (
      !regFormValues.time ||
      !regFormValues.date
    ) {
      setDateTimeError(
        '← выберите дату и время в планере'
      );
    }
  }

  function resetForm() {
    form.resetFields();
    dispatch(
      setRegFormValues({
        ...INITIAL_REG_FORM_VALUES,
        masterId: currentMaster?.id,
        date: convertDateStrToDate(date),
      })
    );

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
      dispatch(
        setRegFormValues({
          ...regFormValues,
          duration,
          income,
        })
      );
    } else {
      dispatch(
        setRegFormValues({
          ...regFormValues,
          duration: 0,
          income: 0,
        })
      );
    }
  }, [serviceIdListFormItemValue, index]);

  // изменение и валидация полей даты и времени
  useEffect(() => {
    if (regFormValues.time) {
      setDateTimeError('');
      form.setFieldValue(
        'time',
        regFormValues.time
      );
    }
  }, [regFormValues]);

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
        dispatch(
          setRegFormValues({
            ...regFormValues,
            masterId: currentMaster?.id,
            time: undefined,
          })
        );
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
            ? regFormValues.duration / 2 + 'ч.'
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
        title={
          <div className='reg-form__header'>
            <h3 className='reg-form__title'>
              новая запись
            </h3>
            <p className='reg-form__duration'>
              {durationCounterText}
            </p>
          </div>
        }
        open={isFormOpened}
        onClose={closeForm}>
        <Form
          form={form}
          name='reg'
          onFinish={handleFormSubmit}
          onFinishFailed={() => {
            if (!regFormValues.time) {
              setDateTimeError(
                '← выберите дату и время в планере'
              );
            }
          }}
          layout='vertical'
          requiredMark={false}
          initialValues={{
            date: dayjs(date, DATE_FORMAT),
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

          <ServicesSelect
            serviceList={filterServicesByGender(
              filteredServicesByMaster,
              genderFormItemValue
            )}
            label='услуги'
            onChange={handleServiceChange}
            disabled={
              isHairCategory &&
              !!!genderFormItemValue
            }
          />

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

          <UserSelect label='клиент' />

          <div className='reg-form__date-time-container'>
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
