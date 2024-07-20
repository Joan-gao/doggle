import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const ChatApp = window.ChatSDK.ChatApp;

function ChatBotTest() {
  const wrapper = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      popContainer: wrapper.current,
      config: {
        navbar: {
          title: 'AI Bot',
        },
        toolbar: [
          {
            type: 'speech',
            icon: 'mic',
            title: 'audio',
          },
          {
            type: 'image',
            icon: 'image',
            title: 'photo',
          },
          {
            type: 'file',
            icon: 'file',
            title: 'file',
          },
        ],
        robot: {
          avatar: '//www.pnglog.com/xtTTFV.jpg',
        },
        messages: [
          // 文本自动回复
          {
            type: 'text',
            content: {
              text: "Woof woof! 🐾 I'm Doggle, your best bookkeeping pup! 💰 Let's keep track of your finances together! 🐶✨",
            },
          },
          // 卡片信息
          {
            type: 'card',
            content: {
              code: 'promotion',
              data: {
                array: [
                  {
                    type: 'recommend',
                    list: [
                      {
                        title: 'What features does AI bot support?',
                        hot: true,
                        content: 'What features does AI bot support?',
                      },
                      {
                        title: 'How to start AI bookkeeping?',
                        hot: true,
                        content: 'How to start AI bookkeeping?',
                      },
                      {
                        title: 'How to view my bills?',
                        content: 'How to view my bills?',
                      },
                      {
                        title: 'How to edit or delete bills?',
                        content: 'How to edit or delete bills?',
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        // 快捷短语
        quickReplies: [
          { name: 'Spent $50 on taxi' },
          { name: 'Spent $20 on dinner last week' },
          {
            name: 'Received $5000 salary yesterday, spent $50 on haircut, and $70 on groceries',
          },
        ],
      },
      requests: {
        /*
         *
         * 问答接口
         * @param {object} msg - 消息
         * @param {string} msg.type - 消息类型
         * @param {string} msg.content - 消息内容
         * @return {object}
         */
        send: function (msg) {
          console.log('Message Content:', msg.content);

          return new Promise((resolve) => {
            setTimeout(() => {
              let responseText;

              switch (msg.content.text) {
                case 'Spent $50 on taxi':
                  responseText =
                    'Recorded. 🐾\nBill 1\nDate: 2024-07-19\nCategory: Transport\n' +
                    'Expense: $50\nDescription: Taxi\nAccount Book: Default account book';
                  break;
                case 'Spent $20 on dinner last week':
                  responseText =
                    'Recorded. 🐾\nBill 1\nDate: 2024-07-12\nCategory: Meal\n' +
                    'Expense: $20\nDescription: dinner last week\nAccount Book: Default account book';
                  break;
                case 'Received $5000 salary yesterday, spent $50 on haircut, and $70 on groceries':
                  responseText =
                    'Recorded. 🐾\nBill 1\nDate: 2024-07-18\nCategory: Salary\nIncome: $5000\n' +
                    'Description: salary yesterday\nAccount Book: Default account book\n' +
                    'Bill 2\nDate: 2024-07-18\nCategory: Beauty\nExpense: $50\n' +
                    'Description: haircut\nAccount Book: Default account book\n' +
                    'Bill 3\nDate: 2024-07-18\nCategory: Shopping\nExpense: $70\n' +
                    'Description: groceries\nAccount Book: Default account book';
                  break;
                case 'What features does AI bot support?':
                  responseText =
                    'I can help you with voice input 🎤, image recognition 📸, and file text recognition 📄. ' +
                    'I also love analyzing your bills based on your personal info, helping you understand your spending habits, ' +
                    'and giving you pawsome suggestions, woof! 🐶✨';
                  break;
                case 'How to start AI bookkeeping?':
                  responseText =
                    'First, fill in some basic info about yourself 💗. Then you can start bookkeeping! ' +
                    'When you log an expense or income, just provide the date, event, and amount 📝. ' +
                    'You can type it in or even bark it to me 🐾. Got a receipt? Snap a pic and upload it 📸. ' +
                    'For bank statements, just upload the Excel or PDF file 📂. ' +
                    'Let’s get your finances in order, woof! 🐶✨';
                  break;
                case 'How to view my bills?':
                  responseText =
                    ' You can sniff out bill analysis on the dashboard page anytime to understand the ' +
                    'proportion of spending categories, and daily, weekly, and monthly income and expenditure 📊. ' +
                    'For detailed bills each day, just wag your way to the calendar page and click on the date 🗓️. ' +
                    'Pawsome, woof! 🐶✨';
                  break;
                case 'How to edit or delete bills?':
                  responseText =
                    'Need to edit or delete bills? No worries! 🐾 If the bill was entered through conversation, ' +
                    'just reply with the modification or deletion ✅.' +
                    'On the calendar page 📅, click on a specific date, find the bill entry, and then swipe left to edit or delete it manually 📝. ' +
                    'Easy peasy, woof woof! 🐶✨';
                  break;
                default:
                  responseText = `Received: ${msg.content.text}`;
              }

              resolve({
                type: 'text',
                content: {
                  text: responseText,
                },
              });
            }, 500);
          });
        },
      },
      handlers: {},
    });
    bot.run();
  }, []);

  return <div style={{ height: '100%' }} ref={wrapper} />;
}

export default ChatBotTest;
