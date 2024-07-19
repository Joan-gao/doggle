import { useState } from 'react';

import {
  Card,
  Col,
  Row,
  Typography,
  Segmented,
  Progress,
  Space,
  Select,
} from 'antd';

import Echart from '../components/chart/EChart';
import LineChart from '../components/chart/LineChart';
import DonutChart from '../components/chart/DonutChart';

import { Tabs } from 'antd';

const { Title, Paragraph } = Typography;

export const listData = [
  { category: 'hotel & travel', transactions: 2, amount: -5000 },
  { category: 'rent', transactions: 1, amount: -2000 },
  { category: 'shopping', transactions: 2, amount: -1500 },
];

const generateOptions = (start, end, prefix = '') => {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const value = start + index;
    return { value: value.toString(), label: prefix + value };
  });
};

const months = [
  { value: '1', label: 'Jan' },
  { value: '2', label: 'Feb' },
  { value: '3', label: 'Mar' },
  { value: '4', label: 'Apr' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Jun' },
  { value: '7', label: 'Jul' },
  { value: '8', label: 'Aug' },
  { value: '9', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

const years = generateOptions(2000, 2024, ''); // 生成2000到2024的年份数据

const expenseData = {
  monthly: {
    countData: {
      today: 'Total 8 expenses',
      title: '$53,00',
      persent: '+30%',
      color: '#ed4242',
    },
    chartTitle: 'Expense Monthly Trend',
    categoriesTitle: 'Expense Monthly Categories',
    average: '$200',
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: 'Total 8 expenses',
      title: '$600,000',
      persent: '+20%',
      color: '#ed4242',
    },
    chartTitle: 'Expense Yearly Trend',
    categoriesTitle: 'Expense Yearly Categories',
    average: '$5000',
    sortedData: [], // 你可以根据实际数据填充
  },
};

const incomeData = {
  monthly: {
    countData: {
      today: 'Total 8 incomes',
      title: '$30,000',
      persent: '+10%',
      color: '#28a745',
    },
    chartTitle: 'Income Monthly Trend',
    categoriesTitle: 'Income Monthly Categories',
    average: '$1000',
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: 'Total 8 incomes',
      title: '$360,000',
      persent: '+15%',
      color: '#28a745',
    },
    chartTitle: 'Income Yearly Trend',
    categoriesTitle: 'Income Yearly Categories',
    average: '$30000',
    sortedData: [], // 你可以根据实际数据填充
  },
};

// 选择月份和年份，如果是monthly bill显示月份年份，yearly bill只显示年份
const SelectBar = ({ isMonthly, onSelectChange }) => (
  <Space wrap>
    {isMonthly && (
      <Select
        defaultValue="1"
        style={{ width: 70 }}
        onChange={onSelectChange}
        options={months}
      />
    )}
    <Select
      defaultValue="2024"
      style={{ width: 80 }}
      onChange={onSelectChange}
      options={years}
    />
  </Space>
);

function Dashboard() {
  const { Title, Text } = Typography;

  const [activeKey, setActiveKey] = useState('1');
  const [currentType, setCurrentType] = useState('expense');
  const [chartType, setChartType] = useState('1');

  const totalAmount = listData.reduce(
    (acc, item) => acc + Math.abs(item.amount),
    0
  );

  const sortedData = listData.sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
  );

  const data = currentType === 'expense' ? expenseData : incomeData;
  const displayData = activeKey === '1' ? data.monthly : data.yearly;

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const onSelectChange = (value) => {
    console.log(value);
  };

  const onTypeChange = (value) => {
    setCurrentType(value);
  };

  const onSegmentChange = (value) => {
    setChartType(value);
  };

  const renderChart = () => {
    if (chartType === '1') {
      return <Echart />;
    }
    if (chartType === '2') {
      return <LineChart />;
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
                  <span>{data.countData.today}</span>
                  <Title level={3} style={{ color: data.countData.color }}>
                    {data.countData.title}
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
            <Title level={4}>{data.chartTitle}</Title>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Paragraph>Daily Average: {data.average}</Paragraph>
              <Segmented
                options={[
                  { label: 'Bar', value: '1' },
                  { label: 'Line', value: '2' },
                ]}
                defaultValue="1"
                onChange={onSegmentChange}
                style={{ marginBottom: 8 }}
              />
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                {/* 使用你的 renderChart 方法渲染图表 */}
                {renderChart('1')}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={4}>{data.categoriesTitle}</Title>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                {/* 使用你的 DonutChart 组件渲染饼图 */}
                {/* <DonutChart type={data.chartTitle} /> */}
                <DonutChart />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {sortedData.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Title
                            level={5}
                            style={{ margin: 0, marginRight: '10px' }}
                          >
                            {item.category}
                          </Title>
                          <Paragraph style={{ margin: 0, marginRight: '10px' }}>
                            {item.transactions}
                          </Paragraph>
                        </div>
                        <Paragraph style={{ margin: 0 }}>
                          {item.amount}
                        </Paragraph>
                      </div>
                      <Progress
                        percent={parseFloat(
                          ((Math.abs(item.amount) / totalAmount) * 100).toFixed(
                            1
                          )
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
        style={{ marginBottom: '10px' }}
      >
        <Col>
          <SelectBar
            isMonthly={activeKey === '1'}
            onSelectChange={onSelectChange}
          />
        </Col>
        <Col>
          <Segmented
            options={[
              { label: 'Exp', value: 'expense' },
              { label: 'Inc', value: 'income' },
            ]}
            defaultValue="expense"
            onChange={onTypeChange}
          />
        </Col>
      </Row>

      <CommonContent data={displayData} onSegmentChange={onSegmentChange} />
    </div>
  );
}

export default Dashboard;
