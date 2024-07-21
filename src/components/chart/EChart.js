import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import eChart from "./configs/eChart";

function EChart({
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
      name: "Sales",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      color: "#fff",
    },
  ];
  const initialMonthSeries = [
    {
      name: "Sales",
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
      color: "#fff",
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
  const generateColors = (length) => Array(length).fill("#fff");
  useEffect(() => {
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
        type: "bar",
        width: "100%",
        height: "auto",

        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      grid: {
        show: true,
        borderColor: "#ccc",
        strokeDashArray: 2,
      },
      xaxis: {
        categories: category,
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: generateColors(category.length),
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: generateColors(category.length),
          },
        },
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  };

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={config.options}
          series={series}
          type="bar"
          height={220}
        />
      </div>
    </>
  );
}

export default EChart;
