import { useEffect, useState } from 'react';
import './RegForm.css';
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
} from 'antd';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  useAddRegistrationMutation,
  useAddUserMutation,
  useGetCategoryListQuery,
  useGetServiceListQuery,
  useUpdateIncomeMutation,
} from '../../reducers/apiSlice';
import {
  setRegFormDuration,
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
import { convertDateStrToDate } from '../../utils/date';
import {
  convertStrToNum,
  formatToDecimalNumber,
  numberFormat,
  plural,
} from '../../utils/format';
import ServicesSelect from '../ServicesSelect/ServicesSelect';
import { setIsError } from '../../reducers/appSlice';
import dayjs from 'dayjs';
import {
  ClockCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  setIsFormActive,
  setOpenedFormName,
} from '../../reducers/plannerSlice';
import ClientSelect from '../ClientSelect/ClientSelect';

export default function RegForm() {
  const [form] = Form.useForm<{
    serviceIdList: string[];
    date: Date;
    time: string;
    duration: string;
    income: string;
    priceCorrection: number;
    index: number;
    gender: 'male' | 'female';
    userId?: string;
    name?: string;
    phone?: string;
  }>();

  const genderFormItemValue = useWatch(
    'gender',
    form
  );
  const serviceIdListFormItemValue = useWatch(
    'serviceIdList',
    form
  );
  const durationFormItemValue = useWatch(
    'duration',
    form
  );

  const { openedFormName, isFormActive } =
    useAppSelector((state) => state.plannerState);
  const { regFormTime } = useAppSelector(
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
  const [
    addClient,
    {
      isLoading: isAddClientLoading,
      isError: isAddClientError,
    },
  ] = useAddUserMutation();

  const [
    isIndexSelectVisible,
    setIsIndexSelectVisible,
  ] = useState(false);
  const [index, setIndex] = useState(0);
  const [dateTimeError, setDateTimeError] =
    useState('');
  const [caculatedIncome, setCaculatedIncome] =
    useState(0);
  const [isNewClient, setIsNewClient] =
    useState(false);

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
    genderFormItemValue === 'female'
      ? HAIR_LENGTH_LIST
      : MAILE_HAIRCAT_LIST;
  const dispatch = useAppDispatch();

  function closeForm() {
    const isFormEmpty =
      Object.values(form.getFieldsValue()).filter(
        (field) => field
      ).length < 4;
    dispatch(setOpenedFormName(''));
    if (isFormEmpty) {
      resetForm();
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

  function handleNumberInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'duration' | 'income'
  ) {
    form.setFieldValue(
      fieldName,
      formatToDecimalNumber(e.target.value)
    );

    if (fieldName === 'duration') {
      dispatch(
        setRegFormDuration(e.target.value)
      );
    }
  }

  function handleNumberInputBlur(
    e: React.FocusEvent<
      HTMLInputElement,
      Element
    >,
    fieldName: 'duration' | 'income'
  ) {
    form.setFieldValue(
      fieldName,
      numberFormat(
        convertStrToNum(e.target.value)
      )
    );
  }

  function handleFormSubmit(values: {
    serviceIdList: string[];
    duration: string;
    income: string;
    index?: number;
    gender?: 'male' | 'female';
    userId?: string;
    name?: string;
    phone?: string;
  }) {
    const {
      userId,
      name,
      phone,
      serviceIdList,
      duration,
      income,
      index,
      gender,
    } = values;

    const durationNum = convertStrToNum(duration);
    const incomeNum = convertStrToNum(income);

    const body = {
      serviceIdList,
      masterId: currentMaster?.id || '',
      date: convertDateStrToDate(date),
      time: regFormTime,
      duration: durationNum,
      income: incomeNum,
      priceCorrection:
        incomeNum / caculatedIncome,
      serviceIndex: index || 0,
      gender:
        gender === undefined ? null : gender,
    };

    function addRegistration(userId: string) {
      if (!isRegLoading && !isIncomeLoading) {
        changeIncome(
          currentMaster,
          serviceIdList,
          serviceList,
          convertDateStrToDate(date),
          index || 0,
          incomeNum / caculatedIncome,
          'plus',
          updateIncome
        );
        addReg({ ...body, userId });
      }
    }

    if (regFormTime && date) {
      if (userId) {
        addRegistration(userId);
      } else if (
        name &&
        phone &&
        !isAddClientLoading
      ) {
        addClient({
          name,
          phone: '+7' + phone,
        }).then(
          (res: {
            data?: string;
            error?: any;
          }) => {
            if (
              res.data &&
              !isAddClientError &&
              !isAddClientLoading
            ) {
              addRegistration(res.data);
            }
          }
        );
      }
    } else {
      setDateTimeError(
        '← выберите дату и время в планере'
      );
    }
  }

  function resetForm() {
    form.resetFields();
    dispatch(setRegFormTime(''));
    dispatch(setRegFormDuration(''));
    dispatch(setIsFormActive(false));
    dispatch(setOpenedFormName(''));
    setIndex(0);
    setIsIndexSelectVisible(false);
    setCaculatedIncome(0);
    setDateTimeError('');
    setIsNewClient(false);
  }

  // вычисляем продолжительность регистрации и стоимость
  useEffect(() => {
    if (
      serviceIdListFormItemValue &&
      serviceIdListFormItemValue.length > 0
    ) {
      const { duration, income } =
        calculateRegDurationAndIncome(
          serviceIdListFormItemValue,
          serviceList,
          index
        );
      form.setFieldsValue({
        duration: numberFormat(duration),
        income: numberFormat(income),
      });
      setCaculatedIncome(income);
      dispatch(
        setRegFormDuration(duration.toString())
      );
    } else {
      form.setFieldsValue({
        duration: '0',
        income: '0',
      });
      setCaculatedIncome(0);
      dispatch(setRegFormDuration(''));
    }
  }, [serviceIdListFormItemValue, index]);

  // изменение и валидация полей даты и времени
  useEffect(() => {
    form.setFieldValue('time', regFormTime);
    if (regFormTime) {
      setDateTimeError('');
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
    if (isFormActive) {
      if (
        isMastersCategoriesSame(
          prevMaster,
          currentMaster
        )
      ) {
        dispatch(setRegFormTime(''));
      } else {
        resetForm();
      }
    }
  }, [currentMaster]);

  // обработка результата отправки формы регистрации
  useEffect(() => {
    dispatch(setIsError(isError));
    if (isSuccess) {
      resetForm();
    }
  }, [isError, isSuccess]);
  useEffect(() => {
    dispatch(setIsError(isAddClientError));
  }, [isAddClientError]);

  return (
    <div className='reg-form'>
      <Drawer
        title='НОВАЯ ЗАПИСЬ'
        width={400}
        open={openedFormName === 'addReg'}
        onClose={closeForm}>
        <Form
          form={form}
          name='addReg'
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
            duration: '0',
            income: '0',
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
                onChange={(v) => setIndex(v || 0)}
              />
            </Form.Item>
          )}

          <div className='reg-form__items-group'>
            <Form.Item
              className='reg-form__numeric-item'
              name='duration'
              label='длительность'
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
                {
                  validator: (_, value: string) =>
                    convertStrToNum(value) > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            'значение должно быть больше 0'
                          )
                        ),
                },
              ]}>
              <Input
                suffix={
                  durationFormItemValue ? (
                    plural(
                      Math.floor(
                        convertStrToNum(
                          durationFormItemValue
                        )
                      ),
                      {
                        one: 'час',
                        few: 'часа',
                        many: 'часов',
                      }
                    )
                  ) : (
                    <></>
                  )
                }
                onChange={(e) =>
                  handleNumberInputChange(
                    e,
                    'duration'
                  )
                }
                onBlur={(e) =>
                  handleNumberInputBlur(
                    e,
                    'duration'
                  )
                }
                allowClear
              />
            </Form.Item>

            <Form.Item
              className='reg-form__numeric-item'
              name='income'
              label='стоимость'
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
              ]}>
              <Input
                suffix='₽'
                onChange={(e) =>
                  handleNumberInputChange(
                    e,
                    'income'
                  )
                }
                onBlur={(e) =>
                  handleNumberInputBlur(
                    e,
                    'income'
                  )
                }
                allowClear
              />
            </Form.Item>
          </div>

          {isNewClient ? (
            <>
              <Divider
                style={{
                  marginTop: 0,
                  marginBottom: 12,
                }}
              />
              <div className='reg-form__new-client-header'>
                <Button
                  type='text'
                  icon={
                    <CloseOutlined
                      rev={undefined}
                    />
                  }
                  onClick={() =>
                    setIsNewClient(false)
                  }
                  style={{
                    color:
                      'rgba(60, 60, 60, 0.45)',
                  }}
                />
                <h4 className='reg-form__new-client-title'>
                  новый клиент
                </h4>
              </div>

              <Form.Item
                name='name'
                label='имя'
                rules={[
                  {
                    required: true,
                    message: 'введите имя',
                  },
                ]}>
                <Input allowClear />
              </Form.Item>

              <Form.Item
                name='phone'
                label='телефон'
                rules={[
                  {
                    required: true,
                    message:
                      'введите номер телефона',
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
                  allowClear
                />
              </Form.Item>
              <Divider />
            </>
          ) : (
            <Form.Item
              name='userId'
              label='клиент'
              rules={[
                {
                  required: true,
                  message: 'выберите клиента',
                },
              ]}>
              <ClientSelect
                isAddClientBtn={true}
                onAddClientBtnClick={() => {
                  setIsNewClient(true);
                  form.setFieldValue(
                    'userId',
                    ''
                  );
                }}
              />
            </Form.Item>
          )}

          <div className='reg-form__items-group'>
            <Form.Item
              className='reg-form__numeric-item'
              name='date'
              label=''>
              <DatePicker
                format={DATE_FORMAT}
                disabled
              />
            </Form.Item>

            <Form.Item
              className='reg-form__numeric-item'
              name='time'
              label=''>
              <Select
                options={TIME_LIST.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
                disabled
                suffixIcon={
                  <ClockCircleOutlined
                    rev={undefined}
                  />
                }
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
                isRegLoading ||
                isIncomeLoading ||
                isAddClientLoading
              }>
              сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
