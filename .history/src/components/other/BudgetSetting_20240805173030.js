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

const BudgetSetting = ({ user }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    showModal();
  }, []);
  const handleCancel = () => {
    setOpen(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSubmit = async (budgetData) => {
    fetch("http://127.0.0.1:5000/api/api/set-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        user:budgetData.user,
        amount: budgetData.amount, // 根据实际用户ID字段名称调整
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error setting Budget:", error);
      });
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const budgetData = {
      amount: values.amount,
      user: user
    };
    console.log("budgetData", budgetData);
   
      handleSubmit(budgetData);
    }
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
          label="Budget Amount"
          name="amount"
          rules={[
            {
              required: false,
              message: "Please input the amount!",
            },
          ]}
        >
          <Input placeholder="Pleaase enter the amount" />
        </Form.Item>

        {/* <Form.Item
          className="username"
          label="Category"
          name="category"
          rules={[
            {
              required: false,
              message: "Please select an option!",
            },
          ]}
        >
          <Select placeholder="Select an category">
            <Option value="1">Salary income</Option>
            <Option value="2">Bonus income</Option>
            <Option value="3">Investment Income income</Option>
            <Option value="4">Other Income income</Option>
            <Option value="5">Business income</Option>
            <Option value="6">Part-time Job income</Option>
            <Option value="7">Buying and Selling income</Option>
            <Option value="8">Housing expense</Option>
            <Option value="9">Food expense</Option>
            <Option value="10">Transportation expense</Option>
            <Option value="11">Entertainment expense</Option>
            <Option value="12">Utilities expense</Option>
            <Option value="13">Health expense</Option>
            <Option value="14">Insurance expense</Option>
            <Option value="15">Education expense</Option>
            <Option value="16">Other Expenses expense</Option>
            <Option value="17">Investment Expens expense</Option>
            <Option value="18">Shopping expense</Option>
            <Option value="19">Grocery expense</Option>
          </Select>
        </Form.Item> */}

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

export default BudgetSetting;
