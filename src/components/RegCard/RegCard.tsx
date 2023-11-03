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
import {
  numberFormat,
  plural,
} from '../../utils/format';
import { classByCondition } from '../../utils/className';

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
        height: reg.duration * 58 - 4,
        //   +(reg.duration - 1) * 4,
        top:
          44 + TIME_LIST.indexOf(reg.time) * 58,
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
                  <li className='reg-card__service'>
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
    </div>
  );
}
