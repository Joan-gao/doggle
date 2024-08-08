import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./";
dayjs.extend(customParseFormat);
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const Information = (userId) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const formatDate = (dateString) => {
    // Create a new Date object from the provided date string
    const date = new Date(dateString);

    // Get the year, month, and day from the Date object
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);

    // Combine the parts into the desired format
    return `${year}-${month}-${day}`;
  };
  const showModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    showModal();
  }, []);

  const handleSubmit = async (userData) => {
    const response = await axios.post(
      "http://127.0.0.1:5000/user/update",
      { userData: userData },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    console.log("Response:", response.data);
    if (response.data.status === "success") {
      history.push("/dashboard");
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    const date = formatDate(values.age._d);

    const userData = {
      gender: values.gender,
      birth_date: date,
      address: values.address,
      occupation: values.occupation,
      income_source: values.income,
      userId: userId.userId,
      goal: values.goal,
    };

    handleSubmit(userData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          label="Birth Date"
          name="age"
          rules={[
            {
              required: true,
              message: "Please select  date!",
            },
          ]}
        >
          <DatePicker
            minDate={dayjs("1950-01-01", dateFormat)}
            maxDate={dayjs("2099-01-01", dateFormat)}
          />
        </Form.Item>

        <Form.Item
          className="username"
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
              message: "Please select an option!",
            },
          ]}
        >
          <Select placeholder="Select an option">
            <Option value="female">Female</Option>
            <Option value="male">Male</Option>
            <Option value="n/a">Rather Not Say</Option>
          </Select>
        </Form.Item>

        <Form.Item
          className="username"
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please input your address!",
            },
          ]}
        >
          <Input placeholder="Pleaase enter your address" />
        </Form.Item>

        <Form.Item
          className="username"
          label="Income"
          name="income"
          rules={[
            {
              required: true,
              message: "Please select an option!",
            },
          ]}
        >
          <Select placeholder="Select an income source" mode="multiple">
            <Option value="salary">Salary</Option>
            <Option value="parentalSupport">Parental support</Option>
            <Option value="investmentIncome">Investment income</Option>
            <Option value="freelance">Freelance</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="username"
          label="Goal"
          name="goal"
          rules={[
            {
              required: true,
              message: "Please select an option!",
            },
          ]}
        >
          <Select placeholder="Select a recent goal">
            <Option value="none">None</Option>
            <Option value="saveMoney">Save money</Option>
            <Option value="selfImprovement">Self-improvement</Option>
            <Option value="buyHouse">Buy a house</Option>
            <Option value="travel">Travel</Option>
            <Option value="education">Education</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="username"
          label="Occupation"
          name="occupation"
          rules={[
            {
              required: true,
              message: "Please select an option!",
            },
          ]}
        >
          <Select placeholder="Select your identity">
            <Option value="student">Student</Option>
            <Option value="employee">Employee</Option>
            <Option value="unemployed">Unemployed</Option>
            <Option value="freelancer">Freelancer</Option>
            <Option value="retired">Retired</Option>
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
