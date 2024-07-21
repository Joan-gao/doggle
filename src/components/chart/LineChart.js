import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { useState, useEffect, act } from "react";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";

function LineChart({
  type,
  activeKey,
  incomeSeries,
  incomeCategory,
  expenseCategory,
  expenseSeries,
}) {
  const { Title, Paragraph } = Typography;
  const initialYearSeries = [
    {
      name: "Montly Expense",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      offsetY: 0,
    },
  ];
  const initialMonthSeries = [
    {
      name: "Daily expense",
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
      offsetY: 0,
    },
  ];

  const initialMonthCategory = [
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
    "31",
  ];
  const initialYearCategory = [
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
  ];
  const [series, setSeries] = useState(
    activeKey === "1" ? initialMonthSeries : initialYearSeries
  );
  const [category, setCategory] = useState(
    activeKey === "1" ? initialMonthCategory : initialYearCategory
  );
  const generateColors = (length) => Array(length).fill("#8c8c8c");
  useEffect(() => {
    console.log(activeKey);
    if (activeKey === "1") {
      setSeries(
        type === "income"
          ? incomeSeries && incomeSeries.length > 0
            ? incomeSeries
            : initialMonthSeries
          : expenseSeries && expenseSeries.length > 0
          ? expenseSeries
          : initialMonthSeries
      );
      setCategory(
        type === "income"
          ? incomeCategory && incomeCategory.length > 0
            ? incomeCategory
            : initialMonthCategory
          : expenseCategory && expenseCategory.length > 0
          ? expenseCategory
          : initialMonthCategory
      );
    } else {
      setSeries(
        type === "income"
          ? incomeSeries && incomeSeries.length > 0
            ? incomeSeries
            : initialMonthSeries
          : expenseSeries && expenseSeries.length > 0
          ? expenseSeries
          : initialYearSeries
      );
      setCategory(
        type === "income"
          ? incomeCategory && incomeCategory.length > 0
            ? incomeCategory
            : initialYearCategory
          : expenseCategory && expenseCategory.length > 0
          ? expenseCategory
          : initialYearCategory
      );
    }
  }, [
    activeKey,
    type,
    incomeCategory,
    incomeSeries,
    expenseCategory,
    expenseSeries,
  ]);
  const config = {
    options: {
      chart: {
        width: "100%",
        height: "auto",
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: activeKey === "1" ? "10px" : "14px",
            fontWeight: 600,
            colors: generateColors(category.length),
          },
        },
        categories: category,
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };
  return (
    <>
      <ReactApexChart
        className="full-width"
        options={config.options}
        series={series}
        type="area"
        height={220}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
