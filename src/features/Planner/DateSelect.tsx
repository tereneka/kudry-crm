import { Form, DatePicker } from 'antd';
import React from 'react';
import {
  DATE_FORMAT,
  TIME_LIST,
} from '../../constants';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useAppSelector } from '../../store';
import { RangePickerProps } from 'antd/es/date-picker';

export default function DateSelect() {
  const { date, currentMasterRegList } =
    useAppSelector((state) => state.plannerState);

  // определяем недоступные даты для записи
  const masterDateList: {
    [key: string]: string[];
  } = {};
  // в переменную masterDisabledDate записываем даты с полной записью у выбранного мастера
  const masterDisabledDate: string[] = [];

  currentMasterRegList?.forEach((reg) => {
    const dateStr = reg.date
      .toDate()
      .toLocaleDateString();
    if (masterDateList[dateStr]) {
      masterDateList[dateStr].concat(reg.time);
    } else {
      masterDateList[dateStr] = reg.time;
    }
  });

  for (let key in masterDateList) {
    if (masterDateList[key].length >= 20)
      masterDisabledDate.push(key);
  }

  //   dayjs.extend(customParseFormat);
  const disabledDate: RangePickerProps['disabledDate'] =
    (current: Dayjs) => {
      return (
        (current &&
          current < dayjs().endOf('day')) ||
        masterDisabledDate.some(
          (date) =>
            date === current.format(DATE_FORMAT)
        ) ||
        !getDisabledTime(current).some((i) => i)
      );
    };

  function getDisabledTime(date: dayjs.Dayjs) {
    // определяем недоступное время для записи
    const disabledTime = TIME_LIST.map((time) => {
      return masterDateList[
        date?.format(DATE_FORMAT)
      ]?.includes(time)
        ? false
        : true;
    });

    // disabledTime.forEach((time, index) => {
    //   if (!time) {
    //     // блокируем время, чтобы записи не наложились друг на друга
    //     for (
    //       let i = 1;
    //       i < formValues.duration;
    //       i++
    //     ) {
    //       disabledTime[index - i] = false;
    //     }
    //   } else if (
    //     index === disabledTime.length - 1 &&
    //     formValues.duration > 2
    //   ) {
    //     // блокируем время, чтобы окончание записи не было позднее 21:00
    //     for (
    //       let i = 0;
    //       i < formValues.duration - 2;
    //       i++
    //     ) {
    //       disabledTime[index - i] = false;
    //     }
    //   }
    // });

    return disabledTime;
  }

  return (
    <>
      <Form.Item>
        <DatePicker
          defaultValue={dayjs(date, DATE_FORMAT)}
          format={DATE_FORMAT}
        />
      </Form.Item>
    </>
  );
}
