import { useEffect } from 'react';
import Planner from '../../pages/Planner/Planner';
import {
  useGetMasterListQuery,
  useUpdateRegistrationMutation,
} from '../../reducers/apiSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setCurrentMaster } from '../../reducers/mastersSlice';
import { message } from 'antd';

function App() {
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

  return (
    <div className=''>
      <Planner />
      {errorMessage}
    </div>
  );
}

export default App;
