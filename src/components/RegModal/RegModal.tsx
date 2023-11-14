import './RegModal.css';
import { Form, Modal } from 'antd';
import { useEffect, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setIsRegModalOpened } from '../../reducers/regSlice';
import {
  DbRegistration,
  User,
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
  getServiceIdListsForUpdating,
} from '../../utils/reg';
import { TIME_LIST } from '../../constants';
import { numberFormat } from '../../utils/format';
import ServicesSelect from '../ServicesSelect/ServicesSelect';
import { convertDateStrToDate } from '../../utils/date';
import { setIsError } from '../../reducers/appSlice';
import {
  setRegCardInfo,
  setRegCardUser,
} from '../../reducers/regCardSlice';

interface RegModalProps {
  reg: DbRegistration | null;
  user: User | undefined | null;
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

  const dispatch = useAppDispatch();

  const [regFieldsValues, setRegFieldsValues] =
    useState({
      duration: 0,
      income: 0,
    });

  function handleServiceChange(
    selectedServiceIdList: string[]
  ) {
    const { duration, income } =
      calculateRegDurationAndIncome(
        selectedServiceIdList,
        serviceList,
        reg?.serviceIndex || 0
      );
    setRegFieldsValues({ duration, income });
  }

  function handleChangesSubmit() {
    form
      .validateFields()
      .then(
        (formValues: {
          userId: string;
          serviceIdList: string[];
        }) => {
          const {
            userId,
            serviceIdList: newServiceIdList,
          } = formValues;
          const { duration, income } =
            regFieldsValues;
          const {
            addedServiceIdList,
            deletedServiceIdList,
          } = getServiceIdListsForUpdating(
            reg?.serviceIdList,
            newServiceIdList
          );
          updateReg({
            id: reg?.id || '',
            body: {
              userId,
              serviceIdList: newServiceIdList,
              duration,
              income,
            },
          })
            .then(() => {
              changeIncome(
                addedServiceIdList,
                serviceList,
                convertDateStrToDate(date),
                reg?.serviceIndex || 0,
                'plus',
                updateIncome
              );

              changeIncome(
                deletedServiceIdList,
                serviceList,
                convertDateStrToDate(date),
                reg?.serviceIndex || 0,
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
    setRegFieldsValues({
      duration: reg?.duration || 0,
      income: reg?.income || 0,
    });
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
        name=''
        requiredMark={false}>
        <div className='reg-modal__date-time-container'>
          <span>{date}</span>
          <span>
            {reg?.time}
            &mdash;
            {
              TIME_LIST[
                TIME_LIST.indexOf(
                  reg?.time || ''
                ) + regFieldsValues.duration
              ]
            }
          </span>
        </div>

        <div className='reg-modal__box'>
          <UserSelect
            suffixIcon
            classModifier='place_reg-modal'
          />

          <UserSocial
            phone={user?.phone || ''}
            className='reg-modal__user-social'
          />
        </div>

        <div className='reg-modal__box'>
          <ServicesSelect
            serviceList={filterServicesByGender(
              filterServicesByMaster(
                serviceList,
                currentMaster
              ),
              reg?.gender
            )}
            suffixIcon
            onChange={handleServiceChange}
          />
          <span className='reg-modal__income'>
            {numberFormat(regFieldsValues.income)}{' '}
            &#8381;
          </span>
        </div>
      </Form>
    </Modal>
  );
}
