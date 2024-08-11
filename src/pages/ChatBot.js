import React, { useEffect, useRef, useState } from "react";
import { useStore, useAuth } from "../context/UserAuth";
import axios from "axios";
import { ImportOutlined, NodeExpandOutlined } from "@ant-design/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import LoginReminder from "../components/other/LogInReminder";
import * as fs from "fs";
import { resolve } from "path";
// import { REPL_MODE_STRICT } from "reply";

const canRecord = true; // 写个判断逻辑

function ChatBot() {
  const wrapper = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);

  dotenv.config();
  const genAI = new GoogleGenerativeAI(
    "AIzaSyD6jWmAmnJqKjRsKZcUPup8oHMzBtAmqC0"
  );
  const gemini_pro_vision = genAI.getGenerativeModel({
    model: "gemini-pro-vision",
  });
  const gemini_flash = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash",
  });
  const gemini_pro = genAI.getGenerativeModel({ model: "models/gemini-pro" });

  const chat = gemini_flash.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  // get user id
  useAuth();
  const { user } = useStore();

  // console.log(user);
  // if (!user) {
  //   window.location.href = "/";
  // }
  // console.log(user.user.id);

  function getCurrentDateFormatted() {
    // Create a new Date object for the current date and time
    const currentDate = new Date();

    // Extract the year, month, and day
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Months are zero-based
    let day = currentDate.getDate();

    // Ensure month and day are in two-digit format
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  async function blobUrlToBase64(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function fileToGenerativePart(filePath, mimeType) {
    const data = blobUrlToBase64(filePath);
    return {
      inlineData: {
        data,
        mimeType,
      },
    };
  }

  async function postData(apiUrl, user_input) {
    try {
      const response = await axios.post(
        apiUrl,
        {
          input: user_input,
        },
        {
          headers: {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        }
      );
      console.log(response.data);
      return JSON.stringify(response.data); // Optionally, return JSON string of the data
    } catch (error) {
      console.error("There was a problem with the Axios request:", error);
      return "there is an error"; // Return the error message
    }
  }

  async function getdata(apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);
      return JSON.stringify(response.data); // Optionally, return JSON string of the data
    } catch (error) {
      console.error("There was a problem with the Axios request:", error);
      return "there is an error"; // Return the error message
    }
  }

  
  async function check_file_status(formData, url) {
    try {
      while (true) {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
  
        const fetchData = await response.json(); // Parse the JSON response
  
        console.log(fetchData);
  
        if (fetchData.status === "True" || fetchData.status === "true" || fetchData.status === true) {
          return { reply: fetchData.reply, count: fetchData.count };
        } else {
          console.log("Waiting for 30 seconds before the next check...");
          await new Promise((resolve) => setTimeout(resolve, 30000));
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }

  async function uploadFile(formData, url) {
    try {
      const response = fetch(url, {
        method: "POST",
        body: formData,
      });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.json();

      // // Save the returned data into a variable
      // const analysisResult = data;

      // // Handle the response from the server
      // console.log("Success:", analysisResult);
      // console.log(analysisResult.reply);
      // return { reply: analysisResult.reply, count: analysisResult.count };
    } catch (error) {
      console.error("Error:", error);
      return null; // Handle the error appropriately, possibly returning null or a specific error value
    }
  }

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
            console.log("recognized text:", transcript);
            // auto reply for text
            console.log("Preparing to send postMessage");
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
        lang: "en-US",
        // default support voice input
        inputType: canRecord ? "voice" : "text",
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
                        title: "What features does doggle support?",
                        hot: true,
                        content: "What features does doggle support?",
                      },
                      {
                        title: "How to start bookkeeping with doggle?",
                        hot: true,
                        content: "How to start bookkeeping with doggle?",
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
            name: "Delete date: 2024-08-05 amount: $100 description: dinner",
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
        send: async function (msg) {
          // Make sure your function is asynchronous
          console.log("Send method called");
          console.log("Message:", msg);

          let responseText;

          switch (msg.content.text) {
            case "What features does doggle support?":
              responseText =
                "I can help you with voice input 🎤, image recognition 📸, and file text recognition 📄. " +
                "I also love analyzing your bills based on your personal info, helping you understand your spending habits, " +
                "and giving you pawsome suggestions, woof! 🐶✨";
              break;

            case "How to start bookkeeping with doggle?":
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
              let reply;
              let str = msg.content.text;
              str = str.split(" ");
              let firstword = str[0];
              console.log(user);
              if (firstword === "Spent" || firstword === "spent") {
                console.log("Spent");
                reply = await postData(
                  "https://doogle-1c3b68536bb7.herokuapp.com/add_transaction/" +
                    user.user.id,
                  msg.content.text
                );
                reply = JSON.parse(reply).data;
                console.log(reply);
              } else if (firstword === "Update" || firstword === "update") {
                console.log("Update");
                reply = await postData(
                  "https://doogle-1c3b68536bb7.herokuapp.com/update_transaction/" +
                    user.user.id,
                  msg.content.text
                );
                reply = JSON.parse(reply).data;
                console.log(reply);
              } else if (firstword === "Delete" || firstword === "delete") {
                console.log("Delete");
                reply = await postData(
                  "https://doogle-1c3b68536bb7.herokuapp.com/delete_transaction/" +
                    user.user.id,
                  msg.content.text
                );
                reply = JSON.parse(reply).data;
                console.log(reply);
              } else if (firstword === "Search" || firstword === "search") {
                console.log("Search");
                reply = await postData(
                  "https://doogle-1c3b68536bb7.herokuapp.com/search_transaction/" +
                    user.user.id,
                  msg.content.text
                );
                reply = JSON.parse(reply).data;
                console.log(reply);
              } else {
                // if (msg.content.type === "photo"){ //
                //   console.log('photo type');
                //   const prompt = "describe the image";

                //   const imageParts = [fileToGenerativePart(msg.content.url, "image/jpeg")]

                //   const result = await gemini_pro_vision.generateContent([prompt, ...imageParts]);
                //   const response = await result.response;
                //   const text = response.text();

                //   responseText = text;

                // } else
                if (
                  msg.content.type === "file" ||
                  msg.content.type === "photo"
                ) {
                  console.log("file type");
                  uploadFile(
                    msg.content.formData,
                    "https://doogle-1c3b68536bb7.herokuapp.com/upload_file/" +
                      +user.user.id
                  );
                  console.log("Wait for result");
                  const return_obj = await check_file_status(msg.content.formData, "https://doogle-1c3b68536bb7.herokuapp.com/get_file_analyze");

                  reply = return_obj.reply;
                  if (return_obj.count === "0") {
                    //
                  } else {
                    reply += `\n\n${return_obj.count} transactions has been added`;
                  }
                } else {
                  const res_1 = await gemini_pro.generateContent(
                    "Can you tell me whether the following text is a general question or financial (categorize anything relate to money and finance into finance question): " +
                      msg.content.text +
                      "just return 1 for general question 2 for financial question without anything else"
                  );

                  const question_type = res_1.response.text();
                  console.log(question_type);

                  if (
                    question_type === "1" ||
                    question_type.indexOf("General") != -1
                  ) {
                    reply = await chat.sendMessage(
                      msg.content.text +
                        "(Incorporate informal and friendly language and Include emojis, playful phrases, and a touch of humor)"
                    );
                    const response = await reply.response;
                    const text = response.text();
                    reply = text;
                    console.log(reply);
                  } else if (
                    question_type === "2" ||
                    question_type.indexOf("Financial") != -1
                  ) {
                    reply = await postData(
                      "https://doogle-1c3b68536bb7.herokuapp.com/info/" +
                        user.user.id,
                      msg.content.text
                    );
                    reply = JSON.parse(reply).data;
                    console.log(reply);
                  }
                }
              }
              responseText = "🐾🐾 " + reply + " Woof Woof 🐶✨"; // Await the async function to get the response
          }

          return new Promise((resolve) => {
            setTimeout(() => {
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
          if (item.type === "image") {
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

                  const formData = new FormData();
                  formData.append("file", file);
                  ctx.postMessage({
                    type: "text",
                    content: {
                      text: `Photo received`,
                      type: "photo",
                      formData: formData,
                    },
                    position: "left",
                  });
                }
              },
            });
          }
          // upload file
          else if (item.type === "file") {
            // create a hide file as input
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf,.xls,.xlsx,.doc,.docx";
            input.style.display = "none";
            input.onchange = (event) => {
              const file = event.target.files[0];
              console.log(file);
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

                  const formData = new FormData();
                  formData.append("file", file);
                  // auto reply
                  ctx.postMessage({
                    type: "text",
                    content: {
                      text: `file ${file.name} received it might takes 1-2 mintues to process your file`,
                      type: "file",
                      formData: formData,
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

  return user ? (
    <div style={{ height: "100%" }} ref={wrapper} />
  ) : (
    <LoginReminder />
  );
}

export default ChatBot;
