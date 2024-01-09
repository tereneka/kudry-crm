import React from 'react';
import './Header.css';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../db/firebaseConfig';
import { LogoutOutlined } from '@ant-design/icons';
import Navigation from '../Navigation/Navigation';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setIsOwnerAccount } from '../../reducers/appSlice';

export default function Header() {
  const { isOwnerAccount } = useAppSelector(
    (state) => state.appState
  );

  const dispatch = useAppDispatch();

  return (
    <header className='header'>
      {isOwnerAccount ? <Navigation /> : <div />}
      <Button
        type='primary'
        style={{ alignSelf: 'flex-end' }}>
        <Link
          to={'/sign-in'}
          onClick={() => {
            signOut(auth);
            localStorage.removeItem('location');
            // dispatch(
            //   setIsOwnerAccount(undefined)
            // );
          }}>
          <LogoutOutlined rev={undefined} />
        </Link>
      </Button>
    </header>
  );
}
