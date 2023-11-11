import React from 'react';
import './UserSocial.css';
import phoneIcon from '../../images/phone.svg';
import whatsapp from '../../images/whatsapp.svg';
import { classByCondition } from '../../utils/className';

interface UserSocialProps {
  phone: string;
  className?: string;
}

export default function UserSocial({
  phone,
  className,
}: UserSocialProps) {
  return (
    <ul
      className={`user-social ${
        className || ''
      }`}>
      <li>
        <a
          className='user-social__link'
          href={`tel:${phone}`}>
          <img
            className='user-social__link-icon'
            src={phoneIcon}
            alt=''
          />
        </a>
      </li>
      <li>
        <a
          className='user-social__link'
          target='_blank'
          href={`https://wa.me/${phone.slice(1)}`}
          rel='noreferrer'>
          <img
            className='user-social__link-icon'
            src={whatsapp}
            alt='whatsapp'
          />
        </a>
      </li>
    </ul>
  );
}
