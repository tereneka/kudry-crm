import React, { useState } from 'react';
import {
  masters,
  registrations,
  Service,
  services,
} from '../data';
import phone from '../images/phone.svg';
import person from '../images/person.svg';
import list from '../images/list.svg';
import RegForm from './RegForm';
import { nanoid } from 'nanoid';

interface Props {
  date: string;
}

export default function TimeTable({
  date,
}: Props) {
  const [regData, setRegData] = useState(
    registrations
  );
  const [cellData, setCellData] = useState<{
    master: number;
    date: string;
    time: number;
  }>();
  const [isRegModalOpen, setIsRegModalOpen] =
    useState(false);

  function handleCellClick(
    e: React.MouseEvent<
      HTMLTableDataCellElement,
      MouseEvent
    >
  ) {
    if (
      e.currentTarget.dataset.master &&
      e.currentTarget.dataset.time
    ) {
      setCellData({
        master: +e.currentTarget.dataset.master,
        date: date,
        time: +e.currentTarget.dataset.time,
      });
    }
    setIsRegModalOpen(true);
  }
  const mastersList = masters.map((master) => {
    return (
      <th
        className='time-table__time-header time-table__time-header_position_horizontal'
        key={master.id}>
        {master.name}
      </th>
    );
  });

  const timeArr: number[] = [];

  for (let i: number = 11; i <= 20; i++) {
    timeArr.push(i);
  }

  const timesList = timeArr.map((time) => {
    return (
      <tr
        key={nanoid()}
        className='time-table__row'>
        <th className='time-table__time-header time-table__time-header_position_vertical'>
          {time}:00
        </th>
        {masters.map((master) => {
          return (
            <td
              className='time-table__cell'
              data-master={master.id}
              data-time={time.toString()}
              key={nanoid()}
              style={{
                width: `calc(95% / ${masters.length})`,
              }}
              onClick={handleCellClick}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                console.log(
                  e.dataTransfer.getData('index')
                );
                const newArr = [...regData];
                const newTime =
                  e.currentTarget.dataset.time;

                if (newTime) {
                  newArr[
                    +e.dataTransfer.getData(
                      'index'
                    )
                  ].time = +newTime;
                }

                setRegData(newArr);
                e.currentTarget.style.background =
                  'red';
              }}></td>
          );
        })}
      </tr>
    );
  });

  const regList = regData
    .filter((reg) => reg.date === date)
    .map((reg, index) => {
      let regServices: Service[] = [];
      let servisesStr: string = '';

      let heightMultiplier = 0;
      reg.serviceId.forEach((id) => {
        const regService = services.find(
          (service) => service.id === id
        );
        if (regService) {
          heightMultiplier += regService.duration;
          regServices.push(regService);
        }
      });

      if (regServices) {
        servisesStr = regServices
          .map((service) => service.name)
          .join(', ');
      }

      let leftMultiplier = 0;
      const regMaster = masters.find(
        (master) => master.id === reg.masterId
      );
      if (regMaster) {
        leftMultiplier =
          masters.indexOf(regMaster);
      }

      return (
        <div
          className='reg-card'
          style={{
            width: `calc(95% / ${masters.length} - 4px)`,
            height: 60 * heightMultiplier,
            top: 28 + (reg.time - 11) * 60,
            left: `calc(5% + 2px + 95% / ${masters.length} * ${leftMultiplier})`,
          }}
          key={nanoid()}
          draggable={true}
          onDragStart={(e) => {
            // e.preventDefault();
            e.dataTransfer.setData(
              'index',
              index.toString()
            );
          }}>
          <p className='reg-card__paragraph'>
            <img src={person} alt='' />
            {reg.name}
          </p>
          <a
            className='reg-card__link'
            href={`tel:${reg.phone}`}>
            <img src={phone} alt='' />
            {reg.phone}
          </a>
          <p className='reg-card__paragraph'>
            <img src={list} alt='' />
            {servisesStr}
          </p>
        </div>
      );
    });

  return (
    <div className='relative-container'>
      <table className='time-table'>
        <thead>
          <tr>
            <th className='time-table__time-header time-table__time-header_position_horizontal'></th>
            {mastersList}
          </tr>
        </thead>
        <tbody className='time-table__body'>
          {timesList}
        </tbody>
      </table>
      {regList}
      {cellData && (
        <RegForm
          data={cellData}
          regData={regData}
          isModalOpen={isRegModalOpen}
          setData={setCellData}
          setIsModalOpen={setIsRegModalOpen}
          setRegData={setRegData}
        />
      )}
    </div>
  );
}
