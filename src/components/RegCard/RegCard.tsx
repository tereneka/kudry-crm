import './RegCard.css';
import {
  DbRegistration,
  User,
} from '../../types';
import { TIME_LIST } from '../../constants';
import {
  useDeleteRegistrationMutation,
  useGetServiceListQuery,
  useUpdateIncomeMutation,
} from '../../reducers/apiSlice';
import { getDataById } from '../../utils/data';
import {
  numberFormat,
  phoneFormat,
  plural,
} from '../../utils/format';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { useEffect } from 'react';
import {
  setDraggableRegCard,
  setRegCardInfo,
  setRegCardUser,
} from '../../reducers/regCardSlice';
import { Button, Popconfirm } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  ScheduleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { setIsRegModalOpen } from '../../reducers/regSlice';
import UserSocial from '../Social/UserSocial';
import { changeIncome } from '../../utils/reg';
import { setIsError } from '../../reducers/appSlice';

interface RegCardProps {
  reg: DbRegistration;
  user: User | undefined;
  type?: 'major' | 'copy';
  toggleTimeSelect?: (bool: boolean) => void;
}

export default function RegCard({
  reg,
  user,
  type = 'major',
  toggleTimeSelect = () => {},
}: RegCardProps) {
  const { data: serviceList } =
    useGetServiceListQuery();

  const { draggableRegCard, regCardInfo } =
    useAppSelector((state) => state.regCardState);
  const { isRegFormActive } = useAppSelector(
    (state) => state.regState
  );

  const [deleteReg, { isError, isSuccess }] =
    useDeleteRegistrationMutation();
  const [updateIncome] =
    useUpdateIncomeMutation();

  const dispatch = useAppDispatch();

  const cardClassName = `reg-card ${
    draggableRegCard === reg.id &&
    type === 'major'
      ? 'reg-card_invisible'
      : ''
  } ${
    type === 'copy' ? 'reg-card_type_copy' : ''
  }`;

  const cardStyle = {
    height: reg.duration * 58 - 4,
    top: 44 + TIME_LIST.indexOf(reg.time) * 58,
  };
  const regServiceNameList =
    reg.serviceIdList.map(
      (serviceId) =>
        getDataById(serviceList, serviceId)?.name
    );

  function handleMoveBtnClick() {
    dispatch(setDraggableRegCard(reg.id));
    dispatch(setRegCardInfo(reg));
    dispatch(setRegCardUser(user));
    toggleTimeSelect(true);
  }

  function handleCloseBtnClick() {
    dispatch(setRegCardInfo(null));
    dispatch(setRegCardUser(null));
    dispatch(setDraggableRegCard(null));
    toggleTimeSelect(false);
  }

  useEffect(() => {
    if (!regCardInfo) {
      dispatch(setDraggableRegCard(null));
    }
  }, [reg, regCardInfo]);

  useEffect(() => {
    dispatch(setIsError(isError));
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      changeIncome(
        reg.serviceIdList,
        serviceList,
        reg.date.toDate(),
        reg.serviceIndex,
        'minus',
        updateIncome
      );
    }
  }, [isSuccess]);

  return (
    <div
      className={cardClassName}
      style={cardStyle}
      key={reg.id}>
      {type === 'major' && (
        <div className='reg-card__btn-group'>
          <Button
            className='reg-card__move-btn'
            type='primary'
            size='small'
            danger
            disabled={isRegFormActive}
            icon={
              <ScheduleOutlined rev={undefined} />
            }
            onClick={handleMoveBtnClick}
          />

          <Button
            type='primary'
            size='small'
            danger
            icon={<EyeOutlined rev={undefined} />}
            onClick={() => {
              dispatch(setIsRegModalOpen(true));
              dispatch(setRegCardInfo(reg));
              dispatch(setRegCardUser(user));
            }}
          />

          <Popconfirm
            title='Удалить запись?'
            onConfirm={() => deleteReg(reg.id)}
            okText='да'
            okButtonProps={{
              danger: true,
            }}
            cancelText='нет'>
            <Button
              type='primary'
              size='small'
              danger
              icon={
                <DeleteOutlined rev={undefined} />
              }
            />
          </Popconfirm>
        </div>
      )}
      {type === 'copy' && (
        <Button
          className='reg-card__close-btn'
          type='primary'
          size='small'
          danger
          icon={<CloseOutlined rev={undefined} />}
          onClick={handleCloseBtnClick}
        />
      )}
      <div className='reg-card__box'>
        <p className='reg-card__name'>
          {user?.name}
        </p>

        <div className='reg-card__contacts'>
          <span>
            {phoneFormat(user?.phone || '')}
          </span>
          {!(draggableRegCard === reg.id) && (
            <UserSocial
              phone={user?.phone || ''}
            />
          )}
        </div>
      </div>

      {(reg.duration > 1 || type === 'copy') && (
        <>
          <div className='reg-card__box reg-card__number-list'>
            <span className='reg-card__number'>
              {`${
                reg.serviceIdList.length
              } ${plural(
                reg.serviceIdList.length,
                {
                  one: 'услуга',
                  few: 'услуги',
                  many: 'услуг',
                }
              )}`}
            </span>

            <span className='reg-card__number'>
              {`${reg.duration / 2} ${plural(
                Math.floor(reg.duration / 2),
                {
                  one: 'час',
                  few: 'часа',
                  many: 'часов',
                }
              )}`}
            </span>
            <span className='reg-card__number'>
              {numberFormat(reg.income)} &#8381;
            </span>
          </div>
          {reg.duration > 2 &&
          type === 'major' ? (
            <ul className='reg-card__box reg-card__service-list'>
              {regServiceNameList.map(
                (serviceName) => (
                  <li
                    className='reg-card__service'
                    key={serviceName}>
                    {serviceName}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className='reg-card__box reg-card__services-paragraph'>
              {regServiceNameList.join(', ')}
            </p>
          )}
        </>
      )}
    </div>
  );
}
