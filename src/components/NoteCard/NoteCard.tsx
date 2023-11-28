import './NoteCard.css';
import { DbNote, RegUser } from '../../types';
import { phoneFormat } from '../../utils/format';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import { useEffect } from 'react';
import { Button, MenuProps } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditFilled,
  MenuOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd/lib';
import React from 'react';
import phoneIcon from '../../images/phone.svg';
import whatsappIcon from '../../images/whatsapp.svg';
import {
  setNoteCardInfo,
  setNoteCardUser,
} from '../../reducers/noteCardSlice';
import { useDeleteNoteMutation } from '../../reducers/apiSlice';
import { setIsError } from '../../reducers/appSlice';
import { setOpenedFormName } from '../../reducers/plannerSlice';

interface NoteCardProps {
  note: DbNote;
  user: RegUser | undefined;
  type?: 'major' | 'copy';
  index?: number;
}

export default function NoteCard({
  note,
  user,
  type = 'major',
  index,
}: NoteCardProps) {
  const [deleteNote, { isError }] =
    useDeleteNoteMutation();

  const dispatch = useAppDispatch();

  const socialBtnGroup = [
    {
      label: (
        <Button
          size='large'
          type='text'
          href={`tel:${user?.phone}`}
          icon={
            <img
              className='note-card__social-icon'
              src={phoneIcon}
              alt='phone'
            />
          }
        />
      ),
      key: '1',
    },
    {
      label: (
        <Button
          size='large'
          type='text'
          href={`https://wa.me/${user?.phone.slice(
            1
          )}`}
          icon={
            <img
              className='note-card__social-icon'
              src={whatsappIcon}
              alt='whatsapp'
            />
          }
        />
      ),
      key: '2',
    },
  ];
  const editBtnGroup = [
    {
      label: (
        <Button
          size='large'
          type='text'
          icon={
            <EditFilled
              rev={undefined}
              className='note-card__icon'
            />
          }
          onClick={handleEditBtnClick}
        />
      ),
      key: '4',
    },
    {
      label: (
        <Button
          size='large'
          type='text'
          icon={
            <DeleteOutlined
              rev={undefined}
              className='note-card__icon'
            />
          }
          onClick={() => deleteNote(note.id)}
        />
      ),
      key: '5',
    },
  ];
  const btnGroup: MenuProps['items'] = user
    ? [...socialBtnGroup, ...editBtnGroup]
    : editBtnGroup;

  function handleCloseBtnClick() {
    dispatch(setNoteCardInfo(null));
    dispatch(setNoteCardUser(null));
  }

  function handleEditBtnClick() {
    dispatch(setNoteCardInfo(note));
    dispatch(setNoteCardUser(user));
    dispatch(setOpenedFormName('editNote'));
  }

  useEffect(() => {
    dispatch(setIsError(isError));
  }, [isError]);

  return (
    <div className='note-card' key={note.id}>
      {type === 'major' && (
        <Dropdown
          menu={{ items: btnGroup }}
          trigger={['click']}
          placement='topRight'
          dropdownRender={(menu) => (
            <>
              {React.cloneElement(
                menu as React.ReactElement,
                {
                  class: `note-card__btn-group ${
                    index !== undefined &&
                    index % 2 === 0
                      ? 'note-card__btn-group_type_odd'
                      : 'note-card__btn-group_type_even'
                  }`,
                }
              )}
            </>
          )}>
          <Button
            className='note-card__memu-btn'
            size='small'
            type='primary'
            icon={
              <MenuOutlined rev={undefined} />
            }
          />
        </Dropdown>
      )}
      {type === 'copy' && (
        <Button
          className='note-card__close-btn'
          type='text'
          size='small'
          icon={<CloseOutlined rev={undefined} />}
          onClick={handleCloseBtnClick}
        />
      )}

      <p className='note-card__time'>
        {note.time}
      </p>

      <div className='note-card__box'>
        <p className='note-card__text'>
          {note.text}
        </p>
      </div>

      {user && (
        <div className='note-card__box'>
          <p className='note-card__name'>
            {user?.name}
          </p>

          <div className='note-card__contacts'>
            <span>
              {phoneFormat(user?.phone || '')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
