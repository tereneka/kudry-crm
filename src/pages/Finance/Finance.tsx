import { useEffect, useState } from 'react';
import './Finance.css';
import {
  useGetCategoryListQuery,
  useGetIncomeListQuery,
  useGetMasterListQuery,
  useGetServiceListQuery,
} from '../../reducers/apiSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DATE_FORMAT } from '../../constants';
import { Button, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { convertDateStrToDate } from '../../utils/date';
import {
  colorList,
  getDateRangeList,
} from '../../utils/finance';
import { useAppDispatch } from '../../store';
import { setIsExpensesFormOpened } from '../../reducers/financeSlice';
import ExpensesForm from '../../components/ExpensesForm/ExpensesForm';
import { useLocation } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const { RangePicker } = DatePicker;

export default function Finance() {
  const today = new Date();
  const defaultStartDay = `01.${today.getMonth()}.${today.getFullYear()}`;
  const defaultEndDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    0
  ).toLocaleDateString();

  const [dateRange, setDateRange] = useState({
    startDate: convertDateStrToDate(
      defaultStartDay
    ),
    endDate: convertDateStrToDate(defaultEndDay),
  });
  const [sort, setSort] = useState(1);
  const [barAspectRatio, setBarAspectRatio] =
    useState(
      window.innerHeight > window.innerWidth
        ? 0.8
        : 2
    );

  const { data: incomeList } =
    useGetIncomeListQuery(dateRange);
  const { data: categoryList } =
    useGetCategoryListQuery();
  const { data: masterList } =
    useGetMasterListQuery();

  const dispatch = useAppDispatch();

  const dateRangeList =
    getDateRangeList(dateRange);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'ДОХОД, ₽',
      },
      tooltip: { intersect: true },
    },
    layout: {
      padding: 20,
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    aspectRatio: barAspectRatio,
  };

  const sortList =
    sort === 1
      ? categoryList || []
      : masterList || [];

  const barData = {
    labels: dateRangeList.map((date) =>
      date.toLocaleDateString().slice(3)
    ),
    datasets: sortList.map((item, index) => {
      return {
        label: item.name,
        data: dateRangeList.map((date) => {
          return incomeList
            ?.filter((income) => {
              const incomeDate =
                income.date.toDate();
              return (
                incomeDate.getMonth() ===
                  date.getMonth() &&
                incomeDate.getFullYear() ===
                  date.getFullYear() &&
                (sort === 1
                  ? income.categoryId === item.id
                  : income.masterId === item.id)
              );
            })
            .reduce(
              (sum, current) => sum + current.sum,
              0
            );
        }),
        backgroundColor: colorList[index],
        hoverBackgroundColor: colorList[index],
      };
    }),
  };

  window.addEventListener('resize', () => {
    window.innerHeight > window.innerWidth
      ? setBarAspectRatio(0.8)
      : setBarAspectRatio(2);
  });

  // useEffect(() => {
  //   window.innerHeight > window.innerWidth
  //     ? setBarAspectRatio(0.8)
  //     : setBarAspectRatio(2);
  // }, []);

  function handleDateRangeChange(
    values:
      | [dayjs.Dayjs | null, dayjs.Dayjs | null]
      | null
  ) {
    if (values && values[0] && values[1]) {
      setDateRange({
        startDate: values[0].toDate(),
        endDate: values[1].toDate(),
      });
    }
  }

  return (
    <div className='finance'>
      <Button
        type='primary'
        onClick={() =>
          dispatch(setIsExpensesFormOpened(true))
        }>
        добавить расходы
      </Button>
      <RangePicker
        popupClassName='finance__calendar'
        showTime
        format={DATE_FORMAT}
        defaultValue={[
          dayjs(defaultStartDay, DATE_FORMAT),
          dayjs(defaultEndDay, DATE_FORMAT),
        ]}
        onChange={handleDateRangeChange}
      />

      <Select
        options={[
          { value: 1, label: 'по категориям' },
          { value: 2, label: 'по мастерам' },
        ]}
        defaultValue={1}
        onChange={(value) => setSort(value)}
      />
      <Bar options={options} data={barData} />

      <ExpensesForm />
    </div>
  );
}
