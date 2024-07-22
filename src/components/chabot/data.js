import React from "react";
import { Upload, Button } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import avatar from "../chabot/avatar.jpg";

export const initialMessages = [
  {
    type: "system",
    content: { text: "Alibaba Cloud Intelligent Chatbot at your service" },
  },
  {
    type: "card",
    content: {
      image: "//gw.alicdn.com/tfs/TB1Xv5_vlr0gK0jSZFnXXbRRXXa-427-240.png",
      title: "Card title",
      text: "Card content",
      button1Text: "Default button",
      button2Text: "Primary button",
    },
  },
];

export const defaultQuickReplies = [
  {
    icon: "message",
    name: "Contact Support",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "Phrase 1",
    isNew: true,
  },
  {
    name: "Phrase 2",
    isHighlight: true,
  },
  {
    name: "Phrase 3",
  },
];

export const botConfig2 = {
  config: {
    navbar: {
      title: "AI Bot",
    },
    toolbar: [
      {
        type: "speech",
        icon: "mic",
        title: "audio",
      },
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
      {
        type: "text",
        content: {
          text: "Hi, I'm your bookkeeping AI Bot. Let's start keeping track of your finances together!",
        },
      },
      {
        type: "card",
        content: {
          code: "promotion",
          data: {
            array: [
              {
                image:
                  "//alime-base.oss-cn-beijing.aliyuncs.com/avatar/alime-base.oss-cn-beijing-internal.aliyuncs.com1569811067816-首页推荐卡底图（售前）.jpg",
                toggle:
                  "//gw.alicdn.com/tfs/TB1D79ZXAL0gK0jSZFtXXXQCXXa-100-100.png",
                type: "recommend",
                list: [
                  {
                    title: "What features does AI bot support?",
                    hot: true,
                    content: "What features does AI bot support?",
                  },
                  {
                    title: "How to start AI bookkeeping?",
                    hot: true,
                    content: "How to start AI bookkeeping?",
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
    // 快捷短语
    quickReplies: [
      { name: "Spent $50 on taxi" },
      { name: "Spent $20 on dinner last week" },
      {
        name: "Received $5000 salary yesterday, spent $50 on haircut, and $70 on groceries",
      },
    ],
  },
  requests: {
    /* ... */
  },
  handlers: {},
};
