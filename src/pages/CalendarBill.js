import React, { useState } from 'react';

import { Card, Col, Row, Calendar, theme } from 'antd';


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
            <Card bordered={false} className="criclebox h-full">
              222
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CalendarBill;
