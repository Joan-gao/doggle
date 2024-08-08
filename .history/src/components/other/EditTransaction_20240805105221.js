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
            <Option value="1">Salary</Option>
            <Option value="2">Parental support</Option>
            <Option value="3">Investment income</Option>
            <Option value="4">Freelance</Option>
            <Option value="5">Other</Option>
            <Option value="6">Salary</Option>
            <Option value="7">Parental support</Option>
            <Option value="8">Investment income</Option>
            <Option value="9">Freelance</Option>
            <Option value="10">Other</Option>
            <Option value="11">Salary</Option>
            <Option value="12">Parental support</Option>
            <Option value="13">Investment income</Option>
            <Option value="14">Freelance</Option>
            <Option value="15">Other</Option>
            <Option value="16">Salary</Option>
            <Option value="17">Parental support</Option>
            <Option value="18">Investment income</Option>
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
