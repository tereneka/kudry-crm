import { useEffect, useState } from 'react';
import './Finance.css';
import {
  useGetCategoryListQuery,
  useGetExpenseListQuery,
  useGetExpensesCategoryListQuery,
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
  expenseColorList,
  getDateRangeList,
  incomeColorList,
} from '../../utils/finance';
import {
  useAppDispatch,
  useAppSelector,
} from '../../store';
import {
  setIsExpensesFormActive,
  setIsExpensesFormOpened,
} from '../../reducers/financeSlice';
import ExpensesForm from '../../components/ExpensesForm/ExpensesForm';
import { useLocation } from 'react-router-dom';
import { retry } from '@reduxjs/toolkit/query';
import { numberFormat } from '../../utils/format';

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
  const [incomeSort, setIncomeSort] = useState(1);
  const [expenseSort, setExpenseSort] =
    useState(1);
  const [barAspectRatio, setBarAspectRatio] =
    useState(
      window.innerHeight > window.innerWidth
        ? 0.8
        : 2
    );

  const { data: incomeList } =
    useGetIncomeListQuery(dateRange);
  const { data: expenseList } =
    useGetExpenseListQuery(dateRange);
  const { data: categoryList } =
    useGetCategoryListQuery();
  const { data: masterList } =
    useGetMasterListQuery();
  const { data: expCategoryList } =
    useGetExpensesCategoryListQuery();

  const { isExpensesFormActive } = useAppSelector(
    (state) => state.financeState
  );

  const dispatch = useAppDispatch();

  const dateRangeList =
    getDateRangeList(dateRange);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      // title: {
      //   display: true,
      //   text: 'ДОХОД, ₽',
      // },
      tooltip: {
        intersect: true,
        callbacks: {
          label: function (context: any) {
            let label =
              context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label +=
                numberFormat(context.parsed.y) +
                ' ₽';
            }
            return label;
          },
          //           footer: function (context: any[]) {
          //             let income = 0;
          //             let expense = 0;
          //             let profit = 0;
          //             context.forEach((item) => {
          //               if (
          //                 categoryList?.find(
          //                   (category) =>
          //                     category.name ===
          //                     item.dataset.label
          //                 )
          //               ) {
          //                 income += item.raw;
          //               } else if (
          //                 expCategoryList?.find(
          //                   (category) =>
          //                     category.name ===
          //                     item.dataset.label
          //                 )
          //               ) {
          //                 expense += item.raw;
          //               } else {
          //                 profit += item.raw;
          //               }
          //             });

          //             return `ИТОГО
          // доход: ${numberFormat(income)} ₽
          // расход: ${numberFormat(expense * -1)} ₽
          // прибыль: ${numberFormat(profit)} ₽`;
          //           },
        },
      },
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

  const incomeSortList =
    incomeSort === 1
      ? [{ name: 'доход', id: 1 }]
      : incomeSort === 2
      ? categoryList || []
      : masterList || [];
  const incomeBarDatasets = incomeSortList.map(
    (item, index) => {
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
                (incomeSort === 2
                  ? income.categoryId === item.id
                  : incomeSort === 3
                  ? income.masterId === item.id
                  : income)
              );
            })
            .reduce(
              (sum, current) => sum + current.sum,
              0
            );
        }),
        backgroundColor: incomeColorList[index],
        hoverBackgroundColor:
          incomeColorList[index],
        stack: '0',
        grouped: true,
      };
    }
  );

  const expenseSortList =
    expenseSort === 1
      ? [{ name: 'расход', id: 1 }]
      : expCategoryList || [];
  const expenseBarDatasets = expenseSortList.map(
    (category, index) => {
      return {
        label: category.name,
        data: dateRangeList.map((date) => {
          return expenseList
            ?.filter((expense) => {
              const expenseDate =
                expense.date.toDate();
              return (
                expenseDate.getMonth() ===
                  date.getMonth() &&
                expenseDate.getFullYear() ===
                  date.getFullYear() &&
                (expenseSort === 2
                  ? expense.categoryId ===
                    category.id
                  : expense)
              );
            })
            .reduce(
              (sum, current) =>
                -(sum + current.sum),
              0
            );
        }),
        backgroundColor: expenseColorList[index],
        hoverBackgroundColor:
          expenseColorList[index],
        stack: '0',
      };
    }
  );

  const barData = {
    labels: dateRangeList.map(
      (date) =>
        date.toLocaleDateString().slice(3, 6) +
        date.toLocaleDateString().slice(8)
    ),
    datasets: [
      ...incomeBarDatasets,
      ...expenseBarDatasets,

      {
        label: 'прибыль',
        data: dateRangeList.map((date) => {
          const expenseSum = expenseList
            ?.filter((expense) => {
              const expenseDate =
                expense.date.toDate();
              return (
                expenseDate.getMonth() ===
                  date.getMonth() &&
                expenseDate.getFullYear() ===
                  date.getFullYear()
              );
            })
            .reduce(
              (sum, current) => sum - current.sum,
              0
            );
          const incomeSum = incomeList
            ?.filter((income) => {
              const incomeDate =
                income.date.toDate();
              return (
                incomeDate.getMonth() ===
                  date.getMonth() &&
                incomeDate.getFullYear() ===
                  date.getFullYear()
              );
            })
            .reduce(
              (sum, current) => sum + current.sum,
              0
            );
          return (
            (incomeSum || 0) + (expenseSum || 0)
          );
        }),
        backgroundColor: 'rgb(200, 120, 110)',
        hoverBackgroundColor:
          'rgb(200, 120, 110)',
        stack: '1',
      },
    ],
  };

  window.addEventListener('resize', () => {
    window.innerHeight > window.innerWidth
      ? setBarAspectRatio(0.8)
      : setBarAspectRatio(2);
  });

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
      <div className='finance__settings'>
        <RangePicker
          popupClassName='finance__calendar'
          showTime
          showNow
          allowClear={false}
          format={DATE_FORMAT}
          defaultValue={[
            dayjs(defaultStartDay, DATE_FORMAT),
            dayjs(defaultEndDay, DATE_FORMAT),
          ]}
          onChange={handleDateRangeChange}
        />
        <label className='finance__sort'>
          доход:{' '}
          <Select
            className='finance__sort-select'
            options={[
              { value: 1, label: 'итого' },
              {
                value: 2,
                label: 'по категориям',
              },
              { value: 3, label: 'по мастерам' },
            ]}
            defaultValue={1}
            onChange={(value) =>
              setIncomeSort(value)
            }
          />
        </label>
        <label className='finance__sort'>
          расход:{' '}
          <Select
            className='finance__sort-select'
            options={[
              { value: 1, label: 'итого' },
              {
                value: 2,
                label: 'по категориям',
              },
            ]}
            defaultValue={1}
            onChange={(value) =>
              setExpenseSort(value)
            }
          />
        </label>
      </div>

      <Bar options={options} data={barData} />

      <Button
        className='finance__open-form-btn'
        type='primary'
        danger={isExpensesFormActive}
        onClick={() => {
          dispatch(setIsExpensesFormOpened(true));
          dispatch(setIsExpensesFormActive(true));
        }}>
        добавить расходы
      </Button>

      <ExpensesForm />
    </div>
  );
}
