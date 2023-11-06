import './RegCard.css';
import phone from '../../images/phone.svg';
import whatsapp from '../../images/whatsapp.svg';
import {
  DbRegistration,
  User,
} from '../../types';
import { TIME_LIST } from '../../constants';
import {
  useDeleteRegistrationMutation,
  useGetServiceListQuery,
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
import { classByCondition } from '../../utils/className';
import { useEffect } from 'react';
import {
  setDraggableRegCard,
  setIsRegCardCopyVisible,
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
} from '@ant-design/icons';

interface RegCardProps {
  reg: DbRegistration;
  user: User | undefined;
  type?: 'major' | 'copy';
  className?: string;
}

export default function RegCard({
  reg,
  user,
  type = 'major',
  className,
}: RegCardProps) {
  const { data: serviceList } =
    useGetServiceListQuery();

  const {
    draggableRegCard,
    isRegCardCopyVisible,
  } = useAppSelector(
    (state) => state.regCardState
  );

  const [deleteReg, { isError }] =
    useDeleteRegistrationMutation();

  const dispatch = useAppDispatch();

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
    dispatch(setDraggableRegCard(null));
  }, [reg]);

  useEffect(() => {
    if (isError) showErrMessage();
  }, [isError]);

  return (
    <div
      className={`${classByCondition(
        'reg-card',
        'invisible',
        draggableRegCard === reg.id
      )} ${
        className ? className : ''
      } ${classByCondition(
        'reg-card',
        'transparent',
        isRegCardCopyVisible && type === 'major'
      )}`}
      style={{
        height: reg.duration * 58 - 4,
        top:
          44 + TIME_LIST.indexOf(reg.time) * 58,
      }}
      key={reg.id}
      draggable={true}
      onDragStart={() => {
        dispatch(setRegCardInfo(reg));
        dispatch(setRegCardUser(user));
      }}
      onDrag={() => {
        dispatch(setDraggableRegCard(reg.id));
      }}
      onDragEnd={(e) => {
        if (
          e.dataTransfer.dropEffect === 'none'
        ) {
          dispatch(setDraggableRegCard(null));
        }
      }}>
      {type === 'major' && (
        <Popconfirm
          title='Удалить запись?'
          // description='Are you sure to delete this task?'
          onConfirm={() => deleteReg(reg.id)}
          // onCancel={cancel}
          okText='да'
          okButtonProps={{
            danger: true,
          }}
          cancelText='нет'>
          <Button
            className='reg-card__trash-btn'
            type='primary'
            size='small'
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      )}

      {type === 'copy' && (
        <Button
          className='reg-card__close-btn'
          type='text'
          icon={<CloseOutlined />}
          onClick={() => {
            dispatch(setRegCardInfo(null));
            dispatch(setRegCardUser(null));
            dispatch(
              setIsRegCardCopyVisible(false)
            );
          }}
        />
      )}

      <div className='reg-card__box'>
        <p className='reg-card__name'>
          {user?.name}
        </p>

        <div className='reg-card__contacts'>
          <span>{user?.phone}</span>
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
        </div>
      </div>

      {reg.duration > 1 && (
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

          {reg.duration > 2 ? (
            <ul className='reg-card__box reg-card__service-list'>
              {reg.serviceIdList.map(
                (serviceId) => (
                  <li
                    className='reg-card__service'
                    key={serviceId}>
                    {
                      getDataById(
                        serviceList,
                        serviceId
                      )?.name
                    }
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className='reg-card__box reg-card__services-paragraph'>
              {reg.serviceIdList
                .map(
                  (serviceId) =>
                    getDataById(
                      serviceList,
                      serviceId
                    )?.name
                )
                .join(', ')}
            </p>
          )}
        </>
      )}
      {errorMessage}
    </div>
  );
}
