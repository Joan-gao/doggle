import React, { useState } from 'react';

import {
  Card,
  Col,
  Row,
  Typography,
  Space,
  Button,
  Table,
  Carousel,
} from 'antd';
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';

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

const years = generateOptions(2000, 2024, ''); // 生成2000到2024的年份数据\

const count = [
  {
    today: 'Monthly Income',
    title: '$53,000',
    color: '#28a745',
    info: 'Expense:$3000 Balance:$50,000',
  },
  {
    today: 'Monthly Expense',
    title: '$3,000',
    bnb: 'bnb2',
    color: '#ed4242',
    info: 'Income:$53,000 Balance:$50,000',
  },
];

const budgetData = {
  today: 'Remaining Monthly Budget',
  title: '$1000',
  color: '#28a745',
  info: 'Setting budget here',
};

const columns = [
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <a>Edit {record.name}</a>
        <a>Delete</a>
      </div>
    ),
  },
];

const financeData = [
  {
    key: '1',
    category: 'Shopping',
    amount: -300,
  },
  {
    key: '2',
    category: 'Salary',
    amount: 4000,
  },
  {
    key: '3',
    category: 'Taxi',
    amount: -50,
  },
];

function Home() {
  const { Title, Text } = Typography;
  const carouselRef = React.createRef();

  const handlePrev = () => {
    carouselRef.current.prev();
  };

  const handleNext = () => {
    carouselRef.current.next();
  };

  return (
    <>
      <div className="layout-content">
        <Carousel arrows infinite={false} autoplay>
          {count.map((c, index) => (
            <div key={index}>
              <div className="card-container">
                <Card bordered={false} className="criclebox card-uniform">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{c.today}</span>
                        <h3 style={{ color: c.color }}>{c.title}</h3>
                        <div style={{ whiteSpace: 'pre-line' }}>{c.info}</div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="card-container">
          <Card bordered={false} className="criclebox card-uniform">
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>{budgetData.today}</span>
                  <h3 style={{ color: budgetData.color }}>
                    {budgetData.title}
                  </h3>
                  <div>
                    <a href="">{budgetData.info}</a>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </div>

        <div className="card-container">
          <Table
            className=" card-uniform"
            columns={columns}
            dataSource={financeData}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
