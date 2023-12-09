import React from 'react';
import './Clients.css';
import { useGetUserListQuery } from '../../reducers/apiSlice';

export default function Clients() {
  const { data: clientList } =
    useGetUserListQuery();

  return <div>Сlients</div>;
}
