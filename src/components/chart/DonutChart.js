import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const DonutChart = ({
  type,
  month,
  year,
  registrationMonth,
  registrationYear,
}) => {
  const expenseInitialData = [
    { type: "Housing", value: 8 },
    { type: "Food", value: 9 },
    { type: "Transportation", value: 10 },
    { type: "Entertainment", value: 11 },
    { type: "Utilities", value: 12 },
    { type: "Health", value: 13 },
    { type: "Insurance", value: 14 },
    { type: "Education", value: 15 },
    { type: "Other Expenses", value: 16 },
    { type: "Investment Expens", value: 17 },
    { type: "Shopping", value: 18 },
    { type: "Grocery", value: 19 },
  ];
  const incomeInitialData = [
    { type: "Salary", value: 1 },
    { type: "Bonus", value: 2 },
    { type: "Investment Income", value: 3 },
    { type: "Other Income", value: 4 },
    { type: "Business", value: 5 },
    { type: "Part-time Job", value: 6 },
    { type: "Buying and Selling", value: 7 },
  ];
  const EmptyIncome = [
    { type: "Salary", value: 0 },
    { type: "Bonus", value: 0 },
    { type: "Investment Income", value: 0 },
    { type: "Other Income", value: 0 },
    { type: "Business", value: 0 },
    { type: "Part-time Job", value: 0 },
    { type: "Buying and Selling", value: 0 },
  ];
  const EmptyExpense = [
    { type: "Housing", value: 0 },
    { type: "Food", value: 0 },
    { type: "Transportation", value: 0 },
    { type: "Entertainment", value: 0 },
    { type: "Utilities", value: 0 },
    { type: "Health", value: 0 },
    { type: "Insurance", value: 0 },
    { type: "Education", value: 0 },
    { type: "Other Expenses", value: 0 },
    { type: "Investment Expens", value: 0 },
    { type: "Shopping", value: 0 },
    { type: "Grocery", value: 0 },
  ];

  const initialData =
    type === "income" ? incomeInitialData : expenseInitialData;

  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (month && year && registrationMonth && registrationYear) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      if (currentYear < year || registrationYear > year) {
        type === "expense" ? setData(EmptyExpense) : setData(EmptyIncome);
      }

      if (registrationMonth > month || currentMonth < month) {
        type === "expense" ? setData(EmptyExpense) : setData(EmptyIncome);
      }
    } else {
      setData(type === "income" ? incomeInitialData : expenseInitialData);
    }
  }, []);

  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.type);

  const config = {
    chart: {
      type: "donut",
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const selectedLabel = config.w.globals.labels[config.dataPointIndex];
          const selectedValue = config.w.globals.series[config.dataPointIndex];
          const totalValue = config.w.globals.seriesTotals.reduce(
            (a, b) => a + b,
            0
          );
          const selectedPercentage = (
            (selectedValue / totalValue) *
            100
          ).toFixed(1);
          chartContext.updateOptions(
            {
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      total: {
                        show: true,
                        showAlways: true,
                        label: selectedLabel,
                        formatter: function () {
                          return `${selectedPercentage}%`;
                        },
                      },
                    },
                  },
                },
              },
            },
            false,
            false
          );
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: "#373d3f",
              offsetY: 16,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    labels: labels,
    series: series,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <Chart
        options={config}
        series={config.series}
        type="donut"
        width="100%"
        height="600px"
      />
    </div>
  );
};

export default DonutChart;
