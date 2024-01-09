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
import {
  onAuthStateChanged,
  updateCurrentUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../db/firebaseConfig';
import {
  setCurrentAccount,
  setIsOwnerAccount,
} from '../../reducers/appSlice';
import { disableIosTextFieldZoom } from '../../utils/format';
import Header from '../Header/Header';
import { useLocation } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

function App() {
  const { pathname: location } = useLocation();

  const { data: masters } =
    useGetMasterListQuery();
  const { currentAccount, isOwnerAccount } =
    useAppSelector((state) => state.appState);
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
    if (account) {
      dispatch(
        setIsOwnerAccount(
          account.displayName === 'owner'
        )
      );
    } else {
      dispatch(setIsOwnerAccount(undefined));
      dispatch(setCurrentMaster(undefined));
    }
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
    if (
      masters &&
      !currentMaster &&
      isOwnerAccount !== undefined
    ) {
      !isOwnerAccount
        ? dispatch(
            setCurrentMaster(
              masters.find(
                (master) =>
                  master.id ===
                  currentAccount?.displayName
              )
            )
          )
        : dispatch(setCurrentMaster(masters[0]));
    }
  }, [masters, currentAccount, isOwnerAccount]);

  useEffect(() => {
    if (isError) {
      showErrMessage();
    }
  }, [isError]);

  // disableIosTextFieldZoom();
  // if (auth.currentUser) {
  //   updateProfile(auth.currentUser, {
  //     displayName: 'k0z5Dg46yQm3lwi5HsUW',
  //   });
  // }

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
