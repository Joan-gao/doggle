import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const canRecord = true; // 写个判断逻辑

function ChatBotTest() {
  const wrapper = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      popContainer: wrapper.current,
      // 语音输入
      makeRecorder({ ctx }) {
        let recognition;
        // 检查浏览器是否支持 Web Speech API
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onstart = () => {
            console.log('start recording');
          };

          recognition.onresult = (event) => {
            console.log('onresult triggered');
            const transcript = event.results[0][0].transcript;
            console.log('recognized text:', transcript);
            // 识别到文本后自动回复
            console.log('Preparing to send postMessage');
            ctx.postMessage({
              type: 'text',
              content: {
                text: `I heard: ${transcript}`,
              },
              position: 'left',
            });
            console.log('postMessage sent');
          };

          recognition.onerror = (event) => {
            console.log('recognition error:', event.error);
          };

          recognition.onend = () => {
            console.log('stop recording');
          };
        } else {
          console.log('SpeechRecognition not supported');
        }
        return {
          // 是否支持语音输入，
          canRecord: !!recognition,
          onStart() {
            if (recognition) {
              console.log('Starting recognition');
              recognition.start();
            }
          },
          onEnd() {
            if (recognition) {
              console.log('Stopping recognition');
              recognition.stop();
            }
          },
          onCancel() {
            if (recognition) {
              console.log('Cancelling recognition');
              recognition.stop();
            }
          },
        };
      },
      config: {
        lang: 'en-US',
        // 当支持语音时默认用语音输入
        inputType: canRecord ? 'voice' : 'text',
        navbar: {
          title: 'Doggle 🐾',
        },
        toolbar: [
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
      // 文本回复
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
          console.log('Send method called');
          console.log('Message:', msg);

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
                case 'What features does doggle support?':
                  responseText =
                    'I can help you with voice input 🎤, image recognition 📸, and file text recognition 📄. ' +
                    'I also love analyzing your bills based on your personal info, helping you understand your spending habits, ' +
                    'and giving you pawsome suggestions, woof! 🐶✨';
                  break;
                case 'How to start bookkeeping with doggle?':
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
            }, 1000);
          });
        },
      },
      // 图片文件上传
      handlers: {
        onToolbarClick(item, ctx) {
          //图片上传
          if (item.type === 'image') {
            ctx.util.chooseImage({
              multiple: true, // 是否可多选
              success(e) {
                if (e.files) {
                  // 如果有 h5 上传的图
                  const file = e.files[0];
                  // 先展示图片
                  ctx.appendMessage({
                    type: 'image',
                    content: {
                      picUrl: URL.createObjectURL(file),
                    },
                    position: 'right',
                  });
                  ctx.postMessage({
                    type: 'text',
                    content: {
                      text: `Photo received`,
                    },
                    position: 'left',
                  });
                }
              },
            });
          }
          // 文件上传
          else if (item.type === 'file') {
            // 创建一个隐藏的文件输入元素
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.xls,.xlsx,.doc,.docx';
            input.style.display = 'none';

            // 当文件选择完成时处理文件
            input.onchange = (event) => {
              const file = event.target.files[0];
              if (file) {
                const allowedTypes = [
                  'application/pdf',
                  'application/vnd.ms-excel',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ];
                if (allowedTypes.includes(file.type)) {
                  // 文件类型检查通过
                  // 可以选择在前端展示文件信息
                  ctx.appendMessage({
                    type: 'file',
                    content: {
                      fileName: file.name,
                      fileType: file.type,
                    },
                    position: 'right',
                  });

                  // 自动回复 "文件已收到"
                  ctx.postMessage({
                    type: 'text',
                    content: {
                      text: `file ${file.name} received`,
                    },
                    position: 'left',
                  });
                } else {
                  ctx.postMessage({
                    type: 'text',
                    content:
                      "Woof woof! 🐾 This file type isn't my favorite! Please upload a PDF, Excel, or Word file. 🐶✨",
                    position: 'left',
                  });
                }
              }
            };

            // 触发文件选择对话框
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          }
        },
      },
    });
    bot.run();
  }, []);

  return <div style={{ height: '100%' }} ref={wrapper} />;
}

export default ChatBotTest;
