import React, { useState } from 'react';

import { Card, Col, Row, Calendar, theme, Table } from 'antd';

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

const CalendarBill = () => {
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="responsive-calendar">
                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <div className="card-container">
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                  <p>18-07 Thu Expense: 500 Income: 300</p>
                </Col>
                <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                  <Table
                    className="card-uniform"
                    columns={columns}
                    dataSource={financeData}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CalendarBill;
