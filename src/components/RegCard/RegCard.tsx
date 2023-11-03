import React from 'react';
import './RegCard.css';
import person from '../../images/person.svg';
import phone from '../../images/phone.svg';
import whatsapp from '../../images/whatsapp.svg';
import {
  DbRegistration,
  User,
} from '../../types';
import { TIME_LIST } from '../../constants';
import { useGetServiceListQuery } from '../../reducers/apiSlice';
import { getDataById } from '../../utils/data';
import { Badge } from 'antd';
import plural from '../../utils/plural';

interface RegCardProps {
  reg: DbRegistration;
  user: User | undefined;
}

export default function RegCard({
  reg,
  user,
}: RegCardProps) {
  const { data: serviceList } =
    useGetServiceListQuery();

  return (
    <div
      className='reg-card'
      style={{
        height: reg.duration * 40 - 4,
        //   +(reg.duration - 1) * 4,
        top:
          44 + TIME_LIST.indexOf(reg.time) * 40,
      }}
      key={reg.id}
      draggable={true}
      //   onDragStart={(e) => {
      //     e.dataTransfer.setData(
      //       'index',
      //       index.toString()
      //     );
      //       }}
    >
      <ul className='reg-card__list'>
        <li className='reg-card__item'>
          {user?.name}
        </li>
        <li className='reg-card__contacts'>
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
                )}`}>
                <img
                  className='reg-card__link-icon'
                  src={whatsapp}
                  alt='whatsapp'
                />
              </a>
            </li>
          </ul>
        </li>

        <li className='reg-card__item'>
          <span>
            {`${
              reg.serviceIdList.length
            } ${plural(reg.serviceIdList.length, {
              one: 'услуга',
              few: 'услуги',
              many: 'услуг',
            })}`}
          </span>

          <span>
            {`${reg.duration / 2} ${plural(
              Math.floor(reg.duration / 2),
              {
                one: 'час',
                few: 'часа',
                many: 'часов',
              }
            )}`}
          </span>
          {/* <span>
            {reg.serviceIdList.reduce(
              (res, currentId) =>
                res +
                getDataById(
                  serviceList,
                  currentId
                )?.price,
              0
            )}
          </span> */}
        </li>

        <li className='reg-card__item'>
          <ul className='reg-card__service-list'>
            {reg.serviceIdList.map(
              (serviceId) => (
                <li>
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
        </li>
      </ul>
      {/* <div className='reg-card__item'>
        <img src={person} alt='' />
        <p className='reg-card__paragraph'>
          {user?.name}
        </p>
      </div>

      {reg.duration > 1 && (
        <>
          <div className='reg-card__item'>
            <Badge
              count={reg.serviceIdList.length}
              size='small'
            />
            <p className='reg-card__paragraph'>
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
          </div>
          <a
            className='reg-card__item'
            href={`tel:${user?.phone}`}>
            <img src={phone} alt='' />
            {user?.phone}
          </a>
        </>
      )} */}
    </div>
  );
}
