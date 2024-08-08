import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { Card, Col, Row, Calendar, theme, Table } from "antd";
import { useStore, useAuth } from "../context/UserAuth";

import moment from "moment";
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
const initialFinanceData = [
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

const CalendarBill = () => {
  const isMounted = useRef(true);
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

  // const transactionItem = {
  //   by_date: {
  //     "2024-01-01": {
  //       expense: "712.00",
  //       financeData: [
  //         {
  //           amount: "-712.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 1,
  //           transaction_id: 1,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-04": {
  //       expense: "80.86",
  //       financeData: [
  //         {
  //           amount: "-80.86",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 2,
  //           transaction_id: 2,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-06": {
  //       expense: "42.28",
  //       financeData: [
  //         {
  //           amount: "-35.79",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 3,
  //           transaction_id: 3,
  //         },
  //         {
  //           amount: "-6.49",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 4,
  //           transaction_id: 4,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-10": {
  //       expense: "29.99",
  //       financeData: [
  //         {
  //           amount: "-29.99",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 5,
  //           transaction_id: 5,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-12": {
  //       expense: "752.01",
  //       financeData: [
  //         {
  //           amount: "-20.01",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 6,
  //           transaction_id: 6,
  //         },
  //         {
  //           amount: "-732.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 7,
  //           transaction_id: 7,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-18": {
  //       expense: "1400.00",
  //       financeData: [
  //         {
  //           amount: "-1400.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 8,
  //           transaction_id: 8,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-25": {
  //       expense: "35.79",
  //       financeData: [
  //         {
  //           amount: "-35.79",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 9,
  //           transaction_id: 9,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-01-30": {
  //       expense: "34.60",
  //       financeData: [
  //         {
  //           amount: "-33.59",
  //           category: "Education",
  //           category_id: 15,
  //           key: 10,
  //           transaction_id: 10,
  //         },
  //         {
  //           amount: "-1.01",
  //           category: "Insurance",
  //           category_id: 14,
  //           key: 11,
  //           transaction_id: 11,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-06": {
  //       expense: "6.49",
  //       financeData: [
  //         {
  //           amount: "-6.49",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 12,
  //           transaction_id: 12,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-08": {
  //       expense: "216.00",
  //       financeData: [
  //         {
  //           amount: "-165.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 13,
  //           transaction_id: 13,
  //         },
  //         {
  //           amount: "-51.00",
  //           category: "Food",
  //           category_id: 9,
  //           key: 14,
  //           transaction_id: 14,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-09": {
  //       expense: "93.86",
  //       financeData: [
  //         {
  //           amount: "-34.69",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 15,
  //           transaction_id: 15,
  //         },
  //         {
  //           amount: "-20.00",
  //           category: "Education",
  //           category_id: 15,
  //           key: 16,
  //           transaction_id: 16,
  //         },
  //         {
  //           amount: "-39.17",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 17,
  //           transaction_id: 17,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-10": {
  //       expense: "330.84",
  //       financeData: [
  //         {
  //           amount: "-16.90",
  //           category: "Food",
  //           category_id: 9,
  //           key: 18,
  //           transaction_id: 18,
  //         },
  //         {
  //           amount: "-59.65",
  //           category: "Health",
  //           category_id: 13,
  //           key: 19,
  //           transaction_id: 19,
  //         },
  //         {
  //           amount: "-3.05",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 20,
  //           transaction_id: 20,
  //         },
  //         {
  //           amount: "-28.28",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 21,
  //           transaction_id: 21,
  //         },
  //         {
  //           amount: "-158.23",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 22,
  //           transaction_id: 22,
  //         },
  //         {
  //           amount: "-59.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 23,
  //           transaction_id: 23,
  //         },
  //         {
  //           amount: "-5.73",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 24,
  //           transaction_id: 24,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-13": {
  //       expense: "76.74",
  //       financeData: [
  //         {
  //           amount: "-45.76",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 25,
  //           transaction_id: 25,
  //         },
  //         {
  //           amount: "-3.20",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 26,
  //           transaction_id: 26,
  //         },
  //         {
  //           amount: "-27.78",
  //           category: "Food",
  //           category_id: 9,
  //           key: 27,
  //           transaction_id: 27,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-14": {
  //       expense: "597.90",
  //       financeData: [
  //         {
  //           amount: "-338.00",
  //           category: "Health",
  //           category_id: 13,
  //           key: 28,
  //           transaction_id: 28,
  //         },
  //         {
  //           amount: "-169.00",
  //           category: "Health",
  //           category_id: 13,
  //           key: 29,
  //           transaction_id: 29,
  //         },
  //         {
  //           amount: "-90.90",
  //           category: "Health",
  //           category_id: 13,
  //           key: 30,
  //           transaction_id: 30,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-15": {
  //       expense: "33.30",
  //       financeData: [
  //         {
  //           amount: "-33.30",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 31,
  //           transaction_id: 31,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-16": {
  //       expense: "-24.65",
  //       financeData: [
  //         {
  //           amount: "-14.30",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 32,
  //           transaction_id: 32,
  //         },
  //         {
  //           amount: "-21.55",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 33,
  //           transaction_id: 33,
  //         },
  //         {
  //           amount: "--60.50",
  //           category: "Food",
  //           category_id: 9,
  //           key: 34,
  //           transaction_id: 34,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-17": {
  //       expense: "115.53",
  //       financeData: [
  //         {
  //           amount: "-1.20",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 35,
  //           transaction_id: 35,
  //         },
  //         {
  //           amount: "-10.39",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 36,
  //           transaction_id: 36,
  //         },
  //         {
  //           amount: "-2.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 37,
  //           transaction_id: 37,
  //         },
  //         {
  //           amount: "-101.94",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 38,
  //           transaction_id: 38,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-20": {
  //       expense: "92.52",
  //       financeData: [
  //         {
  //           amount: "-7.42",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 39,
  //           transaction_id: 39,
  //         },
  //         {
  //           amount: "-28.32",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 40,
  //           transaction_id: 40,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 41,
  //           transaction_id: 41,
  //         },
  //         {
  //           amount: "-3.20",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 42,
  //           transaction_id: 42,
  //         },
  //         {
  //           amount: "-35.60",
  //           category: "Food",
  //           category_id: 9,
  //           key: 43,
  //           transaction_id: 43,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 44,
  //           transaction_id: 44,
  //         },
  //         {
  //           amount: "-13.50",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 45,
  //           transaction_id: 45,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-21": {
  //       expense: "801.42",
  //       financeData: [
  //         {
  //           amount: "-676.00",
  //           category: "Health",
  //           category_id: 13,
  //           key: 46,
  //           transaction_id: 46,
  //         },
  //         {
  //           amount: "-121.12",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 47,
  //           transaction_id: 47,
  //         },
  //         {
  //           amount: "-4.30",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 48,
  //           transaction_id: 48,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-22": {
  //       expense: "56.21",
  //       financeData: [
  //         {
  //           amount: "-56.21",
  //           category: "Education",
  //           category_id: 15,
  //           key: 49,
  //           transaction_id: 49,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02-23": {
  //       expense: "113.24",
  //       financeData: [
  //         {
  //           amount: "-77.30",
  //           category: "Health",
  //           category_id: 13,
  //           key: 50,
  //           transaction_id: 50,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 51,
  //           transaction_id: 51,
  //         },
  //         {
  //           amount: "-16.50",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 52,
  //           transaction_id: 52,
  //         },
  //         {
  //           amount: "-17.20",
  //           category: "Food",
  //           category_id: 9,
  //           key: 53,
  //           transaction_id: 53,
  //         },
  //         {
  //           amount: "500.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 54,
  //           transaction_id: 54,
  //         },
  //         {
  //           amount: "1000.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 55,
  //           transaction_id: 55,
  //         },
  //       ],
  //       income: "1500.00",
  //     },
  //     "2024-02-24": {
  //       expense: 0,
  //       financeData: [
  //         {
  //           amount: "9700.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 56,
  //           transaction_id: 56,
  //         },
  //       ],
  //       income: "9700.00",
  //     },
  //     "2024-02-27": {
  //       expense: "3007.53",
  //       financeData: [
  //         {
  //           amount: "-2935.60",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 57,
  //           transaction_id: 57,
  //         },
  //         {
  //           amount: "-19.20",
  //           category: "Food",
  //           category_id: 9,
  //           key: 58,
  //           transaction_id: 58,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 59,
  //           transaction_id: 59,
  //         },
  //         {
  //           amount: "-33.64",
  //           category: "Education",
  //           category_id: 15,
  //           key: 60,
  //           transaction_id: 60,
  //         },
  //         {
  //           amount: "-1.01",
  //           category: "Education",
  //           category_id: 15,
  //           key: 61,
  //           transaction_id: 61,
  //         },
  //         {
  //           amount: "-4.80",
  //           category: "Food",
  //           category_id: 9,
  //           key: 62,
  //           transaction_id: 62,
  //         },
  //         {
  //           amount: "-3.99",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 63,
  //           transaction_id: 63,
  //         },
  //         {
  //           amount: "-7.05",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 64,
  //           transaction_id: 64,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-07-01": {
  //       expense: "542.00",
  //       financeData: [
  //         {
  //           amount: "-542.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 86,
  //           transaction_id: 100,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-07-05": {
  //       expense: "320.87",
  //       financeData: [
  //         {
  //           amount: "-320.87",
  //           category: "Insurance",
  //           category_id: 14,
  //           key: 87,
  //           transaction_id: 104,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-07-09": {
  //       expense: 0,
  //       financeData: [
  //         {
  //           amount: "855.00",
  //           category: "Buying and Selling",
  //           category_id: 7,
  //           key: 88,
  //           transaction_id: 108,
  //         },
  //       ],
  //       income: "855.00",
  //     },
  //     "2024-07-13": {
  //       expense: "215.60",
  //       financeData: [
  //         {
  //           amount: "-215.60",
  //           category: "Education",
  //           category_id: 15,
  //           key: 89,
  //           transaction_id: 112,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-07-17": {
  //       expense: 0,
  //       financeData: [
  //         {
  //           amount: "505.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 90,
  //           transaction_id: 116,
  //         },
  //       ],
  //       income: "505.00",
  //     },
  //     "2024-07-21": {
  //       expense: 0,
  //       financeData: [
  //         {
  //           amount: "430.00",
  //           category: "Investment Income",
  //           category_id: 3,
  //           key: 91,
  //           transaction_id: 120,
  //         },
  //       ],
  //       income: "430.00",
  //     },
  //     "2024-07-25": {
  //       expense: "140.50",
  //       financeData: [
  //         {
  //           amount: "-140.50",
  //           category: "Food",
  //           category_id: 9,
  //           key: 92,
  //           transaction_id: 124,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-07-29": {
  //       expense: "110.00",
  //       financeData: [
  //         {
  //           amount: "-110.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 93,
  //           transaction_id: 128,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-08-08": {
  //       expense: "15.25",
  //       financeData: [
  //         {
  //           amount: "-15.25",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 65,
  //           transaction_id: 79,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-09-18": {
  //       expense: "135.59",
  //       financeData: [
  //         {
  //           amount: "-13.08",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 66,
  //           transaction_id: 80,
  //         },
  //         {
  //           amount: "-18.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 67,
  //           transaction_id: 81,
  //         },
  //         {
  //           amount: "-26.10",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 68,
  //           transaction_id: 82,
  //         },
  //         {
  //           amount: "-29.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 69,
  //           transaction_id: 83,
  //         },
  //         {
  //           amount: "-30.01",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 70,
  //           transaction_id: 84,
  //         },
  //         {
  //           amount: "-19.40",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 71,
  //           transaction_id: 85,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-09-22": {
  //       expense: "20.00",
  //       financeData: [
  //         {
  //           amount: "-20.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 72,
  //           transaction_id: 86,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-09-25": {
  //       expense: "81.72",
  //       financeData: [
  //         {
  //           amount: "500.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 73,
  //           transaction_id: 87,
  //         },
  //         {
  //           amount: "-14.02",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 74,
  //           transaction_id: 88,
  //         },
  //         {
  //           amount: "-15.73",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 75,
  //           transaction_id: 89,
  //         },
  //         {
  //           amount: "-20.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 76,
  //           transaction_id: 90,
  //         },
  //         {
  //           amount: "-28.44",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 77,
  //           transaction_id: 91,
  //         },
  //         {
  //           amount: "-3.53",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 78,
  //           transaction_id: 92,
  //         },
  //       ],
  //       income: "500.00",
  //     },
  //     "2024-09-26": {
  //       expense: "30.61",
  //       financeData: [
  //         {
  //           amount: "-17.50",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 79,
  //           transaction_id: 93,
  //         },
  //         {
  //           amount: "-13.11",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 80,
  //           transaction_id: 94,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-09-27": {
  //       expense: "120.53",
  //       financeData: [
  //         {
  //           amount: "-39.38",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 81,
  //           transaction_id: 95,
  //         },
  //         {
  //           amount: "-61.92",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 82,
  //           transaction_id: 96,
  //         },
  //         {
  //           amount: "-8.53",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 83,
  //           transaction_id: 97,
  //         },
  //         {
  //           amount: "-10.70",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 84,
  //           transaction_id: 98,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-09-28": {
  //       expense: "5.44",
  //       financeData: [
  //         {
  //           amount: "-5.44",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 85,
  //           transaction_id: 99,
  //         },
  //       ],
  //       income: 0,
  //     },
  //   },
  //   by_month: {
  //     "2024-01": {
  //       expense: "3087.53",
  //       financeData: [
  //         {
  //           amount: "-712.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 1,
  //           transaction_id: 1,
  //         },
  //         {
  //           amount: "-80.86",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 2,
  //           transaction_id: 2,
  //         },
  //         {
  //           amount: "-35.79",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 3,
  //           transaction_id: 3,
  //         },
  //         {
  //           amount: "-6.49",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 4,
  //           transaction_id: 4,
  //         },
  //         {
  //           amount: "-29.99",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 5,
  //           transaction_id: 5,
  //         },
  //         {
  //           amount: "-20.01",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 6,
  //           transaction_id: 6,
  //         },
  //         {
  //           amount: "-732.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 7,
  //           transaction_id: 7,
  //         },
  //         {
  //           amount: "-1400.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 8,
  //           transaction_id: 8,
  //         },
  //         {
  //           amount: "-35.79",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 9,
  //           transaction_id: 9,
  //         },
  //         {
  //           amount: "-33.59",
  //           category: "Education",
  //           category_id: 15,
  //           key: 10,
  //           transaction_id: 10,
  //         },
  //         {
  //           amount: "-1.01",
  //           category: "Insurance",
  //           category_id: 14,
  //           key: 11,
  //           transaction_id: 11,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-02": {
  //       expense: "5516.93",
  //       financeData: [
  //         {
  //           amount: "-6.49",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 12,
  //           transaction_id: 12,
  //         },
  //         {
  //           amount: "-165.00",
  //           category: "Housing",
  //           category_id: 8,
  //           key: 13,
  //           transaction_id: 13,
  //         },
  //         {
  //           amount: "-51.00",
  //           category: "Food",
  //           category_id: 9,
  //           key: 14,
  //           transaction_id: 14,
  //         },
  //         {
  //           amount: "-34.69",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 15,
  //           transaction_id: 15,
  //         },
  //         {
  //           amount: "-20.00",
  //           category: "Education",
  //           category_id: 15,
  //           key: 16,
  //           transaction_id: 16,
  //         },
  //         {
  //           amount: "-39.17",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 17,
  //           transaction_id: 17,
  //         },
  //         {
  //           amount: "-16.90",
  //           category: "Food",
  //           category_id: 9,
  //           key: 18,
  //           transaction_id: 18,
  //         },
  //         {
  //           amount: "-59.65",
  //           category: "Health",
  //           category_id: 13,
  //           key: 19,
  //           transaction_id: 19,
  //         },
  //         {
  //           amount: "-3.05",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 20,
  //           transaction_id: 20,
  //         },
  //         {
  //           amount: "-28.28",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 21,
  //           transaction_id: 21,
  //         },
  //         {
  //           amount: "-158.23",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 22,
  //           transaction_id: 22,
  //         },
  //         {
  //           amount: "-59.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 23,
  //           transaction_id: 23,
  //         },
  //         {
  //           amount: "-5.73",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 24,
  //           transaction_id: 24,
  //         },
  //         {
  //           amount: "-45.76",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 25,
  //           transaction_id: 25,
  //         },
  //         {
  //           amount: "-3.20",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 26,
  //           transaction_id: 26,
  //         },
  //         {
  //           amount: "-27.78",
  //           category: "Food",
  //           category_id: 9,
  //           key: 27,
  //           transaction_id: 27,
  //         },
  //         {
  //           amount: "-338.00",
  //           category: "Health",
  //           category_id: 13,
  //           key: 28,
  //           transaction_id: 28,
  //         },
  //         {
  //           amount: "-169.00",
  //           category: "Health",
  //           category_id: 13,
  //           key: 29,
  //           transaction_id: 29,
  //         },
  //         {
  //           amount: "-90.90",
  //           category: "Health",
  //           category_id: 13,
  //           key: 30,
  //           transaction_id: 30,
  //         },
  //         {
  //           amount: "-33.30",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 31,
  //           transaction_id: 31,
  //         },
  //         {
  //           amount: "-14.30",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 32,
  //           transaction_id: 32,
  //         },
  //         {
  //           amount: "-21.55",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 33,
  //           transaction_id: 33,
  //         },
  //         {
  //           amount: "--60.50",
  //           category: "Food",
  //           category_id: 9,
  //           key: 34,
  //           transaction_id: 34,
  //         },
  //         {
  //           amount: "-1.20",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 35,
  //           transaction_id: 35,
  //         },
  //         {
  //           amount: "-10.39",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 36,
  //           transaction_id: 36,
  //         },
  //         {
  //           amount: "-2.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 37,
  //           transaction_id: 37,
  //         },
  //         {
  //           amount: "-101.94",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 38,
  //           transaction_id: 38,
  //         },
  //         {
  //           amount: "-7.42",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 39,
  //           transaction_id: 39,
  //         },
  //         {
  //           amount: "-28.32",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 40,
  //           transaction_id: 40,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 41,
  //           transaction_id: 41,
  //         },
  //         {
  //           amount: "-3.20",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 42,
  //           transaction_id: 42,
  //         },
  //         {
  //           amount: "-35.60",
  //           category: "Food",
  //           category_id: 9,
  //           key: 43,
  //           transaction_id: 43,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 44,
  //           transaction_id: 44,
  //         },
  //         {
  //           amount: "-13.50",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 45,
  //           transaction_id: 45,
  //         },
  //         {
  //           amount: "-676.00",
  //           category: "Health",
  //           category_id: 13,
  //           key: 46,
  //           transaction_id: 46,
  //         },
  //         {
  //           amount: "-121.12",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 47,
  //           transaction_id: 47,
  //         },
  //         {
  //           amount: "-4.30",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 48,
  //           transaction_id: 48,
  //         },
  //         {
  //           amount: "-56.21",
  //           category: "Education",
  //           category_id: 15,
  //           key: 49,
  //           transaction_id: 49,
  //         },
  //         {
  //           amount: "-77.30",
  //           category: "Health",
  //           category_id: 13,
  //           key: 50,
  //           transaction_id: 50,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 51,
  //           transaction_id: 51,
  //         },
  //         {
  //           amount: "-16.50",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 52,
  //           transaction_id: 52,
  //         },
  //         {
  //           amount: "-17.20",
  //           category: "Food",
  //           category_id: 9,
  //           key: 53,
  //           transaction_id: 53,
  //         },
  //         {
  //           amount: "500.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 54,
  //           transaction_id: 54,
  //         },
  //         {
  //           amount: "1000.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 55,
  //           transaction_id: 55,
  //         },
  //         {
  //           amount: "9700.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 56,
  //           transaction_id: 56,
  //         },
  //         {
  //           amount: "-2935.60",
  //           category: "Entertainment",
  //           category_id: 11,
  //           key: 57,
  //           transaction_id: 57,
  //         },
  //         {
  //           amount: "-19.20",
  //           category: "Food",
  //           category_id: 9,
  //           key: 58,
  //           transaction_id: 58,
  //         },
  //         {
  //           amount: "-2.24",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 59,
  //           transaction_id: 59,
  //         },
  //         {
  //           amount: "-33.64",
  //           category: "Education",
  //           category_id: 15,
  //           key: 60,
  //           transaction_id: 60,
  //         },
  //         {
  //           amount: "-1.01",
  //           category: "Education",
  //           category_id: 15,
  //           key: 61,
  //           transaction_id: 61,
  //         },
  //         {
  //           amount: "-4.80",
  //           category: "Food",
  //           category_id: 9,
  //           key: 62,
  //           transaction_id: 62,
  //         },
  //         {
  //           amount: "-3.99",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 63,
  //           transaction_id: 63,
  //         },
  //         {
  //           amount: "-7.05",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 64,
  //           transaction_id: 64,
  //         },
  //       ],
  //       income: "11200.00",
  //     },
  //     "2024-07": {
  //       expense: "1328.97",
  //       financeData: [
  //         {
  //           amount: "-542.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 86,
  //           transaction_id: 100,
  //         },
  //         {
  //           amount: "-320.87",
  //           category: "Insurance",
  //           category_id: 14,
  //           key: 87,
  //           transaction_id: 104,
  //         },
  //         {
  //           amount: "855.00",
  //           category: "Buying and Selling",
  //           category_id: 7,
  //           key: 88,
  //           transaction_id: 108,
  //         },
  //         {
  //           amount: "-215.60",
  //           category: "Education",
  //           category_id: 15,
  //           key: 89,
  //           transaction_id: 112,
  //         },
  //         {
  //           amount: "505.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 90,
  //           transaction_id: 116,
  //         },
  //         {
  //           amount: "430.00",
  //           category: "Investment Income",
  //           category_id: 3,
  //           key: 91,
  //           transaction_id: 120,
  //         },
  //         {
  //           amount: "-140.50",
  //           category: "Food",
  //           category_id: 9,
  //           key: 92,
  //           transaction_id: 124,
  //         },
  //         {
  //           amount: "-110.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 93,
  //           transaction_id: 128,
  //         },
  //       ],
  //       income: "1790.00",
  //     },
  //     "2024-08": {
  //       expense: "15.25",
  //       financeData: [
  //         {
  //           amount: "-15.25",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 65,
  //           transaction_id: 79,
  //         },
  //       ],
  //       income: 0,
  //     },
  //     "2024-09": {
  //       expense: "393.89",
  //       financeData: [
  //         {
  //           amount: "-13.08",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 66,
  //           transaction_id: 80,
  //         },
  //         {
  //           amount: "-18.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 67,
  //           transaction_id: 81,
  //         },
  //         {
  //           amount: "-26.10",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 68,
  //           transaction_id: 82,
  //         },
  //         {
  //           amount: "-29.00",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 69,
  //           transaction_id: 83,
  //         },
  //         {
  //           amount: "-30.01",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 70,
  //           transaction_id: 84,
  //         },
  //         {
  //           amount: "-19.40",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 71,
  //           transaction_id: 85,
  //         },
  //         {
  //           amount: "-20.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 72,
  //           transaction_id: 86,
  //         },
  //         {
  //           amount: "500.00",
  //           category: "Business",
  //           category_id: 5,
  //           key: 73,
  //           transaction_id: 87,
  //         },
  //         {
  //           amount: "-14.02",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 74,
  //           transaction_id: 88,
  //         },
  //         {
  //           amount: "-15.73",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 75,
  //           transaction_id: 89,
  //         },
  //         {
  //           amount: "-20.00",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 76,
  //           transaction_id: 90,
  //         },
  //         {
  //           amount: "-28.44",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 77,
  //           transaction_id: 91,
  //         },
  //         {
  //           amount: "-3.53",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 78,
  //           transaction_id: 92,
  //         },
  //         {
  //           amount: "-17.50",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 79,
  //           transaction_id: 93,
  //         },
  //         {
  //           amount: "-13.11",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 80,
  //           transaction_id: 94,
  //         },
  //         {
  //           amount: "-39.38",
  //           category: "Grocery",
  //           category_id: 19,
  //           key: 81,
  //           transaction_id: 95,
  //         },
  //         {
  //           amount: "-61.92",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 82,
  //           transaction_id: 96,
  //         },
  //         {
  //           amount: "-8.53",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 83,
  //           transaction_id: 97,
  //         },
  //         {
  //           amount: "-10.70",
  //           category: "Shopping",
  //           category_id: 18,
  //           key: 84,
  //           transaction_id: 98,
  //         },
  //         {
  //           amount: "-5.44",
  //           category: "Transportation",
  //           category_id: 10,
  //           key: 85,
  //           transaction_id: 99,
  //         },
  //       ],
  //       income: "500.00",
  //     },
  //   },
  // };
  // const { user, isLogged } = useGlobalContext();
  const [registrationYear, setRegistrationYear] = useState(2024);
  const [registrationMonth, setRegistrationMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [weekday, setWeekday] = useState("Monday");
  const [currentMode, setCurrentMode] = useState("month");
  const [day, setDay] = useState("18-7");
  const [column, setColumn] = useState(initialColumns);
  const [financeData, setFinanceData] = useState(initialFinanceData);
  const [currentUser, setCurrentUser] = useState(null);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [transactionItem, setTransactionItem] = useState(null);
  const [userloaded, setUserLoaded] = useState(false);
  useAuth();
  const { user, loading } = useStore();
  // 确保在更新 `transactionItem` 时创建新的对象引用
  const updateTransactionItem = (data) => {
    setTransactionItem((prev) => ({ ...prev, ...data }));
  };
  const getMonthLabel = (monthValue) => {
    const month = months.find((m) => m.value === monthValue);
    return month ? month.label : "Invalid month value";
  };
  const label = getMonthLabel(month);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回值是 0-11，需要加 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const storeTransactionData = (data) => {
    // Store by_date data
    for (let date in data.by_date) {
      localStorage.setItem(`${date}`, JSON.stringify(data.by_date[date]));
    }

    // Store by_month data
    for (let month in data.by_month) {
      localStorage.setItem(`${month}`, JSON.stringify(data.by_month[month]));
    }
  };

  const handleEdit = (record) => {
    // 在这里处理编辑逻辑，例如显示一个编辑表单
    fetch("http://127.0.0.1:5000/api/edit/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        user: currentUser, // 根据实际用户ID字段名称调整
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        updateTransactionItem(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
    console.log("Editing:", record);
  };

  const handleDelete = (record) => {
    fetch("http://127.0.0.1:5000/api/delete/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        user: currentUser, // 根据实际用户ID字段名称调整
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        updateTransactionItem(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
    console.log("Deleting:", record);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !userloaded) {
        const createdAt = user.user.created_at;

        const createdyear = parseInt(createdAt.substring(0, 4), 10);
        const createdmonth = parseInt(createdAt.substring(5, 7), 10);

        setRegistrationYear(createdyear);
        setRegistrationMonth(createdmonth);
        setCurrentUser(user);
        setUserLoaded(true); // Indicate that user data is loaded
        clearInterval(interval); // Stop polling once user data is loaded
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentUser, userloaded, user]);
  useEffect(() => {
    if (userloaded) {
      fetch("http://127.0.0.1:5000/fetch/all-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          user: currentUser, // 根据实际用户ID字段名称调整
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          updateTransactionItem(data);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        });
    }
  }, [userloaded, currentUser]);

  useEffect(() => {
    isMounted.current = true;
    console.log(userloaded);
    const updateData = () => {
      console.log(transactionItem);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (currentYear < year || registrationYear > year) {
        console.log(year);
        if (isMounted.current) {
          setColumn([]);
          setFinanceData([]);
          setExpense(0);
          setIncome(0);
        }
      } else if (registrationMonth > month || currentMonth < month) {
        if (isMounted.current) {
          setColumn([]);
          setFinanceData([]);
          setExpense(0);
          setIncome(0);
        }
      } else {
        const dayPart = day.split("-")[0];

        if (currentMode === "month") {
          // if (userloaded) {
          const selectedDate = `${year}-${month}-${dayPart}`;
          const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

          if (transactionItem.by_date[formattedDate]) {
            // let item = localStorage.getItem(formattedDate);
            let item = transactionItem.by_date[formattedDate];

            //   let parsedItem = JSON.parse(item);

            if (isMounted.current) {
              setFinanceData(item.financeData);
              setIncome(item.income);
              setExpense(item.expense);
            }
            setFinanceData(item.financeData);
            setIncome(item.income);
            setExpense(item.expense);
          }
          // } else {
          //   setColumn([]);
          //   setFinanceData([]);
          //   setExpense(0);
          //   setIncome(0);
          // }
        } else {
          const selectedMonth = `${year}-${month}`;
          const formattedMonth = moment(selectedMonth).format("YYYY-MM");

          if (transactionItem.by_month[formattedMonth]) {
            // item = localStorage.getItem(formattedMonth);
            let item = transactionItem.by_month[formattedMonth];
            // let parsedItem = JSON.parse(item);
            console.log(item);

            if (isMounted.current) {
              setFinanceData(item.financeData);
              setIncome(item.income);
              setExpense(item.expense);
            }
          }
          // } else {
          //   setColumn([]);
          //   setFinanceData([]);
          //   setExpense(0);
          //   setIncome(0);
          // }
        }

        if (isMounted.current) {
          setColumn(initialColumns);
        }
      }
    };

    if (userloaded && transactionItem) {
      console.log("User is loaded, proceeding to update data.");
      updateData();
    }

    return () => {
      isMounted.current = false; // Cleanup function to set isMounted to false when component is unmounted
    };
  }, [month, year, day, weekday, currentMode, userloaded, transactionItem]);
  const onPanelChange = (value, mode) => {
    const formattedDate = value.format("YYYY-MM-DD");
    setCurrentMode(mode);
    setYear(value.year()); // 获取年份
    // 获取月份，注意月份是从0开始的，所以加1
    console.log(`Panel Change: Date: ${formattedDate}, Mode: ${mode}`);
    console.log(
      `Panel Change: Year: ${value.year()}, Month: ${value.month() + 1}`
    );
  };

  const onDateSelect = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const newWeekday = value.format("dddd"); // 获取星期几
    const newDay = value.format("DD-MM");

    setMonth(value.month() + 1);

    setWeekday(newWeekday);
    setDay(newDay);
    console.log(`Date Select: Date: ${formattedDate}, Weekday: ${newWeekday}`);
  };

  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="responsive-calendar">
                <Calendar
                  fullscreen={false}
                  onPanelChange={onPanelChange}
                  onSelect={onDateSelect}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <div className="card-container">
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                  {currentMode === "month" ? (
                    <p>
                      {day} {weekday} Expense: {expense} Income: {income}
                    </p>
                  ) : (
                    <p>
                      {label} Expense: {expense} Income: {income}
                    </p>
                  )}
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
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CalendarBill;
