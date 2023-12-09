import React from 'react';
import './Clients.css';
import { useGetUserListQuery } from '../../reducers/apiSlice';
import AlternateColorCard from '../../components/AlternateColorCard/AlternateColorCard';

export default function Clients() {
  const { data: clientList } =
    useGetUserListQuery();

  return (
    <div>
      {clientList?.map((client) => (
        <AlternateColorCard>
          {client.name}{' '}
        </AlternateColorCard>
      ))}
    </div>
  );
}
