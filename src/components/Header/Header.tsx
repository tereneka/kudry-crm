import React from 'react';
import './Header.css';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../db/firebaseConfig';
import { LogoutOutlined } from '@ant-design/icons';
import Navigation from '../Navigation/Navigation';

export default function Header() {
  return (
    <header className='header'>
      <Navigation />
      <Button type='primary'>
        <Link
          to={'/sign-in'}
          onClick={() => {
            signOut(auth);
            localStorage.removeItem('location');
          }}>
          <LogoutOutlined rev={undefined} />
        </Link>
      </Button>
    </header>
  );
}
