import React from 'react';
import './UserSocial.css';
import phoneIcon from '../../images/phone-green.svg';
import whatsappIcon from '../../images/whatsapp-green.svg';
import { Button } from 'antd';

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
        <Button
          size='large'
          type='text'
          href={`tel:${phone}`}
          icon={
            <img
              className='user-social__icon'
              src={phoneIcon}
              alt=''
            />
          }
        />
      </li>
      <li>
        <Button
          size='large'
          type='text'
          href={`https://wa.me/${phone.slice(1)}`}
          icon={
            <img
              className='user-social__icon'
              src={whatsappIcon}
              alt='whatsapp'
            />
          }
        />
      </li>
    </ul>
  );
}
