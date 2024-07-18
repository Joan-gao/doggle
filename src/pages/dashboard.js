import { useState } from 'react';

import { Card, Col, Row, Typography, Segmented, Progress } from 'antd';

import Echart from '../components/chart/EChart';
import LineChart from '../components/chart/LineChart';
import PieChart from '../components/chart/PieChart';
import DonutChart from '../components/chart/DonutChart';

import { Tabs } from 'antd';

const { Title, Paragraph } = Typography;

const expenseTrend = () => {
  return (
    <div>
      <h2>Monthly Expense Categories</h2>
      {/* 这里放入月账单的图表组件或其他内容 */}
    </div>
  );
};

const expenseCategories = () => {
  return (
    <div>
      <h2>Monthly Expense Categories</h2>
      {/* 这里放入月账单的图表组件或其他内容 */}
    </div>
  );
};

const incomeTrend = () => {
  return (
    <div>
      <h2>Monthly Expense Categories</h2>
      {/* 这里放入月账单的图表组件或其他内容 */}
    </div>
  );
};

const incomeCategories = () => {
  return (
    <div>
      <h2>Monthly Expense Categories</h2>
      {/* 这里放入月账单的图表组件或其他内容 */}
    </div>
  );
};

const Tab1 = () => <div>Content of Tab Pane 1</div>;
const Tab2 = () => <div>Content of Tab Pane 2</div>;

const tabItems = [
  {
    key: '1',
    label: 'Monthly Bill',
    children: <Tab1 />,
  },
  {
    key: '2',
    label: 'Yearly Bill',
    children: <Tab2 />,
  },
];

export const listData = [
  { category: 'hotel & travel', transactions: 2, amount: -5000 },
  { category: 'rent', transactions: 1, amount: -2000 },
  { category: 'shopping', transactions: 2, amount: -1500 },
];

function Home() {
  const { Title, Text } = Typography;

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const [reverse, setReverse] = useState(false);

  const [activeKey, setActiveKey] = useState('1');

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const totalAmount = listData.reduce(
    (acc, item) => acc + Math.abs(item.amount),
    0
  );

  const sortedData = listData.sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
  );

  const [chartType, setChartType] = useState('1');

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

  const dollor = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z"
        fill="#fff"
      ></path>
      <path
        d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z"
        fill="#fff"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z"
        fill="#fff"
      ></path>
    </svg>,
  ];

  const count = [
    {
      today: 'Total 8 expenses',
      title: '$53,00',
      persent: '+30%',
      icon: dollor,
      bnb: 'bnb2',
    },
  ];

  return (
    <>
      <div className="layout-content">
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onTabChange} />
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3} style={{ color: '#ed4242' }}>
                        {c.title}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Title level={3}>Expense Trend</Title>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Paragraph>Daily Average: $200</Paragraph>

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
                  {renderChart()}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Title level={3}>Expense Trend</Title>

              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
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
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Title
                              level={5}
                              style={{ margin: 0, marginRight: '10px' }}
                            >
                              {item.category}
                            </Title>
                            <Paragraph
                              style={{ margin: 0, marginRight: '10px' }}
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
      </div>
    </>
  );
}

export default Home;
