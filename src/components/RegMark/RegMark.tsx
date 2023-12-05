import React from 'react';
import './RegMark.css';
import {
  DbRegistration,
  Master,
} from '../../types';
import { TIME_LIST } from '../../constants';
import { Avatar } from 'antd';

interface RegMarkProps {
  reg: DbRegistration;
  master: Master;
  position: number;
}

export default function RegMark({
  reg,
  master,
  position,
}: RegMarkProps) {
  const markStyle = {
    top: TIME_LIST.indexOf(reg.time) * 58,
    right: position * 30,
  };

  const masterColor: { [key: string]: string } = {
    Ульяна: 'rgb(20, 100, 120)',
    Светлана: 'rgb(220, 100, 70)',
    Катя: 'rgb(170, 160, 30)',
    Маша: 'rgb(170, 55, 95)',
  };

  return (
    <div className='reg-mark' style={markStyle}>
      <div className='reg-mark__content'>
        <Avatar
          className='reg-mark__avatar'
          style={{
            background: masterColor[master.name],
          }}
          shape='square'
          src={master.photoUrl}
          alt='фото мастера'
        />
        <span
          className='reg-mark__name'
          style={{
            background: masterColor[master.name],
          }}>
          {master.name}{' '}
        </span>
      </div>
      <div
        className='reg-mark__stripe'
        style={{
          height: reg.duration * 2 * 58 - 5,
          background: masterColor[master.name],
        }}
      />
    </div>
  );
}
