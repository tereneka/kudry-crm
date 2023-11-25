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
import { plural } from '../../utils/format';
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

  const [form] = Form.useForm();

  const durationFormItemValue = useWatch(
    'duration',
    form
  );

  const dispatch = useAppDispatch();

  const [caculatedIncome, setCaculatedIncome] =
    useState(0);

  const endTime: string | undefined =
    TIME_LIST[
      TIME_LIST.indexOf(reg?.time || '') +
        durationFormItemValue * 2
    ];

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
  }

  function handleChangesSubmit() {
    form
      .validateFields()
      .then(
        (formValues: {
          userId: string;
          serviceIdList: string[];
          duration: number;
          income: number;
        }) => {
          const {
            userId,
            serviceIdList: newServiceIdList,
            duration,
            income,
          } = formValues;

          updateReg({
            id: reg?.id || '',
            body: {
              userId,
              serviceIdList: newServiceIdList,
              duration,
              income,
              priceCorrection:
                income / caculatedIncome,
            },
          })
            .then(() => {
              changeIncome(
                newServiceIdList,
                serviceList,
                convertDateStrToDate(date),
                reg?.serviceIndex || 0,
                income / caculatedIncome,
                'plus',
                updateIncome
              );

              changeIncome(
                reg?.serviceIdList || [],
                serviceList,
                convertDateStrToDate(date),
                reg?.serviceIndex || 0,
                reg?.priceCorrection || 1,
                'minus',
                updateIncome
              );
            })
            .then(() => {
              dispatch(
                setIsRegModalOpened(false)
              );
            });
        }
      );
  }

  function handleCancelClick() {
    dispatch(setIsRegModalOpened(false));
    dispatch(setRegCardInfo(null));
    dispatch(setRegCardUser(null));
    form.resetFields();
  }

  useEffect(() => {
    form.setFieldsValue({
      userId: user?.id || '',
      serviceIdList: reg?.serviceIdList || [],
    });
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
        initialValues={{
          duration: reg?.duration,
          income: reg?.income,
        }}
        name=''
        requiredMark={false}>
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
            className='reg-modal__form-item  reg-modal__form-item_type_wide'
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
            className='reg-modal__form-item reg-modal__form-item_type_wide'
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
              className='reg-modal__form-item reg-modal__form-item_type_slim'
              name='duration'
              label=''
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
              ]}>
              <Input
                addonAfter={plural(
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
              className='reg-modal__form-item reg-modal__form-item_type_slim'
              name='income'
              label=''
              rules={[
                {
                  required: true,
                  message: 'заполните поле',
                },
              ]}>
              <Input addonAfter='₽' />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
