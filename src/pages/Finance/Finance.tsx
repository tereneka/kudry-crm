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
import { DatePicker, Select } from 'antd';
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
import OpenFormBtn from '../../components/OpenFormBtn/OpenFormBtn';
import Spinner from '../../components/Spinner/Spinner';

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

  const {
    data: incomeList,
    isLoading: isIncomeListLoading,
  } = useGetIncomeListQuery(dateRange);
  const {
    data: expenseList,
    isLoading: isExpenseListLoading,
  } = useGetExpenseListQuery(dateRange);
  const {
    data: categoryList,
    isLoading: isCategoryListLoading,
  } = useGetCategoryListQuery();
  const {
    data: masterList,
    isLoading: isMasterListLoading,
  } = useGetMasterListQuery();
  const {
    data: expCategoryList,
    isLoading: isExpCategoryListLoading,
  } = useGetExpensesCategoryListQuery();

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
    ],
  };

  window.addEventListener('resize', () => {
    const num =
      window.innerHeight > window.innerWidth
        ? 0.8
        : 2;
    setChartrAspectRatio(num);
  });

  function openForm() {
    dispatch(setIsExpensesFormOpened(true));
    dispatch(setIsExpensesFormActive(true));
  }

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
    <>
      {isIncomeListLoading ||
      isExpenseListLoading ||
      isMasterListLoading ||
      isCategoryListLoading ||
      isExpCategoryListLoading ? (
        <Spinner />
      ) : (
        <div className='finance'>
          <div className='finance__settings'>
            <RangePicker
              popupClassName='finance__calendar'
              showTime
              showNow
              allowClear={false}
              format={DATE_FORMAT}
              defaultValue={[
                dayjs(
                  defaultStartDay,
                  DATE_FORMAT
                ),
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
                  {
                    value: 3,
                    label: 'по мастерам',
                  },
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
            options={chartOptions(
              chartrAspectRatio
            )}
            data={chartData}
          />

          <OpenFormBtn
            title='добавить расходы'
            isFormActive={isExpensesFormActive}
            onClick={openForm}
          />

          <ExpensesForm />
        </div>
      )}
    </>
  );
}
