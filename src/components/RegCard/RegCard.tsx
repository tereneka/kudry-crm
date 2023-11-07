import './RegCard.css';
import phone from '../../images/phone.svg';
import whatsapp from '../../images/whatsapp.svg';
import {
  DbRegistration,
  Income,
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
import {
  Button,
  Popconfirm,
  message,
} from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';

interface RegCardProps {
  reg: DbRegistration;
  user: User | undefined;
  type?: 'major' | 'copy';
}

export default function RegCard({
  reg,
  user,
  type = 'major',
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

  const [messageApi, errorMessage] =
    message.useMessage();

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
  }

  function handleCloseBtnClick() {
    dispatch(setRegCardInfo(null));
    dispatch(setRegCardUser(null));
    dispatch(setDraggableRegCard(null));
  }

  function showErrMessage() {
    messageApi.open({
      type: 'error',
      content: 'Произошла ошибка :(',
      duration: 4,
    });
  }

  useEffect(() => {
    if (!regCardInfo) {
      dispatch(setDraggableRegCard(null));
    }
  }, [reg]);

  useEffect(() => {
    if (isError) showErrMessage();
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      const incomeBodyList: Omit<Income, 'id'>[] =
        [];

      Promise.allSettled(
        reg.serviceIdList.map((serviceId, i) => {
          const service = getDataById(
            serviceList,
            serviceId
          );
          incomeBodyList.push({
            serviceId,
            categoryId: service?.categoryId || '',
            date: reg.date.toDate(),
            sum: service
              ? -+service.price.split('/')[
                  reg.serviceIndex
                ] || 0
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
            icon={<ScheduleOutlined />}
            onClick={handleMoveBtnClick}
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
              icon={<DeleteOutlined />}
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
          icon={<CloseOutlined />}
          onClick={handleCloseBtnClick}
        />
      )}
      <div className='reg-card__box'>
        <p className='reg-card__name'>
          {user?.name}
        </p>

        <div className='reg-card__contacts'>
          <span>{user?.phone}</span>
          {!(draggableRegCard === reg.id) && (
            <ul className='reg-card__link-list'>
              <li>
                <a
                  className='reg-card__link'
                  href={`tel:${user?.phone}`}>
                  <img
                    className='reg-card__link-icon'
                    src={phone}
                    alt=''
                  />
                </a>
              </li>
              <li>
                <a
                  className='reg-card__link'
                  target='_blank'
                  href={`https://wa.me/${user?.phone.slice(
                    1
                  )}`}
                  rel='noreferrer'>
                  <img
                    className='reg-card__link-icon'
                    src={whatsapp}
                    alt='whatsapp'
                  />
                </a>
              </li>
            </ul>
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
      {errorMessage}
    </div>
  );
}
