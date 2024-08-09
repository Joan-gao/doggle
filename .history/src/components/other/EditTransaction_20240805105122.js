import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const Information = (userId) => {
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSubmit = (transactionData) => {
    fetch("http://127.0.0.1:5000/api/edit/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        transaction_id: transactionData.transaction_id,
        category_id: transactionData.category_id,
        amount: transactionData.amount, // 根据实际用户ID字段名称调整
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const transactionData = {
      transaction_id: values.gender,
      amout: values.gender,
      category_id: values.gender,
    };

    handleSubmit(transactionData);
  };
  return (
    <Modal
      open={open}
      title="Please enter your basic Info"
      onCancel={handleCancel}
      footer={
        [
          // <Button key="back" onClick={handleCancel}>
          //   Return
          // </Button>,
          // <Button
          //   key="submit"
          //   type="primary"
          //   loading={loading}
          //   onClick={handleOk}
          //   onSubmit={handleSubmit}
          // >
          //   Submit
          // </Button>,
        ]
      }
    >
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className="row-col"
      >
        <Form.Item
          className="username"
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the amount!",
            },
          ]}
        >
          <Input placeholder="Pleaase enter the amount" />
        </Form.Item>

        <Form.Item
          className="username"
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Please select an option!",
            },
          ]}
        >
          <Select placeholder="Select an category">
            <Option value="salary">Salary</Option>
            <Option value="parentalSupport">Parental support</Option>
            <Option value="investmentIncome">Investment income</Option>
            <Option value="freelance">Freelance</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Information;
