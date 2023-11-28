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

function App() {
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

  onAuthStateChanged(auth, (account) => {
    dispatch(setCurrentAccount(account));
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
    <div className='content'>
      {!!currentAccount && <Header />}
      <main>
        <RouterApp />
      </main>

      {errorMessage}
    </div>
  );
}

export default App;
