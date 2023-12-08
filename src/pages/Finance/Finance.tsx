import { useState } from 'react';
import './Finance.css';
import {
  useGetCategoryListQuery,
  useGetExpenseListQuery,
  useGetExpensesCategoryListQuery,
  useGetIncomeListQuery,
  useGetMasterListQuery,
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
import { convertDateStrToDate } from '../../utils/date';
import {
  chartOptions,
  expenseChartDatasets,
  getDateRangeList,
  incomeChartDatasets,
  profitChartDaraset,
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
  const [
    chartrAspectRatio,
    setChartrAspectRatio,
  ] = useState(
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

  const incomeSortList =
    incomeSort === 1
      ? [{ name: 'доход', id: 1 }]
      : incomeSort === 2
      ? categoryList || []
      : masterList || [];

  const expenseSortList =
    expenseSort === 1
      ? [{ name: 'расход', id: 1 }]
      : expCategoryList || [];

  const chartData = {
    labels: dateRangeList.map(
      (date) =>
        date.toLocaleDateString().slice(3, 6) +
        date.toLocaleDateString().slice(8)
    ),
    datasets: [
      ...incomeChartDatasets(
        incomeSortList,
        dateRangeList,
        incomeList,
        incomeSort
      ),
      ...expenseChartDatasets(
        expenseSortList,
        dateRangeList,
        expenseList,
        expenseSort
      ),
      profitChartDaraset(
        dateRangeList,
        expenseList,
        incomeList
      ),
      // {
      //   label: 'прибыль',
      //   data: dateRangeList.map((date) => {
      //     const expenseSum = expenseList
      //       ?.filter((expense) => {
      //         const expenseDate =
      //           expense.date.toDate();
      //         return (
      //           expenseDate.getMonth() ===
      //             date.getMonth() &&
      //           expenseDate.getFullYear() ===
      //             date.getFullYear()
      //         );
      //       })
      //       .reduce(
      //         (sum, current) => sum - current.sum,
      //         0
      //       );
      //     const incomeSum = incomeList
      //       ?.filter((income) => {
      //         const incomeDate =
      //           income.date.toDate();
      //         return (
      //           incomeDate.getMonth() ===
      //             date.getMonth() &&
      //           incomeDate.getFullYear() ===
      //             date.getFullYear()
      //         );
      //       })
      //       .reduce(
      //         (sum, current) => sum + current.sum,
      //         0
      //       );
      //     return (
      //       (incomeSum || 0) + (expenseSum || 0)
      //     );
      //   }),
      //   backgroundColor: 'rgb(200, 120, 110)',
      //   hoverBackgroundColor:
      //     'rgb(200, 120, 110)',
      //   stack: '1',
      // },
    ],
  };

  window.addEventListener('resize', () => {
    const num =
      window.innerHeight > window.innerWidth
        ? 0.8
        : 2;
    setChartrAspectRatio(num);
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

      <Bar
        options={chartOptions(chartrAspectRatio)}
        data={chartData}
      />

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
