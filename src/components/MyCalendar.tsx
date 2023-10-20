import React from 'react';
import type { Dayjs } from 'dayjs';
import { Calendar, theme } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';

interface Props {
    setDate: React.Dispatch<React.SetStateAction<string>>
}
export default function MyCalendar({ setDate }: Props) {

    const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
        // console.log(value.format('DD.MM.YYYY'), mode);
        // console.log(new Date().toLocaleDateString());

    };
    function onSelect(value: Dayjs) {
        setDate(value.format('DD.MM.YYYY'))
    }

    // const onSelect = (value: Dayjs) => console.log(value.format('YYYY-MM-DD'));

    return (
        <Calendar fullscreen={false} onSelect={onSelect} onPanelChange={onPanelChange} />
    )
}