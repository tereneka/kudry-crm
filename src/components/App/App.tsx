import { useEffect } from 'react';
import Planner from '../../pages/Planner/Planner';
import { useGetMasterListQuery } from '../../reducers/apiSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setCurrentMaster } from '../../reducers/mastersSlice';

function App() {
  const { data: masters } =
    useGetMasterListQuery();

  const { currentMaster } = useAppSelector(
    (state) => state.mastersState
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (masters && !currentMaster) {
      dispatch(setCurrentMaster(masters[0]));
    }
  }, [masters]);

  return (
    <div className=''>
      <Planner />
    </div>
  );
}

export default App;
