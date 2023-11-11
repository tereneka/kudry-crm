import { useEffect, useState } from 'react';
import './RegForm.css';
import {
  Button,
  Form,
  Select,
  message,
  notification,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
  HAIR_LENGTH_LIST,
  INITIAL_REG_FORM_VALUES,
  MAILE_HAIRCAT_LIST,
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
import {
  Income,
  Registration,
} from '../../types';
import { classByCondition } from '../../utils/className';
import {
  convertDateStrToDate,
  isDateBeforeToday,
} from '../../utils/date';
import { getDataById } from '../../utils/data';
import { plural } from '../../utils/format';
import ServicesSelect from '../ServicesSelect/ServicesSelect';
import { setIsError } from '../../reducers/appSlice';

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

  const [notificationApi, validationMessage] =
    notification.useNotification();

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

  const isHairCategory = hasMasterHairCategory(
    currentMaster,
    categoryList
  );
  const isDateIncorrect = isDateBeforeToday(
    convertDateStrToDate(date)
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

  function toggleFormBtn() {
    setIsFormOpened(!isFormOpened);
    dispatch(setIsRegFormActive(true));
    const isFormEmpty = !Object.values(
      form.getFieldsValue()
    ).some((value) => value);
    if (isFormEmpty && isRegFormActive) {
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
      !isDateIncorrect &&
      regFormValues.time &&
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
    } else if (isDateIncorrect) {
      openNotification(
        'некорректная дата',
        'date'
      );
    } else if (!regFormValues.time) {
      openNotification('выберите время', 'time');
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
    notificationApi.destroy('date');
    notificationApi.destroy('time');
  }

  function openNotification(
    message: string,
    key: 'date' | 'time'
  ) {
    notificationApi.open({
      message,
      duration: 0,
      type: 'error',
      key,
      placement: 'bottomRight',
      className: 'reg-form__valid-message',
    });
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

  // валидация полей даты и времени
  useEffect(() => {
    if (!isDateIncorrect) {
      notificationApi.destroy('date');
    }
    if (regFormValues.time) {
      notificationApi.destroy('time');
    }
  }, [isDateIncorrect, regFormValues]);

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
      <Button
        className='reg-form__toggle-btn'
        type='primary'
        shape='circle'
        danger={!isRegFormActive}
        icon={
          <PlusOutlined
            className={classByCondition(
              'reg-form__toggle-btn-icon',
              isFormOpened,
              'opened'
            )}
            rev={undefined}
          />
        }
        onClick={toggleFormBtn}
      />

      <div
        className={classByCondition(
          'reg-form__container',
          isFormOpened,
          'opened'
        )}>
        <div className='reg-form__header'>
          <h3 className='reg-form__title'>
            новая запись
          </h3>
          <p className='reg-form__duration'>
            {durationCounterText}
          </p>
        </div>

        <Form
          form={form}
          name='reg'
          onFinish={handleFormSubmit}
          layout='vertical'
          requiredMark={false}>
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

          <Form.Item className='reg-form__btns-item'>
            <div className='reg-form__btn-group'>
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
            </div>
          </Form.Item>
        </Form>
      </div>
      {validationMessage}
    </div>
  );
}
