import './RegModal.css';
import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setIsRegModalOpened } from '../../reducers/regSlice';
import {
  DbRegistration,
  RegUser,
} from '../../types';
import UserSelect from '../UserSelect/UserSelect';
import UserSocial from '../Social/UserSocial';
import {
  useGetServiceListQuery,
  useUpdateIncomeMutation,
  useUpdateRegistrationMutation,
} from '../../reducers/apiSlice';
import {
  calculateRegDurationAndIncome,
  changeIncome,
  filterServicesByGender,
  filterServicesByMaster,
} from '../../utils/reg';
import { TIME_LIST } from '../../constants';
import {
  convertStrToNum,
  formatToDecimalNumber,
  numberFormat,
  plural,
} from '../../utils/format';
import ServicesSelect from '../ServicesSelect/ServicesSelect';
import { convertDateStrToDate } from '../../utils/date';
import { setIsError } from '../../reducers/appSlice';
import {
  setRegCardInfo,
  setRegCardUser,
} from '../../reducers/regCardSlice';
import { useWatch } from 'antd/es/form/Form';

interface RegModalProps {
  reg: DbRegistration | null;
  user: RegUser | undefined | null;
}

export default function RegModal({
  reg,
  user,
}: RegModalProps) {
  const { isRegModalOpened } = useAppSelector(
    (state) => state.regState
  );
  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );
  const { date } = useAppSelector(
    (state) => state.calendarState
  );

  const { data: serviceList } =
    useGetServiceListQuery();
  const [
    updateReg,
    { isError, isLoading: isUpdatingRegLoading },
  ] = useUpdateRegistrationMutation();
  const [
    updateIncome,
    { isLoading: isUpdatingIncomeLoading },
  ] = useUpdateIncomeMutation();

  const [form] = Form.useForm<{
    userId: string;
    serviceIdList: string[];
    duration: string;
    income: string;
  }>();

  const durationFormItemValue = useWatch(
    'duration',
    form
  );

  const dispatch = useAppDispatch();

  const [caculatedIncome, setCaculatedIncome] =
    useState(0);
  // const [endTime, setEndTime] = useState('');

  const endTime = durationFormItemValue
    ? TIME_LIST[
        TIME_LIST.indexOf(reg?.time || '') +
          convertStrToNum(durationFormItemValue) *
            2
      ]
    : '';

  function handleServicesChange(
    selectedServiceIdList: string[]
  ) {
    const { duration, income } =
      calculateRegDurationAndIncome(
        selectedServiceIdList,
        serviceList,
        reg?.serviceIndex || 0
      );
    if (selectedServiceIdList.length > 0) {
      form.setFieldsValue({
        duration: numberFormat(duration),
        income: numberFormat(income),
      });
      setCaculatedIncome(income);
    } else {
      form.setFieldsValue({
        duration: '0',
        income: '0',
      });
      setCaculatedIncome(0);
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
  }

  function handleNumberInputBlur(
    e: React.FocusEvent<
      HTMLInputElement,
      Element
    >,
    fieldName: 'duration' | 'income'
  ) {
    const num = convertStrToNum(e.target.value);
    const fieldValue =
      fieldName === 'duration' && num % 0.5
        ? Math.round(num)
        : num;

    form.setFieldValue(
      fieldName,
      numberFormat(fieldValue)
    );
  }

  function handleChangesSubmit() {
    form.validateFields().then((formValues) => {
      const {
        userId,
        serviceIdList: newServiceIdList,
        duration,
        income,
      } = formValues;
      const durationNum =
        convertStrToNum(duration);
      const incomeNum = convertStrToNum(income);

      const priceCorrection = caculatedIncome
        ? incomeNum / caculatedIncome
        : incomeNum /
          calculateRegDurationAndIncome(
            newServiceIdList,
            serviceList,
            reg?.serviceIndex || 0
          ).income;

      updateReg({
        id: reg?.id || '',
        body: {
          userId,
          serviceIdList: newServiceIdList,
          duration: durationNum,
          income: incomeNum,
          priceCorrection,
        },
      })
        .then(() => {
          changeIncome(
            reg?.serviceIdList || [],
            serviceList,
            convertDateStrToDate(date),
            reg?.serviceIndex || 0,
            reg?.priceCorrection || 0,
            'minus',
            updateIncome
          ).then(() => {
            changeIncome(
              newServiceIdList,
              serviceList,
              convertDateStrToDate(date),
              reg?.serviceIndex || 0,
              priceCorrection,
              'plus',
              updateIncome
            );
          });
        })
        .then(() => {
          dispatch(setIsRegModalOpened(false));
        });
    });
  }

  function handleCancelClick() {
    dispatch(setIsRegModalOpened(false));
    dispatch(setRegCardInfo(null));
    dispatch(setRegCardUser(null));
    form.resetFields();
  }

  useEffect(() => {
    if (reg && user) {
      form.setFieldsValue({
        userId: user.id,
        serviceIdList: reg?.serviceIdList || [],
        duration: numberFormat(reg.duration),
        income: numberFormat(reg.income),
      });
    }
  }, [reg, user]);

  useEffect(() => {
    dispatch(setIsError(isError));
  }, [isError]);

  return (
    <Modal
      className='reg-modal'
      classNames={{ footer: 'reg-modal__footer' }}
      open={isRegModalOpened}
      okText='изменить'
      cancelText='отменить'
      width={600}
      cancelButtonProps={{
        style: { display: 'none' },
      }}
      onOk={handleChangesSubmit}
      onCancel={handleCancelClick}
      confirmLoading={
        isUpdatingRegLoading ||
        isUpdatingIncomeLoading
      }>
      <Form
        className='reg-modal__form'
        form={form}
        name='editReg'
        requiredMark={false}
        validateTrigger='onSubmit'>
        <div className='reg-modal__date-time-container'>
          <span>{date}</span>
          <span>
            {reg?.time}
            &mdash;
            {endTime ? endTime : '00:00...'}
          </span>
        </div>

        <div className='reg-modal__box'>
          <Form.Item
            className='reg-modal__select-item'
            name='userId'
            rules={[
              {
                required: true,
                message: 'выберите клиента',
              },
            ]}>
            <UserSelect
              value={user?.id}
              suffixIcon
            />
          </Form.Item>

          <UserSocial
            phone={user?.phone || ''}
            className='reg-modal__user-social'
          />
        </div>

        <div className='reg-modal__box'>
          <Form.Item
            className='reg-modal__select-item'
            name='serviceIdList'
            rules={[
              {
                required: true,
                message: 'выберите услуги',
              },
            ]}>
            <ServicesSelect
              serviceList={filterServicesByGender(
                filterServicesByMaster(
                  serviceList,
                  currentMaster
                ),
                reg?.gender
              )}
              value={reg?.serviceIdList}
              suffixIcon
              onChange={handleServicesChange}
            />
          </Form.Item>

          <div className='reg-modal__duration-income-container'>
            <Form.Item
              className='reg-modal__numeric-item'
              name='duration'
              label=''
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
                {
                  validator: (_, value) =>
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
                  <span className='reg-modal__input-suffix'>
                    ч.
                  </span>
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
              className='reg-modal__numeric-item'
              name='income'
              label=''
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
              ]}>
              <Input
                suffix={
                  <span className='reg-modal__input-suffix'>
                    ₽
                  </span>
                }
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
        </div>
      </Form>
    </Modal>
  );
}
