import { useEffect, useState } from 'react';
import './RegForm.css';
import {
  Button,
  Form,
  Select,
  message,
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
  setIsDateError,
  setIsTimeError,
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

export default function RegForm() {
  const [form] = Form.useForm();

  const genderFormItemValue:
    | 'женский'
    | 'мужской'
    | undefined = useWatch('gender', form);
  const serviceIdListFormItemValue = useWatch(
    'serviceIdList',
    form
  );
  const indexFormItemValue = useWatch(
    'index',
    form
  );

  const [messageApi, errorMessage] =
    message.useMessage();

  const { regFormValues } = useAppSelector(
    (state) => state.regState
  );

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
  const [isFormActive, setIsFormActive] =
    useState(false);
  const [
    isIndexSelectVisible,
    setIsIndexSelectVisible,
  ] = useState(false);
  const [index, setIndex] = useState(0);
  const [
    isSubmitBtnClicked,
    setIsSubmitBtnClicked,
  ] = useState(false);

  const isHairCategory = hasMasterHairCategory(
    currentMaster,
    categoryList
  );
  const isDateIncorrect = isDateBeforeToday(
    regFormValues.date
  );
  const filteredServicesByMaster =
    filterServicesByMaster(
      serviceList,
      currentMaster
    );
  const indexSelectOptionList =
    genderFormItemValue
      ? genderFormItemValue === 'женский'
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
    setIsFormActive(true);
    const isFormEmpty = !Object.values(
      form.getFieldsValue()
    ).some((value) => value);
    if (isFormEmpty && isFormActive)
      setIsFormActive(false);
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
  }) {
    const { userId, serviceIdList } = values;
    const regBody = {
      ...regFormValues,
      serviceIdList,
      userId,
    } as Registration;
    const incomeBodyList: Omit<Income, 'id'>[] =
      [];

    dispatch(setRegFormValues(regBody));

    if (
      !isDateIncorrect &&
      regFormValues.time &&
      !isRegLoading &&
      !isIncomeLoading
    ) {
      Promise.allSettled(
        serviceIdList.map((serviceId, i) => {
          const service = getDataById(
            serviceList,
            serviceId
          );
          incomeBodyList.push({
            serviceId,
            categoryId: service?.categoryId || '',
            date: regFormValues.date,
            sum: service
              ? +service.price.split('/')[index]
              : 0,
          });
          return updateIncome(incomeBodyList[i]);
        })
      ).then((results) => {
        results.forEach((result, i) => {
          console.log(result.status);

          if (result.status === 'rejected') {
            updateIncome(incomeBodyList[i]);
          }
        });
      });

      addReg(regBody);
    } else {
      setIsSubmitBtnClicked(true);
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
    dispatch(setIsDateError(false));
    dispatch(setIsTimeError(false));
    setIsFormOpened(false);
    setIsFormActive(false);
  }

  function showErrMessage() {
    messageApi.open({
      type: 'error',
      content: 'Произошла ошибка :(',
      duration: 4,
    });
  }

  // вносим в форму данные выбранных мастера и даты
  useEffect(() => {
    dispatch(
      setRegFormValues({
        ...regFormValues,
        masterId: currentMaster?.id,
        date: convertDateStrToDate(date),
      })
    );
  }, [currentMaster, date]);

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
    if (
      isSubmitBtnClicked &&
      !regFormValues.time
    ) {
      dispatch(setIsTimeError(true));
    } else if (
      !isSubmitBtnClicked &&
      regFormValues.time
    ) {
      dispatch(setIsTimeError(false));
    }

    if (isSubmitBtnClicked && isDateIncorrect) {
      dispatch(setIsDateError(true));
    } else if (
      !isSubmitBtnClicked &&
      !isDateIncorrect
    ) {
      dispatch(setIsDateError(false));
    }
    setIsSubmitBtnClicked(false);
  }, [regFormValues, isSubmitBtnClicked]);

  // описываем действия при смене мастера
  useEffect(() => {
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
      dispatch(setIsDateError(false));
      dispatch(setIsTimeError(false));
    } else {
      setIsIndexSelectVisible(false);
      resetForm();
    }
  }, [currentMaster]);

  // обработка результата отправки формы регистрации
  useEffect(() => {
    if (isError) showErrMessage();
    if (isSuccess) resetForm();
  }, [isError, isSuccess]);

  return (
    <div className='reg-form'>
      <Button
        className='reg-form__toggle-btn'
        type='primary'
        shape='circle'
        danger={!isFormActive}
        icon={
          <PlusOutlined
            className={classByCondition(
              'reg-form__toggle-btn-icon',
              'opened',
              isFormOpened
            )}
          />
        }
        onClick={toggleFormBtn}
      />

      <div
        className={classByCondition(
          'reg-form__container',
          'opened',
          isFormOpened
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
          layout='vertical'>
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
                    value: item,
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
            <Select
              options={filterServicesByGender(
                filteredServicesByMaster,
                genderFormItemValue
              )?.map((service) => {
                return {
                  value: service.id,
                  label: service.name,
                };
              })}
              mode='multiple'
              showSearch
              allowClear
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.label ?? '').includes(
                  input
                )
              }
              onChange={handleServiceChange}
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
                genderFormItemValue === 'женский'
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

          <UserSelect
            showErrMessage={showErrMessage}
          />

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
      {errorMessage}
    </div>
  );
}
