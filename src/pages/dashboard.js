import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalProvider";

import {
  Card,
  Col,
  Row,
  Typography,
  Segmented,
  Progress,
  Space,
  Select,
  Empty,
} from "antd";

import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import DonutChart from "../components/chart/DonutChart";

import { Tabs } from "antd";

const { Title, Paragraph } = Typography;

export const listData = [
  { category: "hotel & travel", transactions: 2, amount: -5000 },
  { category: "rent", transactions: 1, amount: -2000 },
  { category: "shopping", transactions: 2, amount: -1500 },
];

const generateOptions = (start, end, prefix = "") => {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const value = start + index;
    return { value: value.toString(), label: prefix + value };
  });
};

const months = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

const years = generateOptions(2000, 2024, ""); // 生成2000到2024的年份数据

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

const expenseData = {
  monthly: {
    countData: {
      today: "Total 1 expenses",
      title: "$53,00",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$100",
    sortedData: [], // 你可以根据实际数据填充},
  },

  yearly: {
    countData: {
      today: "Total 8 expenses",
      title: "$100,000",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Yearly Trend",
    categoriesTitle: "Expense Yearly Categories",
    average: "$5000",
    sortedData: [], // 你可以根据实际数据填充
  },
};
const expenseDataFromdb = {
  Feb: {
    countData: {
      today: "Total 2 expenses",
      title: "$23,00",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$200",
    sortedData: [], // 你可以根据实际数据填充
  },
  Mar: {
    countData: {
      today: "Total 8 expenses",
      title: "$33,00",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "$300",
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: "Total 8 expenses",
      title: "$600,000",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Yearly Trend",
    categoriesTitle: "Expense Yearly Categories",
    average: "$5000",
    sortedData: [], // 你可以根据实际数据填充
  },
};

const incomeData = {
  monthly: {
    countData: {
      today: "Total 1 incomes",
      title: "$10,000",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$1000",
    sortedData: [], // 你可以根据实际数据填充
  },

  yearly: {
    countData: {
      today: "Total 8 incomes",
      title: "$360,000",
      persent: "+15%",
      color: "#28a745",
    },
    chartTitle: "Income Yearly Trend",
    categoriesTitle: "Income Yearly Categories",
    average: "$30000",
    sortedData: [], // 你可以根据实际数据填充
  },
};
const incomeDataFromdb = {
  Jan: {
    countData: {
      today: "Total 1 incomes",
      title: "$10,000",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$1000",
    sortedData: [], // 你可以根据实际数据填充
  },
  Feb: {
    countData: {
      today: "Total 2incomes",
      title: "$20,000",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$2000",
    sortedData: [], // 你可以根据实际数据填充
  },
  Mar: {
    countData: {
      today: "Total 3 incomes",
      title: "$30,000",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$3000",
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: "Total 10 incomes",
      title: "$560,000",
      persent: "+15%",
      color: "#28a745",
    },
    chartTitle: "Income Yearly Trend",
    categoriesTitle: "Income Yearly Categories",
    average: "$30000",
    sortedData: [], // 你可以根据实际数据填充
  },
};
const incomeEmptyData = {
  monthly: {
    countData: {
      today: "Total 0 incomes",
      title: "$0",
      persent: "+10%",
      color: "#28a745",
    },
    chartTitle: "Income Monthly Trend",
    categoriesTitle: "Income Monthly Categories",
    average: "$0",
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: "Total 0 incomes",
      title: "$0",
      persent: "+15%",
      color: "#28a745",
    },
    chartTitle: "Income Yearly Trend",
    categoriesTitle: "Income Yearly Categories",
    average: "$0",
    sortedData: [], // 你可以根据实际数据填充
  },
};

const expenseEmptyData = {
  monthly: {
    countData: {
      today: "Total 0 expenses",
      title: "$0",
      persent: "+30%",
      color: "#ed4242",
    },
    chartTitle: "Expense Monthly Trend",
    categoriesTitle: "Expense Monthly Categories",
    average: "",
    sortedData: [], // 你可以根据实际数据填充
  },
  yearly: {
    countData: {
      today: "Total 0 expenses",
      title: "$0",
      persent: "+20%",
      color: "#ed4242",
    },
    chartTitle: "Expense Yearly Trend",
    categoriesTitle: "Expense Yearly Categories",
    average: "$0",
    sortedData: [], // 你可以根据实际数据填充
  },
};
// 选择月份和年份，如果是monthly bill显示月份年份，yearly bill只显示年份

const SelectBar = ({ isMonthly, onMonthChange, onYearChange }) => (
  <Space wrap>
    {isMonthly && (
      <Select
        defaultValue="Jan"
        style={{ width: 70 }}
        onChange={onMonthChange}
        options={months}
      />
    )}
    <Select
      defaultValue="2024"
      style={{ width: 80 }}
      onChange={onYearChange}
      options={years}
    />
  </Space>
);

function Dashboard() {
  const { user, isLogged } = useGlobalContext();
  const { Title, Text } = Typography;
  const [activeKey, setActiveKey] = useState("1");
  const [currentType, setCurrentType] = useState("expense");
  const [chartType, setChartType] = useState("1");
  const [registrationYear, setRegistrationYear] = useState(2024);
  const [registrationMonth, setRegistrationMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [showProgress, setShowProgress] = useState(false);
  const [incomeDataState, setIncomeDataState] = useState(incomeData);
  const [expenseDataState, setExpenseDataState] = useState(expenseData);
  const [data, setData] = useState(
    currentType === "expense" ? expenseData : incomeData
  );

  useEffect(() => {
    console.log("user", user);
  }, []);
  const getMonthLabel = (monthValue) => {
    const month = months.find((m) => m.value === monthValue);
    return month ? month.label : "Invalid month value";
  };
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`/api/data`, {
  //       params: {
  //         type: currentType,
  //         month: activeKey === "1" ? month : null,
  //         year,
  //       },
  //     });
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const monthLabel = getMonthLabel(month);

    // 调用后端查询用户的注册日期，然后根据用户的注册日期判断选择的月份年份是否是有效的，如果是无效的，则直接都为空不进一步向后端请求数据
    if (month && year && registrationMonth && registrationYear) {
      if (activeKey === "2") {
        if (currentYear < year || registrationYear > year) {
          setShowProgress(false);
          if (currentType === "expense") {
            setExpenseDataState(expenseEmptyData);
          } else {
            setIncomeDataState(incomeEmptyData);
          }
        } else {
          setShowProgress(true);
          if (currentType === "expense") {
            setExpenseDataState(expenseDataFromdb.yearly);
          } else {
            setIncomeDataState(incomeDataFromdb.yearly);
          }
        }
      } else if (activeKey === "1") {
        if (currentYear < year || registrationYear > year) {
          setShowProgress(false);
          if (currentType === "expense") {
            setExpenseDataState(expenseEmptyData);
          } else {
            setIncomeDataState(incomeEmptyData);
          }
        } else if (registrationMonth > month || currentMonth < month) {
          setShowProgress(false);
          if (currentType === "expense") {
            setExpenseDataState(expenseEmptyData);
          } else {
            setIncomeDataState(incomeEmptyData);
          }
        } else {
          setShowProgress(true);
          if (monthLabel) {
            if (currentType === "expense") {
              setExpenseDataState({
                ...expenseDataState,
                monthly:
                  expenseDataFromdb[monthLabel] || expenseEmptyData.monthly,
              });
            } else {
              setIncomeDataState({
                ...incomeDataState,
                monthly:
                  incomeDataFromdb[monthLabel] || incomeEmptyData.monthly,
              });
            }
          } else {
            if (currentType === "expense") {
              setExpenseDataState(expenseEmptyData);
            } else {
              setIncomeDataState(incomeEmptyData);
            }
          }
        }
      }
    }
  }, [
    currentType,
    month,
    year,
    activeKey,
    registrationMonth,
    registrationYear,
    incomeDataFromdb,
    expenseDataFromdb,
  ]);
  const displayData =
    currentType === "expense"
      ? activeKey === "1"
        ? expenseDataState?.monthly
        : expenseDataState.yearly
      : activeKey === "1"
      ? incomeDataState?.monthly
      : incomeDataState.yearly;
  const totalAmount = listData.reduce(
    (acc, item) => acc + Math.abs(item.amount),
    0
  );

  const sortedData = listData.sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
  );

  const onTabChange = (key) => {
    setActiveKey(key);
  };
  //原来的年份月份选择
  const onSelectChange = (value) => {
    console.log(value);
  };

  const onTypeChange = (value) => {
    setCurrentType(value);
  };

  const onSegmentChange = (value) => {
    setChartType(value);
  };
  const handleMonthChange = (value) => {
    setMonth(value);
  };

  const handleYearChange = (value) => {
    setYear(value);
  };
  const renderChart = () => {
    if (chartType === "1") {
      return <Echart type={currentType} activeKey={activeKey} />;
    }
    if (chartType === "2") {
      return <LineChart type={currentType} activeKey={activeKey} />;
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Paragraph>Daily Average: {data.average}</Paragraph>
              <Segmented
                options={[
                  { label: "Bar", value: "1" },
                  { label: "Line", value: "2" },
                ]}
                defaultValue="1"
                onChange={onSegmentChange}
                style={{ marginBottom: 8 }}
              />
            </div>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                {/* 使用你的 renderChart 方法渲染图表 */}
                {renderChart("1")}
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
                <DonutChart
                  type={currentType}
                  month={month}
                  year={year}
                  registrationMonth={registrationMonth}
                  registrationYear={registrationYear}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {showProgress &&
                    sortedData.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Title
                              level={5}
                              style={{ margin: 0, marginRight: "10px" }}
                            >
                              {item.category}
                            </Title>
                            <Paragraph
                              style={{ margin: 0, marginRight: "10px" }}
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
        style={{ marginBottom: "10px" }}
      >
        <Col>
          <SelectBar
            isMonthly={activeKey === "1"}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
        </Col>
        <Col>
          <Segmented
            options={[
              { label: "Exp", value: "expense" },
              { label: "Inc", value: "income" },
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
