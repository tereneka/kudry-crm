import React from 'react';
import './Spinner.css';
import { Spin } from 'antd';

export default function Spinner() {
  return (
    <div className='spin'>
      <Spin size='large' />
    </div>
  );
}
