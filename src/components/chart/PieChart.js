import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import { config } from './configs/pieChart';

const PieChart = () => {
  return <Pie {...config} />;
};

export default PieChart;
