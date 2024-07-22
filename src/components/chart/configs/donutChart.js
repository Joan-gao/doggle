export const data = [
  {
    type: "Food",
    value: 25,
  },
  {
    type: "Sports",
    value: 25,
  },
  {
    type: "Shopping",
    value: 30,
  },
  {
    type: "Study",
    value: 15,
  },
];

const series = data.map((item) => item.value);
const labels = data.map((item) => item.type);

export const config = {
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
        const selectedPercentage = ((selectedValue / totalValue) * 100).toFixed(
          1
        );
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
