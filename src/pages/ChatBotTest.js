import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
const canRecord = true; // 写个判断逻辑

function ChatBotTest() {
  const wrapper = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      popContainer: wrapper.current,
      // voice input
      makeRecorder({ ctx }) {
        let recognition;
        // check if support Web Speech API
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = "en-US";

          recognition.onstart = () => {
            console.log("start recording");
          };

          recognition.onresult = (event) => {
            console.log("onresult triggered");
            const transcript = event.results[0][0].transcript;
            console.log('recognized text:', transcript);
            // auto reply for text
            console.log('Preparing to send postMessage');
            ctx.postMessage({
              type: "text",
              content: {
                text: `I heard: ${transcript}`,
              },
              position: "left",
            });
            console.log("postMessage sent");
          };

          recognition.onerror = (event) => {
            console.log("recognition error:", event.error);
          };

          recognition.onend = () => {
            console.log("stop recording");
          };
        } else {
          console.log("SpeechRecognition not supported");
        }
        return {
          // if support voice input
          canRecord: !!recognition,
          onStart() {
            if (recognition) {
              console.log("Starting recognition");
              recognition.start();
            }
          },
          onEnd() {
            if (recognition) {
              console.log("Stopping recognition");
              recognition.stop();
            }
          },
          onCancel() {
            if (recognition) {
              console.log("Cancelling recognition");
              recognition.stop();
            }
          },
        };
      },
      config: {
        lang: 'en-US',
        // default support voice input
        inputType: canRecord ? 'voice' : 'text',
        navbar: {
          title: "Doggle 🐾",
        },
        toolbar: [
          {
            type: "image",
            icon: "image",
            title: "photo",
          },
          {
            type: "file",
            icon: "file",
            title: "file",
          },
        ],
        robot: {
          avatar: "//www.pnglog.com/xtTTFV.jpg",
        },
        messages: [
          // text auto reply
          {
            type: "text",
            content: {
              text: "Woof woof! 🐾 I'm Doggle, your best bookkeeping pup! 💰 Let's keep track of your finances together! 🐶✨",
            },
          },
          // card info
          {
            type: "card",
            content: {
              code: "promotion",
              data: {
                array: [
                  {
                    type: "recommend",
                    list: [
                      {
                        title: 'What features does doggle support?',
                        hot: true,
                        content: 'What features does doggle support?',
                      },
                      {
                        title: 'How to start bookkeeping with doggle?',
                        hot: true,
                        content: 'How to start bookkeeping with doggle?',
                      },
                      {
                        title: "How to view my bills?",
                        content: "How to view my bills?",
                      },
                      {
                        title: "How to edit or delete bills?",
                        content: "How to edit or delete bills?",
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        // quick autoreply
        quickReplies: [
          { name: "Spent $50 on taxi" },
          { name: "Spent $20 on dinner last week" },
          {
            name: "Received $5000 salary yesterday, spent $50 on haircut, and $70 on groceries",
          },
        ],
      },
      // text reply
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
          console.log("Send method called");
          console.log("Message:", msg);

          return new Promise((resolve) => {
            setTimeout(() => {
              let responseText;

              switch (msg.content.text) {
                case "Spent $50 on taxi":
                  responseText =
                    "Recorded. 🐾\nBill 1\nDate: 2024-07-19\nCategory: Transport\n" +
                    "Expense: $50\nDescription: Taxi\nAccount Book: Default account book";
                  break;
                case "Spent $20 on dinner last week":
                  responseText =
                    "Recorded. 🐾\nBill 1\nDate: 2024-07-12\nCategory: Meal\n" +
                    "Expense: $20\nDescription: dinner last week\nAccount Book: Default account book";
                  break;
                case "Received $5000 salary yesterday, spent $50 on haircut, and $70 on groceries":
                  responseText =
                    "Recorded. 🐾\nBill 1\nDate: 2024-07-18\nCategory: Salary\nIncome: $5000\n" +
                    "Description: salary yesterday\nAccount Book: Default account book\n" +
                    "Bill 2\nDate: 2024-07-18\nCategory: Beauty\nExpense: $50\n" +
                    "Description: haircut\nAccount Book: Default account book\n" +
                    "Bill 3\nDate: 2024-07-18\nCategory: Shopping\nExpense: $70\n" +
                    "Description: groceries\nAccount Book: Default account book";
                  break;

                case 'What features does doggle support?':
                  responseText =
                    "I can help you with voice input 🎤, image recognition 📸, and file text recognition 📄. " +
                    "I also love analyzing your bills based on your personal info, helping you understand your spending habits, " +
                    "and giving you pawsome suggestions, woof! 🐶✨";
                  break;

                case 'How to start bookkeeping with doggle?':
                  responseText =
                    "First, fill in some basic info about yourself 💗. Then you can start bookkeeping! " +
                    "When you log an expense or income, just provide the date, event, and amount 📝. " +
                    "You can type it in or even bark it to me 🐾. Got a receipt? Snap a pic and upload it 📸. " +
                    "For bank statements, just upload the Excel or PDF file 📂. " +
                    "Let’s get your finances in order, woof! 🐶✨";
                  break;
                case "How to view my bills?":
                  responseText =
                    " You can sniff out bill analysis on the dashboard page anytime to understand the " +
                    "proportion of spending categories, and daily, weekly, and monthly income and expenditure 📊. " +
                    "For detailed bills each day, just wag your way to the calendar page and click on the date 🗓️. " +
                    "Pawsome, woof! 🐶✨";
                  break;
                case "How to edit or delete bills?":
                  responseText =
                    "Need to edit or delete bills? No worries! 🐾 If the bill was entered through conversation, " +
                    "just reply with the modification or deletion ✅." +
                    "On the calendar page 📅, click on a specific date, find the bill entry, and then swipe left to edit or delete it manually 📝. " +
                    "Easy peasy, woof woof! 🐶✨";
                  break;
                default:
                  responseText = `Received: ${msg.content.text}`;
              }

              resolve({
                type: "text",
                content: {
                  text: responseText,
                },
              });
            }, 1000);
          });
        },
      },
      // photo, file upload
      handlers: {
        onToolbarClick(item, ctx) {
          //photo upload
          if (item.type === 'image') {
            ctx.util.chooseImage({
              multiple: true, 
              success(e) {
                if (e.files) {
                  // h5 upload
                  const file = e.files[0];
                  // show photo message
                  ctx.appendMessage({
                    type: "image",
                    content: {
                      picUrl: URL.createObjectURL(file),
                    },
                    position: "right",
                  });
                  ctx.postMessage({
                    type: "text",
                    content: {
                      text: `Photo received`,
                    },
                    position: "left",
                  });
                }
              },
            });
          }
          // upload file
          else if (item.type === 'file') {
            // create a hide file as input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.xls,.xlsx,.doc,.docx';
            input.style.display = 'none';
            input.onchange = (event) => {
              const file = event.target.files[0];
              if (file) {
                const allowedTypes = [
                  "application/pdf",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];
                if (allowedTypes.includes(file.type)) {
                  // check file 
                  ctx.appendMessage({
                    type: "file",
                    content: {
                      fileName: file.name,
                      fileType: file.type,
                    },
                    position: "right",
                  });

                  // auto reply
                  ctx.postMessage({
                    type: "text",
                    content: {
                      text: `file ${file.name} received`,
                    },
                    position: "left",
                  });
                } else {
                  ctx.postMessage({
                    type: "text",
                    content:
                      "Woof woof! 🐾 This file type isn't my favorite! Please upload a PDF, Excel, or Word file. 🐶✨",
                    position: "left",
                  });
                }
              }
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          }
        },
      },
    });
    bot.run();
  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}

export default ChatBotTest;
