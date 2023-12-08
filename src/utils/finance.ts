import {
  Master,
  Category,
  DbIncome,
  ExpensesCategory,
  DbExpenses,
} from '../types';
import { numberFormat } from './format';

function getDateRangeList(dateRange: {
  startDate: Date;
  endDate: Date;
}) {
  function getDate(n: number, initDate: Date) {
    return new Date(
      initDate.getFullYear(),
      initDate.getMonth() + n
    );
  }

  let result = [];
  let num = 0;
  let date = getDate(0, dateRange.startDate);

  if (
    dateRange.startDate.getMonth() ===
      dateRange.endDate.getMonth() &&
    dateRange.startDate.getFullYear() ===
      dateRange.endDate.getFullYear()
  ) {
    return [date];
  }

  const endDate = getDate(0, dateRange.endDate);
  while (date < endDate) {
    date = getDate(num, dateRange.startDate);
    result.push(date);
    num += 1;
  }

  return result;
}
const incomeColorList = [
  'rgb(20, 100, 120)',
  'rgb(170, 160, 30)',
  'rgb(220, 100, 70)',
  'rgb(137, 175, 176)',
  'rgba(215, 142, 123)',
];

const expenseColorList = [
  'rgb(180, 180, 180)',
  'rgb(120, 120, 120)',
  'rgb(160, 160, 160)',
  'rgb(100, 100, 100)',
  'rgb(140, 140, 140)',
];

const chartOptions = (
  chartAspectRatio: number
) => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
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
    aspectRatio: chartAspectRatio,
  };
};

const incomeChartDatasets = (
  incomeSortList:
    | Master[]
    | Category[]
    | {
        name: string;
        id: number;
      }[],
  dateRangeList: Date[],
  incomeList: DbIncome[] | undefined,
  incomeSort: number
) =>
  incomeSortList.map((item, index) => {
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
  });

const expenseChartDatasets = (
  expenseSortList:
    | ExpensesCategory[]
    | {
        name: string;
        id: number;
      }[],
  dateRangeList: Date[],
  expenseList: DbExpenses[] | undefined,
  expenseSort: number
) =>
  expenseSortList.map((category, index) => {
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
  });

const profitChartDaraset = (
  dateRangeList: Date[],
  expenseList: DbExpenses[] | undefined,
  incomeList: DbIncome[] | undefined
) => {
  return {
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
          const incomeDate = income.date.toDate();
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
      return (incomeSum || 0) + (expenseSum || 0);
    }),
    backgroundColor: 'rgb(200, 120, 110)',
    hoverBackgroundColor: 'rgb(200, 120, 110)',
    stack: '1',
  };
};
export {
  getDateRangeList,
  incomeColorList,
  expenseColorList,
  chartOptions,
  incomeChartDatasets,
  expenseChartDatasets,
  profitChartDaraset,
};
