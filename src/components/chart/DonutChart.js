import React from 'react';
import Chart from 'react-apexcharts';
import { config } from './configs/donutChart'; // 导入配置

const DonutChart = () => {
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
