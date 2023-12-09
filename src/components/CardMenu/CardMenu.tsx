import React from 'react';
import './CardMenu.css';
import {
  Dropdown,
  Button,
  MenuProps,
} from 'antd';
import phoneIcon from '../../images/phone.svg';
import whatsappIcon from '../../images/whatsapp.svg';
import { MenuOutlined } from '@ant-design/icons';

interface CardMenuProps {
  color?: 'danger' | 'primary';
  phone?: string;
  otherBtnGroup?: {
    label: JSX.Element;
    key: string;
  }[];
}

export default function CardMenu({
  color = 'primary',
  phone = '',
  otherBtnGroup = [],
}: CardMenuProps) {
  const socialBtnGroup = [
    {
      label: (
        <Button
          size='large'
          type='text'
          href={`tel:${phone}`}
          target='_blank'
          icon={
            <img
              className='card-menu__social-icon'
              src={phoneIcon}
              alt='phone'
            />
          }
        />
      ),
      key: '1',
    },
    {
      label: (
        <Button
          size='large'
          type='text'
          href={`https://wa.me/${phone.slice(1)}`}
          target='_blank'
          icon={
            <img
              className='card-menu__social-icon'
              src={whatsappIcon}
              alt='whatsapp'
            />
          }
        />
      ),
      key: '2',
    },
  ];

  const btnGroup: MenuProps['items'] = phone
    ? [...socialBtnGroup, ...otherBtnGroup]
    : otherBtnGroup;

  return (
    <Dropdown
      className='card-menu'
      menu={{ items: btnGroup }}
      trigger={['click']}
      placement='topRight'
      dropdownRender={(menu) => (
        <>
          {React.cloneElement(
            menu as React.ReactElement,
            {
              class: `card-menu__btn-group card-menu__btn-group_color_${color}`,
            }
          )}
        </>
      )}>
      <Button
        className={`card-menu__memu-btn card-menu__memu-btn_color_${color}`}
        size='small'
        type='primary'
        icon={<MenuOutlined rev={undefined} />}
      />
    </Dropdown>
  );
}
