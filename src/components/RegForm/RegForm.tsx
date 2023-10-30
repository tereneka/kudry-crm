import {
  useEffect,
  useRef,
  useState,
} from 'react';
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
} from '../../reducers/apiSlice';
import {
  setIsDateError,
  setIsTimeError,
  setRegDuration,
  setRegFormValues,
  setRegStartTime,
} from '../../reducers/regSlice';
import {
  HAIR_LENGTH_LIST,
  INITIAL_REG_FORM_VALUES,
} from '../../constants';
import { useWatch } from 'antd/es/form/Form';
import {
  calculateRegTimeList,
  calculateServicesDuration,
  convertDateStringToDate,
} from '../../utils/utils';
import plural from '../../utils/plural';
import { Registration } from '../../types';

export default function RegForm() {
  const [form] = Form.useForm();

  const durationIndexFormItemValue = useWatch(
    'durationIndex',
    form
  );
  const serviceIdListFormItemValue = useWatch(
    'serviceIdList',
    form
  );

  const {
    regFormValues,
    regStartTime,
    regDuration,
  } = useAppSelector((state) => state.regState);

  const { currentMaster, prevMaster } =
    useAppSelector((state) => state.mastersState);
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { data: services } =
    useGetServiceListQuery();
  const { data: categories } =
    useGetCategoryListQuery();

  const [addReg, { isLoading }] =
    useAddRegistrationMutation();

  const [isFormOpened, setIsFormOpened] =
    useState(false);
  const [
    isDurationIndexItemVisible,
    setIsDurationIndexItemVisible,
  ] = useState(false);
  const [durationIndex, setDurationIndex] =
    useState(0);
  const [
    isSubmitBtnClicked,
    setIsSubmitBtnClicked,
  ] = useState(false);

  const dispatch = useAppDispatch();

  const isHairCategory =
    currentMaster?.categoryIdList.some(
      (categoryId) =>
        categories?.find(
          (category) => category.id === categoryId
        )?.name === 'парикмахерские услуги'
    );

  const isDateIncorrect =
    regFormValues.date.setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0);

  const filtredServices = services?.filter(
    (service) =>
      currentMaster?.categoryIdList.some(
        (id) => id === service.categoryId
      )
  );

  function toggleFormBtn() {
    setIsFormOpened(!isFormOpened);
  }

  function handleServiceChange(
    selectedServices: string[]
  ) {
    if (isHairCategory) {
      const isDurationIndexItemVisible =
        selectedServices.some((serviceID) =>
          services?.find(
            (service) =>
              service.id === serviceID &&
              service.duration.length > 1
          )
        );

      setIsDurationIndexItemVisible(
        isDurationIndexItemVisible
      );
    }
  }

  function handleFormSubmit(values: {
    userId: string;
    serviceIdList: string[];
  }) {
    const body = {
      ...regFormValues,
      serviceIdList: values.serviceIdList,
      userId: values.userId,
    } as Registration;

    dispatch(setRegFormValues(body));

    if (
      !isDateIncorrect &&
      regFormValues.time &&
      !isLoading
    ) {
      addReg(body)
        .then(() => {
          setIsFormOpened(false);
          resetForm();
        })
        .catch(() => showErrMessage());
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
        date: convertDateStringToDate(date),
      })
    );
    dispatch(setIsDateError(false));
    dispatch(setIsTimeError(false));
    dispatch(setRegStartTime(undefined));
    dispatch(setRegDuration(0));
  }

  const [messageApi, errorMessage] =
    message.useMessage();

  function showErrMessage() {
    messageApi.open({
      type: 'error',
      content: 'Произошла ошибка :(',
      duration: 4,
    });
  }

  useEffect(() => {
    dispatch(
      setRegFormValues({
        ...regFormValues,
        masterId: currentMaster?.id,
        date: convertDateStringToDate(date),
      })
    );
  }, [currentMaster, date]);

  useEffect(() => {
    setDurationIndex(
      durationIndexFormItemValue || 0
    );
  }, [durationIndexFormItemValue]);

  useEffect(() => {
    if (serviceIdListFormItemValue) {
      dispatch(
        setRegDuration(
          calculateServicesDuration(
            serviceIdListFormItemValue,
            services,
            durationIndex
          )
        )
      );
    }
  }, [serviceIdListFormItemValue, durationIndex]);

  useEffect(() => {
    dispatch(
      setRegFormValues({
        ...regFormValues,
        time: calculateRegTimeList(
          regStartTime,
          regDuration
        ),
      })
    );
  }, [regStartTime, regDuration]);

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

  useEffect(() => {
    let isMastersCategoriesSame = true;
    prevMaster?.categoryIdList.forEach(
      (categoryId) => {
        if (
          !currentMaster?.categoryIdList.includes(
            categoryId
          )
        ) {
          isMastersCategoriesSame = false;
        }
      }
    );

    if (isMastersCategoriesSame) {
      dispatch(
        setRegFormValues({
          ...regFormValues,
          masterId: currentMaster?.id,
        })
      );
      dispatch(setIsDateError(false));
      dispatch(setIsTimeError(false));
      dispatch(setRegStartTime(undefined));
    } else {
      setIsDurationIndexItemVisible(false);
      resetForm();
    }
  }, [currentMaster]);

  return (
    <div className='reg-form'>
      <Button
        className='reg-form__toggle-btn'
        shape='circle'
        icon={
          <PlusOutlined
            className={`reg-form__toggle-btn-icon ${
              isFormOpened
                ? 'reg-form__toggle-btn-icon_opened'
                : ''
            }`}
          />
        }
        type='primary'
        danger
        size='large'
        onClick={toggleFormBtn}
      />

      <div
        className={`reg-form__container ${
          isFormOpened
            ? 'reg-form__container_opened'
            : ''
        }`}>
        <div className='reg-form__header'>
          <h3 className='reg-form__title'>
            новая запись
          </h3>
          <p className='reg-form__duration'>
            {regDuration / 2}{' '}
            {plural(Math.floor(regDuration / 2), {
              one: 'час',
              few: 'часа',
              many: 'часов',
            })}
          </p>
        </div>

        <Form
          form={form}
          name='reg'
          onFinish={handleFormSubmit}
          layout='vertical'>
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
              options={filtredServices?.map(
                (service) => {
                  return {
                    value: service.id,
                    label: service.name,
                  };
                }
              )}
              mode='multiple'
              dropdownStyle={{
                position: 'fixed',
              }}
              allowClear
              showSearch
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.label ?? '').includes(
                  input
                )
              }
              onChange={handleServiceChange}
            />
          </Form.Item>

          {isDurationIndexItemVisible && (
            <Form.Item
              name='durationIndex'
              label='длина волос'
              rules={[
                {
                  required: true,
                  message: 'выберите длину волос',
                },
              ]}>
              <Select
                options={HAIR_LENGTH_LIST.map(
                  (item, index) => {
                    return {
                      value: index,
                      label: item,
                    };
                  }
                )}
                dropdownStyle={{
                  position: 'fixed',
                }}
                allowClear
                onSelect={(v) =>
                  setDurationIndex(v)
                }
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
                loading={isLoading}>
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
