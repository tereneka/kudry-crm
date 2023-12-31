import './RegCard.css';
import {
  DbRegistration,
  Client,
} from '../../types';
import { TIME_LIST } from '../../constants';
import {
  useDeleteRegistrationMutation,
  useGetMasterListQuery,
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
import { Button } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  DragOutlined,
} from '@ant-design/icons';
import { setIsRegModalOpened } from '../../reducers/regSlice';
import { changeIncome } from '../../utils/reg';
import { setIsError } from '../../reducers/appSlice';
import { setIsTimeSelectAvailable } from '../../reducers/plannerSlice';
import AlternateColorCard from '../AlternateColorCard/AlternateColorCard';
import CardMenu from '../CardMenu/CardMenu';

interface RegCardProps {
  reg: DbRegistration;
  user: Client | undefined;
  type?: 'major' | 'copy';
  index?: number;
}

export default function RegCard({
  reg,
  user,
  type = 'major',
  index = 0,
}: RegCardProps) {
  const { data: serviceList } =
    useGetServiceListQuery();

  const { draggableRegCard, regCardInfo } =
    useAppSelector((state) => state.regCardState);
  const { isFormActive } = useAppSelector(
    (state) => state.plannerState
  );
  const { data: masterList } =
    useGetMasterListQuery();
  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
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
    width: `calc((100% - 48px - ${
      ((masterList?.length || 1) - 1) * 30
    }px))`,
    height: reg.duration * 2 * 58 - 4,
    top: TIME_LIST.indexOf(reg.time) * 58,
  };
  const regServiceNameList =
    reg.serviceIdList.map(
      (serviceId) =>
        getDataById(serviceList, serviceId)?.name
    );

  const btnGroup = [
    {
      label: (
        <Button
          className='reg-card__move-btn'
          size='large'
          type='text'
          disabled={isFormActive}
          icon={
            <DragOutlined
              rev={undefined}
              className='reg-card__icon'
            />
          }
          onClick={handleMoveBtnClick}
        />
      ),
      key: '3',
    },
    {
      label: (
        <Button
          size='large'
          type='text'
          icon={
            <EyeOutlined
              rev={undefined}
              className='reg-card__icon'
            />
          }
          onClick={handleViewBtnClick}
        />
      ),
      key: '4',
    },
    {
      label: (
        <Button
          size='large'
          type='text'
          icon={
            <DeleteOutlined
              rev={undefined}
              className='reg-card__icon'
            />
          }
          onClick={() => deleteReg(reg.id)}
        />
      ),
      key: '5',
    },
  ];

  function handleMoveBtnClick() {
    dispatch(setDraggableRegCard(reg.id));
    dispatch(setRegCardInfo(reg));
    dispatch(setRegCardUser(user));
    dispatch(setIsTimeSelectAvailable(true));
  }

  function handleCloseBtnClick() {
    dispatch(setRegCardInfo(null));
    dispatch(setRegCardUser(null));
    dispatch(setDraggableRegCard(null));
    dispatch(setIsTimeSelectAvailable(false));
  }

  function handleViewBtnClick() {
    dispatch(setRegCardInfo(reg));
    dispatch(setRegCardUser(user));
    dispatch(setIsRegModalOpened(true));
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
        currentMaster,
        reg.serviceIdList,
        serviceList,
        reg.date.toDate(),
        reg.serviceIndex,
        reg.priceCorrection,
        'minus',
        updateIncome
      );
    }
  }, [isSuccess]);

  return (
    <AlternateColorCard
      className={cardClassName}
      style={cardStyle}
      key={reg.id}>
      {type === 'major' && (
        <CardMenu
          color={
            index % 2 === 0 ? 'danger' : 'primary'
          }
          phone={user?.phone}
          otherBtnGroup={btnGroup}
        />
      )}
      {type === 'copy' && (
        <Button
          className='reg-card__close-btn'
          type='text'
          size='small'
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
        </div>
      </div>
      {(reg.duration * 2 > 1 ||
        type === 'copy') && (
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
              {`${reg.duration} ${plural(
                Math.floor(reg.duration),
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
          {reg.duration * 2 > 2 &&
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
    </AlternateColorCard>
  );
}
