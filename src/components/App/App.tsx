import './App.css';
import { useEffect } from 'react';
import { useGetMasterListQuery } from '../../reducers/apiSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setCurrentMaster } from '../../reducers/mastersSlice';
import { message } from 'antd';
import RouterApp from '../RouterApp/RouterApp';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../db/firebaseConfig';
import { setCurrentAccount } from '../../reducers/appSlice';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { disableIosTextFieldZoom } from '../../utils/format';
import React from 'react';
import { getEarlierDate } from '../../utils/date';

function App() {
  const navigate = useNavigate();
  const { pathname: location } = useLocation();

  const { data: masters } =
    useGetMasterListQuery();

  const { isError } = useAppSelector(
    (state) => state.appState
  );
  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );

  const dispatch = useAppDispatch();

  const [messageApi, errorMessage] =
    message.useMessage();

  function showErrMessage() {
    messageApi.open({
      type: 'error',
      content: 'Произошла ошибка :(',
      duration: 4,
    });
  }

  onAuthStateChanged(auth, (account) => {
    dispatch(setCurrentAccount(account));
    if (account && location !== '/') {
      navigate('/');
    } else if (
      !account &&
      location !== '/sign-in'
    ) {
      navigate('/sign-in');
    }
  });

  useEffect(() => {
    if (masters && !currentMaster) {
      dispatch(setCurrentMaster(masters[0]));
    }
  }, [masters]);

  useEffect(() => {
    if (isError) {
      showErrMessage();
    }
  }, [isError]);

  disableIosTextFieldZoom();

  return (
    <div
      className='content
    '>
      <RouterApp />
      {errorMessage}
    </div>
  );
}

export default App;
