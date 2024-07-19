import React from 'react';
import { Upload, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

export const initialMessages = [
  {
    type: 'system',
    content: { text: 'Alibaba Cloud Intelligent Chatbot at your service' },
  },
  {
    type: 'card',
    content: {
      image: '//gw.alicdn.com/tfs/TB1Xv5_vlr0gK0jSZFnXXbRRXXa-427-240.png',
      title: 'Card title',
      text: 'Card content',
      button1Text: 'Default button',
      button2Text: 'Primary button',
    },
  },
];

export const defaultQuickReplies = [
  {
    icon: 'message',
    name: 'Contact Support',
    isNew: true,
    isHighlight: true,
  },
  {
    name: 'Phrase 1',
    isNew: true,
  },
  {
    name: 'Phrase 2',
    isHighlight: true,
  },
  {
    name: 'Phrase 3',
  },
];

export const botConfig2 = {
  config: {
    navbar: {
      title: '智能助理',
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
      avatar: '//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg',
    },
    messages: [
      {
        type: 'system',
        content: {
          text: '智能助理进入对话，为您服务',
        },
      },
      {
        type: 'text',
        content: {
          text: '浙江智能助理为您服务，请问有什么可以帮您？',
        },
      },
      {
        type: 'image',
        content: {
          picUrl:
            'https://gw.alicdn.com/tfs/TB1j2Y3xUY1gK0jSZFMXXaWcVXa-602-337.png',
        },
      },
      {
        type: 'card',
        content: {
          code: 'promotion',
          data: {
            array: [
              {
                image:
                  '//alime-base.oss-cn-beijing.aliyuncs.com/avatar/alime-base.oss-cn-beijing-internal.aliyuncs.com1569811067816-首页推荐卡底图（售前）.jpg',
                toggle:
                  'https://gw.alicdn.com/tfs/TB1D79ZXAL0gK0jSZFtXXXQCXXa-100-100.png',
                type: 'recommend',
                list: [
                  {
                    title: '收到商品不新鲜怎么办？',
                    hot: true,
                    content: '收到商品不新鲜怎么办？',
                  },
                  {
                    title: '怎么改配送时间/地址/电话？',
                    hot: true,
                    content: '配送时间/地址/电话错了，怎么修改',
                  },
                  {
                    title: '我的订单什么时间配送',
                    content: '我的订单什么时间配送',
                  },
                  {
                    title: '已下单，还能临时加/减商品吗？',
                    content: '已下单，还能临时加/减商品吗？',
                  },
                ],
              },
              {
                image:
                  'https://gw.alicdn.com/tfs/TB114P3XHY1gK0jSZTEXXXDQVXa-400-372.jpg',
                action: 'send',
                text: '点此学习美食做法',
                type: 'default',
                title: '热门菜谱',
                params: {
                  content: '热门菜谱',
                },
              },
              {
                image:
                  'https://gw.alicdn.com/tfs/TB1rsT0Xxv1gK0jSZFFXXb0sXXa-400-358.jpg',
                action: 'send',
                text: '看看你家的天气吧',
                type: 'default',
                title: '天气查询',
                params: {
                  content: '天气查询',
                },
              },
            ],
          },
        },
      },
    ],
    // 快捷短语
    quickReplies: [
      { name: '健康码颜色' },
      { name: '入浙通行申报' },
      { name: '健康码是否可截图使用' },
      { name: '健康通行码适用范围' },
      { name: '最美战疫人有哪些权益' },
      { name: '我要查社保' },
      { name: '办理居住证需要什么材料' },
      { name: '公共支付平台' },
      { name: '浙江省定点医院清单' },
      { name: '智能问诊' },
    ],
  },
  requests: {
    /* ... */
  },
  handlers: {},
};
