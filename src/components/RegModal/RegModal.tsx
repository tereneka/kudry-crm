import { Modal } from 'antd';
import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { setIsRegModalOpen } from '../../reducers/regSlice';

export default function RegModal() {
  const { isRegModalOpen } = useAppSelector(
    (state) => state.regState
  );

  const dispatch = useAppDispatch();

  return (
    <Modal
      open={isRegModalOpen}
      onCancel={() =>
        dispatch(setIsRegModalOpen(false))
      }>
      bbb
    </Modal>
  );
}
