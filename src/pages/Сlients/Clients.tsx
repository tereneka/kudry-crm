import { useEffect, useState } from 'react';
import './Clients.css';
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUserListQuery,
  useUpdateUserMutation,
} from '../../reducers/apiSlice';
import AlternateColorCard from '../../components/AlternateColorCard/AlternateColorCard';
import {
  Button,
  Drawer,
  Empty,
  FormInstance,
  Input,
} from 'antd';
import CardMenu from '../../components/CardMenu/CardMenu';
import { DeleteOutlined } from '@ant-design/icons';
import ClientForm, {
  FormValues,
} from '../../components/ClientForm/ClientForm';
import { setIsError } from '../../reducers/appSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import OpenFormBtn from '../../components/OpenFormBtn/OpenFormBtn';
import {
  setIsClientFormActive,
  setIsClientFormOpened,
} from '../../reducers/clientsSlice';
import Spinner from '../../components/Spinner/Spinner';

export default function Clients() {
  const { data: clientList, isLoading } =
    useGetUserListQuery();

  const {
    isClientFormOpened,
    isClientFormActive,
  } = useAppSelector(
    (state) => state.clientsState
  );

  const [currentClientId, setCurrentClientId] =
    useState('');
  const [
    filtredClientList,
    setFiltredClientList,
  ] = useState(clientList);

  const [
    updateClient,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
    },
  ] = useUpdateUserMutation();
  const [
    addClient,
    {
      isLoading: isAddLoading,
      isError: isAddError,
    },
  ] = useAddUserMutation();

  const [deleteClient] = useDeleteUserMutation();

  const dispatch = useAppDispatch();

  function handleSearch(value: string) {
    const searchedText = value
      .toLocaleLowerCase()
      .trim();
    const result = clientList?.filter(
      (client) =>
        client.name
          .toLocaleLowerCase()
          .includes(searchedText) ||
        client.phone.includes(searchedText)
    );
    setFiltredClientList(result);
  }

  function handleUpdateFormSubmit(
    values: {
      name: string;
      phone: string;
    },
    id: string
  ) {
    setCurrentClientId(id);
    if (!isUpdateLoading) {
      updateClient({
        body: {
          ...values,
          phone: '+7' + values.phone,
        },
        id,
      });
    }
  }

  function openAddForm() {
    dispatch(setIsClientFormOpened(true));
    dispatch(setIsClientFormActive(true));
  }

  function closeAddForm() {
    dispatch(setIsClientFormOpened(false));
  }

  function handleAddFormSubmit(
    values: FormValues,
    form: FormInstance<FormValues>
  ) {
    if (!isAddLoading) {
      addClient({
        ...values,
        phone: '+7' + values.phone,
      }).then(
        (res: { data?: string; error?: any }) => {
          if (res.data) {
            form.resetFields();
            dispatch(
              setIsClientFormOpened(false)
            );
            dispatch(
              setIsClientFormActive(false)
            );
          }
        }
      );
    }
  }

  useEffect(() => {
    setFiltredClientList(clientList);
  }, [clientList]);

  // обработка результата отправки формы регистрации
  useEffect(() => {
    dispatch(setIsError(isUpdateError));
    if (!isUpdateLoading) {
      setCurrentClientId('');
    }
  }, [isUpdateError, isUpdateLoading]);
  useEffect(() => {
    dispatch(setIsError(isAddError));
  }, [isAddError]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='clients'>
          {clientList &&
          clientList?.length > 0 ? (
            <>
              <Input.Search
                className='clients__search'
                size='large'
                onSearch={handleSearch}
                enterButton
                allowClear
              />
              {filtredClientList?.map(
                (client, index) => (
                  <AlternateColorCard
                    className='clients__card'
                    key={client.id}>
                    <CardMenu
                      color={
                        index % 2 === 0
                          ? 'danger'
                          : 'primary'
                      }
                      phone={client.phone}
                      otherBtnGroup={[
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
                              onClick={() =>
                                deleteClient(
                                  client.id
                                )
                              }
                            />
                          ),
                          key: '5',
                        },
                      ]}
                    />
                    <ClientForm
                      name='edit'
                      client={client}
                      className='clients__form'
                      isBtnGroupCollapsed={true}
                      onFinish={
                        handleUpdateFormSubmit
                      }
                      isLoading={
                        isUpdateLoading &&
                        currentClientId ===
                          client.id
                      }
                    />
                  </AlternateColorCard>
                )
              )}
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='нет клиентов'
            />
          )}

          {clientList &&
            clientList?.length > 0 &&
            filtredClientList &&
            filtredClientList?.length < 1 && (
              <Empty
                image={
                  Empty.PRESENTED_IMAGE_SIMPLE
                }
                description='клиент не найден'
              />
            )}

          <OpenFormBtn
            title='новый клиент'
            isFormActive={isClientFormActive}
            onClick={openAddForm}
          />

          <Drawer
            title={'НОВЫЙ КЛИЕНТ'}
            open={isClientFormOpened}
            onClose={closeAddForm}>
            <ClientForm
              isLabels={true}
              onFinish={handleAddFormSubmit}
              isLoading={isAddLoading}
              closeForm={closeAddForm}
              isFormOpened={isClientFormOpened}
            />
          </Drawer>
        </div>
      )}
    </>
  );
}
