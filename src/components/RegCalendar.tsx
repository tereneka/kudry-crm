import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { disabledTime } from '../data';

export default function RegCalendar() {
    return (
        <>
            <DatePicker
                format={'DD.MM.YYYY'}
                defaultValue={dayjs(new Date().toLocaleDateString(), 'DD.MM.YYYY')}
                dateRender={(current) => {
                    let className: string;
                    (current || current > dayjs().endOf('day')) && disabledTime.some(i => i.date === current.format('DD.MM.YYYY')) ?
                        className = 'ant-picker-cell-inner calendar-cell_status_registered'
                        :
                        className = 'ant-picker-cell-inner'
                    return (
                        <div className={className}>
                            {current.date()}
                        </div>
                    );
                }}
            />
        </>
    )
}
