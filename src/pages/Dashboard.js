import { useState, useEffect } from "react";
import axios from "axios";
import { useStore, useAuth } from "../context/UserAuth";

import {
  Card,
  Col,
  Row,
  Typography,
  Segmented,
  Progress,
  Space,
  Select,
  Empty,
} from "antd";

import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import DonutChart from "../components/chart/DonutChart";

import { Tabs } from "antd";

const { Title, Paragraph } = Typography;

const initiallistData = [
  { category: "hotel & travel", transactions: 2, amount: -5000 },
  { category: "rent", transactions: 1, amount: -2000 },
  { category: "shopping", transactions: 2, amount: -1500 },
];

const generateOptions = (start, end, prefix = "") => {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const value = start + index;
    return { value: value.toString(), label: prefix + value };
  });
};

const months = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

const years = generateOptions(2000, 2024, ""); // 生成2000到2024的年份数据

const expenseData = {
  monthly: {
    countData: {
      today: "Total 1 expenses",
      title: "$53,00",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$100",
    sortedData: [], // 你可以根据实际数据填充},
  },

  yearly: {
    countData: {
      today: "Total 8 expenses",
      title: "$100,000",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Yearly Trend",
    categoriesTitle: "Expense Yearly Categories",
    average: "$5000",
    sortedData: [], // 你可以根据实际数据填充
  },
};

const incomeData = {
  monthly: {
    countData: {
      today: "Total 1 incomes",
      title: "$10,000",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$1000",
    sortedData: [], // 你可以根据实际数据填充
  },

  yearly: {
    countData: {
      today: "Total 8 incomes",
      title: "$360,000",
      persent: "+15%",
      color: "#28a745",
    },
    chartTitle: "Income Yearly Trend",
    categoriesTitle: "Income Yearly Categories",
    average: "$30000",
    sortedData: [], // 你可以根据实际数据填充
  },
};

const incomeEmptyData = {
  monthly: {
    countData: {
      today: "Total 0 incomes",
      title: "$0",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$0",
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: "Total 0 incomes",
      title: "$0",
      persent: "+15%",
      color: "#28a745",
    },
    chartTitle: "Income Yearly Trend",
    categoriesTitle: "Income Yearly Categories",
    average: "$0",
    sortedData: [], // 你可以根据实际数据填充
  },
};

const expenseEmptyData = {
  monthly: {
    countData: {
      today: "Total 0 expenses",
      title: "$0",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "",
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: "Total 0 expenses",
      title: "$0",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Yearly Trend",
    categoriesTitle: "Expense Yearly Categories",
    average: "$0",
    sortedData: [], // 你可以根据实际数据填充
  },
};

const incomeDataTestFromdb = {
  Feb: {
    countData: {
      today: "Total 3 incomes",
      title: "$11,200",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$3733.33",
    sortedData: [
      { category: "Business income", transactions: 3, amount: 11200 },
    ],
    incomeDonutChart: [{ type: "Business income", value: 11200 }],
    incomeLineChartSeries: [{ name: "Daily Income", data: [11200] }],
    incomeLineChartCategory: ["23"],
    incomeBarChartSeries: [{ name: "Daily Income", data: [11200] }],
    incomeBarChartCategory: ["23"],
  },
  Sep: {
    countData: {
      today: "Total 1 income",
      title: "$500",
      persent: "+5%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$500",
    sortedData: [{ category: "Business income", transactions: 1, amount: 500 }],
    incomeDonutChart: [{ type: "Business income", value: 500 }],
    incomeLineChartSeries: [{ name: "Daily Income", data: [500] }],
    incomeLineChartCategory: ["25"],
    incomeBarChartSeries: [{ name: "Daily Income", data: [500] }],
    incomeBarChartCategory: ["25"],
  },
  yearly: {
    countData: {
      today: "Total 4 incomes",
      title: "$11,700",
      persent: "+20%",
      color: "#28a745",
    },
    chartTitle: "Income Yearly Trend",
    categoriesTitle: "Income Yearly Categories",
    average: "$2925",
    sortedData: [
      { category: "Business income", transactions: 4, amount: 11700 },
    ],
    incomeDonutChart: [{ type: "Business income", value: 11700 }],
    incomeLineChartSeries: [{ name: "Monthly Income", data: [11200, 500] }],
    incomeLineChartCategory: ["Feb", "Sep"],
    incomeBarChartSeries: [{ name: "Monthly Income", data: [11200, 500] }],
    incomeBarChartCategory: ["Feb", "Sep"],
  },
};

const expenseDataTestFromdb = {
  Jan: {
    countData: {
      today: "Total 11 expenses",
      title: "$3,001.83",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$273.80",
    sortedData: [
      { category: "Housing expense", transactions: 4, amount: 2924.86 },
      { category: "Shopping expense", transactions: 3, amount: 91.59 },
      { category: "Entertainment expense", transactions: 3, amount: 36.48 },
      { category: "Education expense", transactions: 1, amount: 33.59 },
      { category: "Insurance expense", transactions: 1, amount: 1.01 },
    ],
    expenseDonutChart: [
      { type: "Housing expense", value: 2924.86 },
      { type: "Shopping expense", value: 91.59 },
      { type: "Entertainment expense", value: 36.48 },
      { type: "Education expense", value: 33.59 },
      { type: "Insurance expense", value: 1.01 },
    ],
    expenseLineChartSeries: [
      {
        name: "Daily Expense",
        data: [
          712, 80.86, 35.79, 6.49, 29.99, 20.01, 732, 1400, 35.79, 33.59, 1.01,
        ],
      },
    ],
    expenseLineChartCategory: [
      "1",
      "4",
      "6",
      "6",
      "10",
      "12",
      "12",
      "18",
      "25",
      "30",
      "30",
    ],
    expenseBarChartSeries: [
      {
        name: "Daily Expense",
        data: [
          712, 80.86, 35.79, 6.49, 29.99, 20.01, 732, 1400, 35.79, 33.59, 1.01,
        ],
      },
    ],
    expenseBarChartCategory: [
      "1",
      "4",
      "6",
      "6",
      "10",
      "12",
      "12",
      "18",
      "25",
      "30",
      "30",
    ],
  },
  Feb: {
    countData: {
      today: "Total 36 expenses",
      title: "$1,605.04",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$44.58",
    sortedData: [
      { category: "Food expense", transactions: 7, amount: 150.08 },
      { category: "Transportation expense", transactions: 9, amount: 170.1 },
      { category: "Entertainment expense", transactions: 3, amount: 36.48 },
      { category: "Health expense", transactions: 6, amount: 1411.55 },
      { category: "Insurance expense", transactions: 1, amount: 1.01 },
      { category: "Education expense", transactions: 4, amount: 110.86 },
      { category: "Grocery expense", transactions: 12, amount: 372.48 },
      { category: "Shopping expense", transactions: 3, amount: 100.79 },
    ],
    expenseDonutChart: [
      { type: "Food expense", value: 150.08 },
      { type: "Transportation expense", value: 170.1 },
      { type: "Entertainment expense", value: 36.48 },
      { type: "Health expense", value: 1411.55 },
      { type: "Insurance expense", value: 1.01 },
      { type: "Education expense", value: 110.86 },
      { type: "Grocery expense", value: 372.48 },
      { type: "Shopping expense", value: 100.79 },
    ],
    expenseLineChartSeries: [
      {
        name: "Daily Expense",
        data: [
          6.49, 165, 51, 34.69, 20, 39.17, 16.9, 59.65, 3.05, 28.28, 158.23, 59,
          5.73, 45.76, 3.2, 27.78, 338, 169, 90.9, 33.3, 14.3, 21.55, -60.5,
          1.2, 10.39, 2, 101.94, 7.42, 28.32, 2.24, 3.2, 35.6, 2.24, 13.5, 676,
          121.12, 4.3, 56.21, 77.3, 2.24, 16.5, 17.2, 19.2, 2.24, 33.64, 1.01,
          4.8, 3.99, 7.05, 2935.6,
        ],
      },
    ],
    expenseLineChartCategory: [
      "6",
      "8",
      "8",
      "9",
      "9",
      "9",
      "10",
      "10",
      "10",
      "10",
      "10",
      "10",
      "10",
      "13",
      "13",
      "13",
      "14",
      "14",
      "14",
      "15",
      "16",
      "16",
      "16",
      "17",
      "17",
      "17",
      "19",
      "20",
      "20",
      "20",
      "20",
      "20",
      "21",
      "21",
      "21",
      "22",
      "23",
      "23",
      "23",
      "23",
      "24",
      "27",
      "27",
      "27",
      "27",
      "27",
    ],
    expenseBarChartSeries: [
      {
        name: "Daily Expense",
        data: [
          6.49, 165, 51, 34.69, 20, 39.17, 16.9, 59.65, 3.05, 28.28, 158.23, 59,
          5.73, 45.76, 3.2, 27.78, 338, 169, 90.9, 33.3, 14.3, 21.55, -60.5,
          1.2, 10.39, 2, 101.94, 7.42, 28.32, 2.24, 3.2, 35.6, 2.24, 13.5, 676,
          121.12, 4.3, 56.21, 77.3, 2.24, 16.5, 17.2, 19.2, 2.24, 33.64, 1.01,
          4.8, 3.99, 7.05, 2935.6,
        ],
      },
    ],
    expenseBarChartCategory: [
      "6",
      "8",
      "8",
      "9",
      "9",
      "9",
      "10",
      "10",
      "10",
      "10",
      "10",
      "10",
      "10",
      "13",
      "13",
      "13",
      "14",
      "14",
      "14",
      "15",
      "16",
      "16",
      "16",
      "17",
      "17",
      "17",
      "19",
      "20",
      "20",
      "20",
      "20",
      "20",
      "21",
      "21",
      "21",
      "22",
      "23",
      "23",
      "23",
      "23",
      "24",
      "27",
      "27",
      "27",
      "27",
      "27",
    ],
  },
  Jul: {
    countData: {
      today: "Total 27 expenses",
      title: "$7,643.47",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$282.35",
    sortedData: [
      { category: "Food expense", transactions: 4, amount: 458.35 },
      { category: "Transportation expense", transactions: 2, amount: 652 },
      { category: "Entertainment expense", transactions: 2, amount: 240.52 },
      { category: "Health expense", transactions: 1, amount: 488.16 },
      { category: "Insurance expense", transactions: 2, amount: 580.87 },
      { category: "Utilities expense", transactions: 2, amount: 219.8 },
      { category: "Education expense", transactions: 3, amount: 815.6 },
      { category: "Other Expenses expense", transactions: 2, amount: 786.49 },
      {
        category: "Investment Expens expense",
        transactions: 2,
        amount: 376.45,
      },
      { category: "Shopping expense", transactions: 3, amount: 441.6 },
      { category: "Grocery expense", transactions: 4, amount: 348.95 },
      { category: "Housing expense", transactions: 1, amount: 700 },
      { category: "Business income", transactions: 2, amount: 1005 },
    ],
    expenseDonutChart: [
      { type: "Food expense", value: 458.35 },
      { type: "Transportation expense", value: 652 },
      { type: "Entertainment expense", value: 240.52 },
      { type: "Health expense", value: 488.16 },
      { type: "Insurance expense", value: 580.87 },
      { type: "Utilities expense", value: 219.8 },
      { type: "Education expense", value: 815.6 },
      { type: "Other Expenses expense", value: 786.49 },
      { type: "Investment Expens expense", value: 376.45 },
      { type: "Shopping expense", value: 441.6 },
      { type: "Grocery expense", value: 348.95 },
      { type: "Housing expense", value: 700 },
      { type: "Business income", value: 1005 },
    ],
    expenseLineChartSeries: [
      {
        name: "Daily Expense",
        data: [
          542, 185.35, 240.1, 50.22, 320.87, 488.16, 132.5, 95, 855, 700,
          450.99, 301.45, 215.6, 190.5, 136.7, 99.8, 505, 158.25, 222, 990, 430,
          300, 260, 120, 140.5, 75, 335.5, 190.3, 110, 85.75,
        ],
      },
    ],
    expenseLineChartCategory: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ],
    expenseBarChartSeries: [
      {
        name: "Daily Expense",
        data: [
          542, 185.35, 240.1, 50.22, 320.87, 488.16, 132.5, 95, 855, 700,
          450.99, 301.45, 215.6, 190.5, 136.7, 99.8, 505, 158.25, 222, 990, 430,
          300, 260, 120, 140.5, 75, 335.5, 190.3, 110, 85.75,
        ],
      },
    ],
    expenseBarChartCategory: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ],
  },
  Aug: {
    countData: {
      today: "Total 1 expense",
      title: "$15.25",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$15.25",
    sortedData: [
      { category: "Shopping expense", transactions: 1, amount: 15.25 },
    ],
    expenseDonutChart: [{ type: "Shopping expense", value: 15.25 }],
    expenseLineChartSeries: [{ name: "Daily Expense", data: [15.25] }],
    expenseLineChartCategory: ["8"],
    expenseBarChartSeries: [{ name: "Daily Expense", data: [15.25] }],
    expenseBarChartCategory: ["8"],
  },
  Sep: {
    countData: {
      today: "Total 16 expenses",
      title: "$583.24",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$36.45",
    sortedData: [
      { category: "Shopping expense", transactions: 6, amount: 111.68 },
      { category: "Transportation expense", transactions: 5, amount: 85.53 },
      { category: "Grocery expense", transactions: 3, amount: 66.5 },
      { category: "Business income", transactions: 1, amount: 500 },
    ],
    expenseDonutChart: [
      { type: "Shopping expense", value: 111.68 },
      { type: "Transportation expense", value: 85.53 },
      { type: "Grocery expense", value: 66.5 },
      { type: "Business income", value: 500 },
    ],
    expenseLineChartSeries: [
      {
        name: "Daily Expense",
        data: [
          15.25, 13.08, 18, 26.1, 29, 30.01, 19.4, 20, 500, 14.02, 15.73, 20,
          28.44, 3.53, 17.5, 13.11, 39.38, 61.92, 8.53, 10.7, 5.44,
        ],
      },
    ],
    expenseLineChartCategory: [
      "8",
      "18",
      "18",
      "18",
      "18",
      "18",
      "19",
      "22",
      "25",
      "25",
      "25",
      "25",
      "25",
      "25",
      "26",
      "26",
      "27",
      "27",
      "27",
      "27",
      "28",
    ],
    expenseBarChartSeries: [
      {
        name: "Daily Expense",
        data: [
          15.25, 13.08, 18, 26.1, 29, 30.01, 19.4, 20, 500, 14.02, 15.73, 20,
          28.44, 3.53, 17.5, 13.11, 39.38, 61.92, 8.53, 10.7, 5.44,
        ],
      },
    ],
    expenseBarChartCategory: [
      "8",
      "18",
      "18",
      "18",
      "18",
      "18",
      "19",
      "22",
      "25",
      "25",
      "25",
      "25",
      "25",
      "25",
      "26",
      "26",
      "27",
      "27",
      "27",
      "27",
      "28",
    ],
  },
  yearly: {
    countData: {
      today: "Total 91 expenses",
      title: "$12,848.37",
      persent: "+25%",
      color: "#ed4242",
    },
    chartTitle: "Expense Yearly Trend",
    categoriesTitle: "Expense Yearly Categories",
    average: "$141.19",
    sortedData: [
      { category: "Housing expense", transactions: 5, amount: 3624.86 },
      { category: "Shopping expense", transactions: 13, amount: 350.91 },
      { category: "Entertainment expense", transactions: 5, amount: 77.97 },
      { category: "Education expense", transactions: 5, amount: 144.45 },
      { category: "Insurance expense", transactions: 2, amount: 1.01 },
      { category: "Grocery expense", transactions: 15, amount: 439.56 },
      { category: "Transportation expense", transactions: 13, amount: 737.66 },
      { category: "Health expense", transactions: 6, amount: 1411.55 },
      { category: "Business income", transactions: 3, amount: 11200 },
    ],
    expenseDonutChart: [
      { type: "Housing expense", value: 3624.86 },
      { type: "Shopping expense", value: 350.91 },
      { type: "Entertainment expense", value: 77.97 },
      { type: "Education expense", value: 144.45 },
      { type: "Insurance expense", value: 1.01 },
      { type: "Grocery expense", value: 439.56 },
      { type: "Transportation expense", value: 737.66 },
      { type: "Health expense", value: 1411.55 },
      { type: "Business income", value: 11200 },
    ],
    expenseLineChartSeries: [
      {
        name: "Monthly Expense",
        data: [3001.83, 1605.04, 0, 0, 0, 0, 7643.47, 15.25, 583.24, 0, 0, 0],
      },
    ],
    expenseLineChartCategory: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    expenseBarChartSeries: [
      {
        name: "Monthly Expense",
        data: [3001.83, 1605.04, 0, 0, 0, 0, 7643.47, 15.25, 583.24, 0, 0, 0],
      },
    ],
    expenseBarChartCategory: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};
// 选择月份和年份，如果是monthly bill显示月份年份，yearly bill只显示年份

const SelectBar = ({ isMonthly, onMonthChange, onYearChange }) => (
  <Space wrap>
    {isMonthly && (
      <Select
        defaultValue="Jan"
        style={{ width: 70 }}
        onChange={onMonthChange}
        options={months}
      />
    )}
    <Select
      defaultValue="2024"
      style={{ width: 80 }}
      onChange={onYearChange}
      options={years}
    />
  </Space>
);

function Dashboard() {
  // const { user, isLogged } = useGlobalContext();
  const { Title, Text } = Typography;
  const [activeKey, setActiveKey] = useState("1");
  const [currentType, setCurrentType] = useState("expense");
  const [chartType, setChartType] = useState("1");
  const [registrationYear, setRegistrationYear] = useState(2024);
  const [registrationMonth, setRegistrationMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [showProgress, setShowProgress] = useState(false);
  const [incomeDataState, setIncomeDataState] = useState(incomeEmptyData);
  const [expenseDataState, setExpenseDataState] = useState(expenseEmptyData);
  const [dounghtIncomeData, setDounghtIncomeData] = useState([]);
  const [dounghtexpenseData, setDounghtExpenseData] = useState([]);
  const [lineIncomeSeries, setLineIncomeSeries] = useState([]);
  const [lineIncomeCategory, setLineIncomeCategory] = useState([]);
  const [barIncomeSeries, setBarIncomeSeries] = useState([]);
  const [barIncomeCategory, setBarIncomeCategory] = useState([]);
  const [lineExpenseSeries, setLineExpenseSeries] = useState([]);
  const [lineExpenseCategory, setLineExpenseCategory] = useState([]);
  const [barExpenseSeries, setBarExpenseSeries] = useState([]);
  const [barExpenseCategory, setBarExpenseCategory] = useState([]);
  const [listData, setListData] = useState(initiallistData);
  const [userloaded, setUserLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [expenseDataFromdb, setExpenseDataFromdb] = useState(
    expenseDataTestFromdb
  );
  const [incomeDataFromdb, setIncomeDataFromdb] =
    useState(incomeDataTestFromdb);
  useAuth();
  const { user, loading } = useStore();

  const getMonthLabel = (monthValue) => {
    const month = months.find((m) => m.value === monthValue);
    return month ? month.label : "Invalid month value";
  };

  // const updateTransactionItem = (data) => {
  //   setIncomeDataFromdb(data[1]);
  //   setExpenseDataFromdb(data[0]);
  // };
  // useEffect(() => {
  //   if (userloaded) {
  //     fetch("http://127.0.0.1:5000/transaction/analysis", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //       body: JSON.stringify({
  //         user: currentUser, // 根据实际用户ID字段名称调整
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         updateTransactionItem(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching transactions:", error);
  //       });
  //   }
  // }, [userloaded, currentUser]);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (user && !userloaded) {
  //       const createdAt = user.user.created_at;

  //       const createdyear = parseInt(createdAt.substring(0, 4), 10);
  //       const createdmonth = parseInt(createdAt.substring(5, 7), 10);

  //       setRegistrationYear(createdyear);
  //       setRegistrationMonth(createdmonth);
  //       setCurrentUser(user);
  //       setUserLoaded(true); // Indicate that user data is loaded
  //       clearInterval(interval); // Stop polling once user data is loaded
  //     }
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [currentUser, userloaded, user]);
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const monthLabel = getMonthLabel(month);

    // 调用后端查询用户的注册日期，然后根据用户的注册日期判断选择的月份年份是否是有效的，如果是无效的，则直接都为空不进一步向后端请求数据
    if (month && year && registrationMonth && registrationYear) {
      if (activeKey === "2") {
        if (currentYear < year || registrationYear > year) {
          setShowProgress(false);
          if (currentType === "expense") {
            setExpenseDataState(expenseEmptyData);
            setDounghtExpenseData([]);
            setLineExpenseCategory([]);
            setLineExpenseSeries([]);
            setBarExpenseCategory([]);
            setBarExpenseSeries([]);
          } else {
            setIncomeDataState(incomeEmptyData);
            setShowProgress(false);
            setDounghtIncomeData([]);
            setLineIncomeCategory([]);
            setLineIncomeSeries([]);
            setBarIncomeCategory([]);
            setBarIncomeSeries([]);
          }
        } else {
          setShowProgress(true);
          if (currentType === "expense") {
            setExpenseDataState(expenseDataFromdb);
            setListData(expenseDataFromdb.yearly.sortedData);
            setDounghtExpenseData(expenseDataFromdb.yearly.expenseDonutChart);
            setLineExpenseCategory(
              expenseDataFromdb.yearly.expenseLineChartCategory
            );
            setLineExpenseSeries(
              expenseDataFromdb.yearly.expenseLineChartSeries
            );
            setBarExpenseCategory(
              expenseDataFromdb.yearly.expenseBarChartCategory
            );
            setBarExpenseSeries(expenseDataFromdb.yearly.expenseBarChartSeries);
          } else {
            setIncomeDataState(incomeDataFromdb);
            setListData(incomeDataFromdb.yearly.sortedData);
            setDounghtIncomeData(incomeDataFromdb.yearly.incomeDonutChart);
            setLineIncomeCategory(
              incomeDataFromdb.yearly.incomeLineChartCategory
            );
            setLineIncomeSeries(incomeDataFromdb.yearly.incomeLineChartSeries);
            setBarIncomeCategory(
              incomeDataFromdb.yearly.incomeBarChartCategory
            );
            setBarIncomeSeries(incomeDataFromdb.yearly.incomeBarChartSeries);
          }
        }
      } else if (activeKey === "1") {
        if (currentYear < year || registrationYear > year) {
          setShowProgress(false);
          if (currentType === "expense") {
            setExpenseDataState(expenseEmptyData);
            setDounghtExpenseData([]);
            setLineExpenseCategory([]);
            setLineExpenseSeries([]);
            setBarExpenseCategory([]);
            setBarExpenseSeries([]);
          } else {
            setIncomeDataState(incomeEmptyData);
            setShowProgress(false);
            setDounghtIncomeData([]);
            setLineIncomeCategory([]);
            setLineIncomeSeries([]);
            setBarIncomeCategory([]);
            setBarIncomeSeries([]);
          }
        } else if (registrationMonth > month || currentMonth < month) {
          setShowProgress(false);
          if (currentType === "expense") {
            setExpenseDataState(expenseEmptyData);
          } else {
            setIncomeDataState(incomeEmptyData);
          }
        } else {
          if (monthLabel) {
            console.log("Get in this method", monthLabel);
            if (currentType === "expense") {
              setExpenseDataState({
                ...expenseDataState,
                monthly:
                  expenseDataFromdb[monthLabel] || expenseEmptyData.monthly,
              });
              if (expenseDataFromdb[monthLabel]) {
                setShowProgress(true);
                setListData(expenseDataFromdb[monthLabel].sortedData);
                setDounghtExpenseData(
                  expenseDataFromdb[monthLabel].expenseDonutChart
                );
                setLineExpenseCategory(
                  expenseDataFromdb[monthLabel].expenseLineChartCategory
                );
                setLineExpenseSeries(
                  expenseDataFromdb[monthLabel].expenseLineChartSeries
                );
                setBarExpenseCategory(
                  expenseDataFromdb[monthLabel].expenseBarChartCategory
                );
                setBarExpenseSeries(
                  expenseDataFromdb[monthLabel].expenseBarChartSeries
                );
              } else {
                setShowProgress(false);
                setDounghtExpenseData([]);
                setLineExpenseCategory([]);
                setLineExpenseSeries([]);
                setBarExpenseCategory([]);
                setBarExpenseSeries([]);
              }
            } else {
              setIncomeDataState({
                ...incomeDataState,
                monthly:
                  incomeDataFromdb[monthLabel] || incomeEmptyData.monthly,
              });
              if (incomeDataFromdb[monthLabel]) {
                setShowProgress(true);
                setListData(incomeDataFromdb[monthLabel].sortedData);
                setDounghtIncomeData(
                  incomeDataFromdb[monthLabel].incomeDonutChart
                );
                setLineIncomeCategory(
                  incomeDataFromdb[monthLabel].incomeLineChartCategory
                );
                setLineIncomeSeries(
                  incomeDataFromdb[monthLabel].incomeLineChartSeries
                );
                setBarIncomeCategory(
                  incomeDataFromdb[monthLabel].incomeBarChartCategory
                );
                setBarIncomeSeries(
                  incomeDataFromdb[monthLabel].incomeBarChartSeries
                );
              } else {
                setShowProgress(false);
                setDounghtIncomeData([]);
                setLineIncomeCategory([]);
                setLineIncomeSeries([]);
                setBarIncomeCategory([]);
                setBarIncomeSeries([]);
              }
            }
          } else {
            if (currentType === "expense") {
              setExpenseDataState({
                ...expenseDataState,
                monthly: expenseEmptyData.monthly,
              });
            } else {
              setIncomeDataState({
                ...incomeDataState,
                monthly: incomeEmptyData.monthly,
              });
            }
          }
        }
      }
    } else {
      if (currentType === "expense") {
        setExpenseDataState(expenseEmptyData);
      } else {
        setIncomeDataState(incomeEmptyData);
      }
    }
  }, [
    currentType,
    month,
    year,
    activeKey,
    registrationMonth,
    registrationYear,
    expenseDataFromdb,
    expenseDataState,
    incomeDataFromdb,
    incomeDataState,
  ]);
  const displayData =
    currentType === "expense"
      ? activeKey === "1"
        ? expenseDataState?.monthly
        : expenseDataState?.yearly
      : activeKey === "1"
      ? incomeDataState?.monthly
      : incomeDataState?.yearly;
  // 确保 displayData 始终有默认值
  const safeDisplayData = displayData || {
    countData: {
      today: "",
      title: "",
      persent: "",
      color: "",
    },
    chartTitle: "",
    categoriesTitle: "",
    average: "",
    sortedData: [],
  };
  console.log("SafeDisplayData", safeDisplayData);

  const totalAmount = listData.reduce(
    (acc, item) => acc + Math.abs(item.amount),
    0
  );

  const sortedData = listData.sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
  );

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const onTypeChange = (value) => {
    setCurrentType(value);
  };

  const onSegmentChange = (value) => {
    setChartType(value);
  };
  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const handleYearChange = (value) => {
    setYear(value);
  };
  const renderChart = () => {
    if (chartType === "1") {
      return (
        <Echart
          type={currentType}
          activeKey={activeKey}
          incomeCategory={barIncomeCategory}
          incomeSeries={barIncomeSeries}
          expenseCategory={barExpenseCategory}
          expenseSeries={barExpenseSeries}
        />
      );
    }
    if (chartType === "2") {
      return (
        <LineChart
          type={currentType}
          activeKey={activeKey}
          incomeCategory={lineIncomeCategory}
          incomeSeries={lineIncomeSeries}
          expenseCategory={lineExpenseCategory}
          expenseSeries={lineExpenseSeries}
        />
      );
    }
    return null;
  };

  const CommonContent = ({ data, onSegmentChange }) => (
    <>
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
          <Card bordered={false} className="criclebox">
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>{data?.countData.today}</span>
                  <Title level={3} style={{ color: data.countData.color }}>
                    {data?.countData.title}
                  </Title>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={4}>{data?.chartTitle}</Title>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Paragraph>Daily Average: {data?.average}</Paragraph>
              <Segmented
                options={[
                  { label: "Bar", value: "1" },
                  { label: "Line", value: "2" },
                ]}
                defaultValue="1"
                onChange={onSegmentChange}
                style={{ marginBottom: 8 }}
              />
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                {/* 使用你的 renderChart 方法渲染图表 */}
                {renderChart("1")}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={4}>{data?.categoriesTitle}</Title>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                {/* 使用你的 DonutChart 组件渲染饼图 */}
                {/* <DonutChart type={data.chartTitle} /> */}
                <DonutChart
                  type={currentType}
                  month={month}
                  year={year}
                  registrationMonth={registrationMonth}
                  registrationYear={registrationYear}
                  incomeData={dounghtIncomeData}
                  expenseData={dounghtexpenseData}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {showProgress &&
                    sortedData.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Title
                              level={5}
                              style={{ margin: 0, marginRight: "10px" }}
                            >
                              {item.category}
                            </Title>
                            <Paragraph
                              style={{ margin: 0, marginRight: "10px" }}
                            >
                              {item.transactions}
                            </Paragraph>
                          </div>
                          <Paragraph style={{ margin: 0 }}>
                            {item.amount}
                          </Paragraph>
                        </div>
                        <Progress
                          percent={parseFloat(
                            (
                              (Math.abs(item.amount) / totalAmount) *
                              100
                            ).toFixed(1)
                          )}
                          showInfo={false}
                        />
                      </div>
                    ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        onChange={onTabChange}
        centered
      >
        <Tabs.TabPane tab="Monthly Bill" key="1" />
        <Tabs.TabPane tab="Yearly Bill" key="2" />
      </Tabs>
      <Row
        justify="space-between"
        align="middle"
        gutter={[24, 0]}
        style={{ marginBottom: "10px" }}
      >
        <Col>
          <SelectBar
            isMonthly={activeKey === "1"}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
        </Col>
        <Col>
          <Segmented
            options={[
              { label: "Exp", value: "expense" },
              { label: "Inc", value: "income" },
            ]}
            defaultValue="expense"
            onChange={onTypeChange}
          />
        </Col>
      </Row>

      <CommonContent data={safeDisplayData} onSegmentChange={onSegmentChange} />
    </div>
  );
}

export default Dashboard;
