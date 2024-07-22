import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import {
  Card,
  Col,
  Row,
  Typography,
  Space,
  Button,
  Table,
  Carousel,
  Tabs,
  Select,
} from "antd";
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../context/GlobalProvider";
const generateOptions = (start, end, prefix = "") => {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const value = start + index;
    return { value: value.toString(), label: prefix + value };
  });
};
const months = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const years = generateOptions(2000, 2024, ""); // 生成2000到2024的年份数据\

const initialfinanceData = [
  {
    key: "1",
    category: "Shopping",
    amount: -300,
  },
  {
    key: "2",
    category: "Salary",
    amount: 4000,
  },
  {
    key: "3",
    category: "Taxi",
    amount: -50,
  },
];

function Home() {
  const initialColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <a onClick={() => handleEdit(record)}>Edit {record.name}</a>
          <a onClick={() => handleDelete(record)}>Delete</a>
        </div>
      ),
    },
  ];
  const isMounted = useRef(true);
  const { user, isLogged } = useGlobalContext();
  const [registrationYear, setRegistrationYear] = useState(2024);
  const [registrationMonth, setRegistrationMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [column, setColumn] = useState(initialColumns);
  const [financeData, setFinanceData] = useState(initialfinanceData);
  const [expense, setExpense] = useState(0);
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const { Title, Text } = Typography;

  const balance = income - expense;
  const remainingBudget = budget - expense;
  const count = [
    {
      today: "Monthly Income",
      title: "$".concat(income.toString()),
      color: "#28a745",
      info: `Expense $${expense.toLocaleString()} Balance: $${balance.toLocaleString()}`,
    },
    {
      today: "Monthly Expense",
      title: "$".concat(expense.toString()),
      bnb: "bnb2",
      color: "#ed4242",
      info: `Income: $${income.toLocaleString()} Balance: $${balance.toLocaleString()}`,
    },
  ];

  const budgetData = {
    today: "Remaining Monthly Budget",
    title: `$${remainingBudget.toLocaleString()}`,
    color: "#28a745",
    info: "Setting budget here",
  };

  const getMonthLabel = (monthValue) => {
    const month = months.find((m) => m.value === monthValue);
    return month ? month.label : "Invalid month value";
  };
  const label = getMonthLabel(month);
  const carouselRef = React.createRef();

  const onMonthSelectChange = (value) => {
    console.log(value);

    setMonth(value);
  };
  const onYearSelectChange = (value) => {
    console.log(value);

    setYear(value);
  };
  const handlePrev = () => {
    carouselRef.current.prev();
  };
  const handleNext = () => {
    carouselRef.current.next();
  };

  const handleEdit = (record) => {
    // 在这里处理编辑逻辑，例如显示一个编辑表单
    console.log("Editing:", record);
  };

  const handleDelete = (record) => {
    // 在这里处理删除逻辑，例如从数据中移除该记录
    console.log("Deleting:", record);
  };
  useEffect(() => {
    isMounted.current = true;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    //具体逻辑
    const updateData = async () => {
      if (month && year && registrationMonth && registrationYear) {
        if (currentYear < year || registrationYear > year) {
          if (isMounted.current) {
            setColumn([]);
            setFinanceData([]);
          }
        } else if (registrationMonth > month || currentMonth < month) {
          if (isMounted.current) {
            setColumn([]);
            setFinanceData([]);
          }
        } else {
          const selectedMonth = `${year}-${month}`;
          const formattedMonth = moment(selectedMonth).format("YYYY-MM");

          if (localStorage.getItem(formattedMonth)) {
            let item = localStorage.getItem(formattedMonth);
            //  let item = transactionItem.by_month[formattedMonth];
            let parsedItem = JSON.parse(item);
            console.log(item);

            if (isMounted.current) {
              setFinanceData(parsedItem.financeData);
              setIncome(parsedItem.income);
              setExpense(parsedItem.expense);
            }
          } else {
            if (isMounted.current) {
              setFinanceData([]);
              setExpense(0);
              setIncome(0);
            }
          }

          if (isMounted.current) {
            setColumn(initialColumns);
          }
        }
      }
    };
    updateData();

    return () => {
      isMounted.current = false; // Cleanup function to set isMounted to false when component is unmounted
    };
  }, [month, year, registrationMonth, registrationYear]);
  return (
    <>
      <div className="layout-content">
        <Space wrap className="space-container">
          <Select
            defaultValue="1"
            style={{ width: 70 }}
            onChange={onMonthSelectChange}
            options={months}
          />
          <Select
            defaultValue="2024"
            style={{ width: 80 }}
            onChange={onYearSelectChange}
            options={years}
          />
        </Space>
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
                        <div style={{ whiteSpace: "pre-line" }}>{c.info}</div>
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
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={6} xl={6}>
              <p>
                {label} Expense: {expense} Income: {income}
              </p>
            </Col>
            <Col xs={24} sm={24} md={16} lg={18} xl={18}>
              <Table
                className="card-uniform"
                columns={column}
                dataSource={financeData}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Home;
