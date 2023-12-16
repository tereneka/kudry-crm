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
import { disableIosTextFieldZoom } from '../../utils/format';
import Header from '../Header/Header';
import { useLocation } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

function App() {
  const { pathname: location } = useLocation();

  const { data: masters } =
    useGetMasterListQuery();
  const { currentAccount } = useAppSelector(
    (state) => state.appState
  );
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
  console.log(currentAccount);

  onAuthStateChanged(auth, (account) => {
    dispatch(setCurrentAccount(account));
  });

  useEffect(() => {
    if (
      location !== '/' &&
      !!currentAccount &&
      location !== '/sign-in'
    ) {
      localStorage.setItem('location', location);
    }
  }, [location]);

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
    <div className='content'>
      {!!currentAccount && <Header />}
      <main>
        {currentAccount === undefined ? (
          <Spinner />
        ) : (
          <RouterApp />
        )}
      </main>

      {errorMessage}
    </div>
  );
}

export default App;
