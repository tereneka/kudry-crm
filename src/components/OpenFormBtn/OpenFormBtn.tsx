import React from 'react';
import './OpenFormBtn.css';
import { Badge, Button } from 'antd';

interface OpenFormBtnProps {
  title?: string;
  isFormActive?: boolean;
  onClick?: () => void;
  hasBadge?: boolean;
  count?: string | number;
}

export default function OpenFormBtn({
  title = '',
  isFormActive = false,
  onClick,
  hasBadge = false,
  count = 0,
}: OpenFormBtnProps) {
  return (
    <div className='open-form-btn'>
      {hasBadge ? (
        <Badge
          count={count}
          showZero={false}
          size='small'
          color='rgb(137, 175, 176)'
          offset={[-20, 0]}>
          <Button
            type='primary'
            danger={isFormActive}
            onClick={onClick}>
            {title}
          </Button>
        </Badge>
      ) : (
        <Button
          type='primary'
          danger={isFormActive}
          onClick={onClick}>
          {title}
        </Button>
      )}
    </div>
  );
}
